import type { VisualFamily, ContentAsset } from "./types";

export interface InstagramAssetSpec {
  aspectRatio: '1:1' | '4:5' | '1.91:1';
  visualFamily: VisualFamily;
  isCarousel: boolean;
  minSlideCount?: number;
  maxSlideCount?: number;
  headlineOverlay?: string;
  chartRequirements?: {
    symbol?: string;
    metric?: string;
    period?: string;
  };
}

export interface InstagramPreflightCheck {
  isReady: boolean;
  errors: string[];
}

export class InstagramAssetValidator {
  /**
   * Validates media requirements for an Instagram post or carousel.
   * Instagram STRICTLY requires media before publication.
   */
  static validate(spec: InstagramAssetSpec, assets: ContentAsset[]): InstagramPreflightCheck {
    const errors: string[] = [];

    if (!assets || assets.length === 0) {
      return {
        isReady: false,
        errors: ["Instagram publication blocked: At least one media asset (image/video/carousel) is mandatory."]
      };
    }

    if (spec.isCarousel) {
      const minSlides = spec.minSlideCount || 2;
      const maxSlides = spec.maxSlideCount || 10;

      if (assets.length < minSlides) {
        errors.push(`Carousel requires at least ${minSlides} slides, but only ${assets.length} provided.`);
      }
      if (assets.length > maxSlides) {
        errors.push(`Carousel exceeds Instagram's limit of ${maxSlides} slides (received ${assets.length}).`);
      }
    }

    // Check aspect ratios
    const validRatios = new Set(['1:1', '4:5', '1.91:1']);
    assets.forEach((asset, idx) => {
      if (asset.aspect_ratio && !validRatios.has(asset.aspect_ratio)) {
        errors.push(`Asset #${idx + 1} has unsupported aspect ratio '${asset.aspect_ratio}'. Must be 1:1, 4:5, or 1.91:1.`);
      }
      if (!asset.storage_url) {
        errors.push(`Asset #${idx + 1} is missing a valid storage_url.`);
      }
    });

    return {
      isReady: errors.length === 0,
      errors
    };
  }
}
