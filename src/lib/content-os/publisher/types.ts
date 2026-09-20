import type { SocialChannel, ContentChannel, ContentAsset, SocialDeliveryStatus } from "../types";

export interface PreflightResult {
  ready: boolean;
  errors: string[];
}

export interface PublishResult {
  status: SocialDeliveryStatus;
  providerPostId?: string | null;
  publishedAt?: string | null;
  rawResponse?: Record<string, any>;
  failureReason?: string | null;
  idempotencyKey?: string;
}

export interface ScheduleResult {
  status: 'scheduled' | 'failed';
  providerSchedulingId?: string | null;
  scheduledAt?: string | null;
  failureReason?: string | null;
  rawResponse?: Record<string, any>;
}

export interface DeliveryStatusResult {
  status: SocialDeliveryStatus;
  providerPostId?: string | null;
  publishedAt?: string | null;
  rawResponse?: Record<string, any>;
  failureReason?: string | null;
}

export interface MetricsResult {
  impressions?: number | null;
  reach?: number | null;
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  clicks?: number | null;
  saves?: number | null;
  videoViews?: number | null;
  engagementRate?: number | null;
  rawMetrics?: Record<string, any>;
}

export interface SocialPublisher {
  readonly providerName: string;
  
  preflight(channelItem: ContentChannel, assets: ContentAsset[]): Promise<PreflightResult>;
  publish(channelItem: ContentChannel, assets: ContentAsset[], idempotencyKey?: string): Promise<PublishResult>;
  schedule(channelItem: ContentChannel, assets: ContentAsset[], scheduledTime: Date): Promise<ScheduleResult>;
  getDeliveryStatus(deliveryId: string, providerPostId?: string | null): Promise<DeliveryStatusResult>;
  retry(deliveryId: string, channelItem: ContentChannel, assets: ContentAsset[]): Promise<PublishResult>;
  cancel(providerSchedulingId: string): Promise<{ success: boolean; failureReason?: string }>;
  getMetrics(providerPostId: string, channel: SocialChannel): Promise<MetricsResult>;
}
