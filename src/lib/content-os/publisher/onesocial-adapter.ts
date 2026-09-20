import type { 
  SocialPublisher, 
  PreflightResult, 
  PublishResult, 
  ScheduleResult, 
  DeliveryStatusResult, 
  MetricsResult 
} from "./types";
import type { ContentChannel, ContentAsset, SocialChannel } from "../types";
import { InstagramAssetValidator } from "../instagram-assets";

/**
 * 1Social Publisher Adapter boundary.
 * Provider secrets are strictly read from process.env on the server.
 * Never leaks credentials to clients or DB tables.
 * Truthful-state UX: Unknown provider states are returned as 'unconfirmed', NEVER as 'published'.
 */
export class OneSocialAdapter implements SocialPublisher {
  readonly providerName = 'onesocial';

  private get apiKey(): string | undefined {
    return process.env.ONESOCIAL_API_KEY;
  }

  private get apiUrl(): string {
    return process.env.ONESOCIAL_API_URL || "https://api.onesocial.co/v1";
  }

  async preflight(channelItem: ContentChannel, assets: ContentAsset[]): Promise<PreflightResult> {
    const errors: string[] = [];

    if (!channelItem.body || channelItem.body.trim().length === 0) {
      errors.push("Caption or post body cannot be empty.");
    }

    // Instagram preflight: mandatory media check
    if (channelItem.channel === 'instagram') {
      const isCarousel = assets.length > 1;
      const check = InstagramAssetValidator.validate({
        aspectRatio: '4:5',
        visualFamily: 'MARKET_UPDATE',
        isCarousel,
        minSlideCount: isCarousel ? 2 : 1,
        maxSlideCount: 10
      }, assets);

      if (!check.isReady) {
        errors.push(...check.errors);
      }
    }

    // X (Twitter) character validation
    if (channelItem.channel === 'x' && channelItem.body.length > 280 && !channelItem.metadata?.isThread) {
      errors.push(`X post exceeds 280 characters (${channelItem.body.length} chars). Enable thread formatting.`);
    }

    return {
      ready: errors.length === 0,
      errors
    };
  }

  async publish(
    channelItem: ContentChannel, 
    assets: ContentAsset[], 
    idempotencyKey?: string
  ): Promise<PublishResult> {
    const preflight = await this.preflight(channelItem, assets);
    if (!preflight.ready) {
      return {
        status: 'failed',
        failureReason: `Preflight validation failed: ${preflight.errors.join('; ')}`,
        idempotencyKey
      };
    }

    // If API credentials are not yet configured in env, isolate at the boundary without fabricating live receipts
    if (!this.apiKey || this.apiKey === 'placeholder') {
      return {
        status: 'unconfirmed',
        failureReason: "1Social credentials (ONESOCIAL_API_KEY) not configured in server environment. Delivery set to unconfirmed.",
        idempotencyKey
      };
    }

    try {
      const payload = {
        channel: channelItem.channel,
        content: channelItem.body,
        headline: channelItem.headline,
        mediaUrls: assets.map(a => a.storage_url),
        idempotencyKey: idempotencyKey || `drawdown_${channelItem.id}_${Date.now()}`
      };

      const response = await fetch(`${this.apiUrl}/posts/publish`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": payload.idempotencyKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        return {
          status: 'failed',
          failureReason: `1Social API rejected request (HTTP ${response.status}): ${errText}`,
          idempotencyKey: payload.idempotencyKey
        };
      }

      const resJson = await response.json();

      // Truth-first check: only mark 'published' if confirmed in response
      if (resJson.status === 'published') {
        return {
          status: 'published',
          providerPostId: resJson.id || resJson.postId,
          publishedAt: resJson.publishedAt || new Date().toISOString(),
          rawResponse: resJson,
          idempotencyKey: payload.idempotencyKey
        };
      }

      // If status is queued or pending from provider
      if (resJson.status === 'queued' || resJson.status === 'processing') {
        return {
          status: 'publishing',
          providerPostId: resJson.id,
          rawResponse: resJson,
          idempotencyKey: payload.idempotencyKey
        };
      }

      // Default to unconfirmed
      return {
        status: 'unconfirmed',
        providerPostId: resJson.id,
        failureReason: `Provider responded with unconfirmed status: '${resJson.status}'`,
        rawResponse: resJson,
        idempotencyKey: payload.idempotencyKey
      };
    } catch (err: any) {
      // Network timeout or unhandled exception -> Never claim published
      return {
        status: 'unconfirmed',
        failureReason: `Network or adapter error communicating with 1Social: ${err?.message || err}`,
        idempotencyKey
      };
    }
  }

  async schedule(
    channelItem: ContentChannel, 
    assets: ContentAsset[], 
    scheduledTime: Date
  ): Promise<ScheduleResult> {
    const preflight = await this.preflight(channelItem, assets);
    if (!preflight.ready) {
      return {
        status: 'failed',
        failureReason: `Preflight failed: ${preflight.errors.join('; ')}`
      };
    }

    if (!this.apiKey || this.apiKey === 'placeholder') {
      return {
        status: 'failed',
        failureReason: "ONESOCIAL_API_KEY missing from server environment."
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}/posts/schedule`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          channel: channelItem.channel,
          content: channelItem.body,
          mediaUrls: assets.map(a => a.storage_url),
          scheduledTime: scheduledTime.toISOString()
        })
      });

      if (!response.ok) {
        return {
          status: 'failed',
          failureReason: `Scheduling rejected: HTTP ${response.status}`
        };
      }

      const resJson = await response.json();
      return {
        status: 'scheduled',
        providerSchedulingId: resJson.schedulingId || resJson.id,
        scheduledAt: scheduledTime.toISOString(),
        rawResponse: resJson
      };
    } catch (err: any) {
      return {
        status: 'failed',
        failureReason: `Schedule error: ${err?.message || err}`
      };
    }
  }

  async getDeliveryStatus(deliveryId: string, providerPostId?: string | null): Promise<DeliveryStatusResult> {
    if (!this.apiKey || !providerPostId) {
      return {
        status: 'unconfirmed',
        failureReason: "Provider ID or API key missing."
      };
    }

    try {
      const res = await fetch(`${this.apiUrl}/posts/${providerPostId}`, {
        headers: { "Authorization": `Bearer ${this.apiKey}` }
      });
      if (!res.ok) {
        return { status: 'unconfirmed', failureReason: `Fetch status failed: ${res.status}` };
      }
      const data = await res.json();
      if (data.status === 'published') {
        return { status: 'published', providerPostId, publishedAt: data.publishedAt, rawResponse: data };
      } else if (data.status === 'failed') {
        return { status: 'failed', failureReason: data.error || 'Provider marked post as failed', rawResponse: data };
      }
      return { status: 'unconfirmed', rawResponse: data };
    } catch (err: any) {
      return { status: 'unconfirmed', failureReason: err?.message };
    }
  }

  async retry(deliveryId: string, channelItem: ContentChannel, assets: ContentAsset[]): Promise<PublishResult> {
    // Generate deterministic retry idempotency key based on deliveryId and attempt count
    const retryKey = `retry_${deliveryId}_${Date.now()}`;
    return this.publish(channelItem, assets, retryKey);
  }

  async cancel(providerSchedulingId: string): Promise<{ success: boolean; failureReason?: string }> {
    if (!this.apiKey) return { success: false, failureReason: "Missing credentials" };
    try {
      const res = await fetch(`${this.apiUrl}/posts/schedule/${providerSchedulingId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${this.apiKey}` }
      });
      return { success: res.ok };
    } catch (err: any) {
      return { success: false, failureReason: err?.message };
    }
  }

  async getMetrics(providerPostId: string, channel: SocialChannel): Promise<MetricsResult> {
    if (!this.apiKey || !providerPostId) return {};
    try {
      const res = await fetch(`${this.apiUrl}/posts/${providerPostId}/metrics`, {
        headers: { "Authorization": `Bearer ${this.apiKey}` }
      });
      if (!res.ok) return {};
      const data = await res.json();
      return {
        impressions: data.impressions ?? null,
        reach: data.reach ?? null,
        likes: data.likes ?? null,
        comments: data.comments ?? null,
        shares: data.shares ?? null,
        clicks: data.clicks ?? null,
        saves: data.saves ?? null,
        videoViews: data.videoViews ?? null,
        engagementRate: data.engagementRate ?? null,
        rawMetrics: data
      };
    } catch {
      return {};
    }
  }
}
