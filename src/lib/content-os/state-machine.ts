// src/lib/content-os/state-machine.ts
import type { 
  ContentStatus, 
  SocialDeliveryStatus, 
  NewsVerificationStatus, 
  NewsEditorialStatus, 
  ContentItem 
} from "./types";

/**
 * Valid state transitions for Content Items:
 * idea -> draft -> review -> approved -> scheduled -> published
 * Any status -> archived
 */
const VALID_CONTENT_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  idea: ['draft', 'archived'],
  draft: ['review', 'archived'],
  review: ['approved', 'draft', 'archived'],
  approved: ['scheduled', 'published', 'draft', 'archived'],
  scheduled: ['published', 'approved', 'draft', 'archived'],
  published: ['archived'],
  archived: ['draft']
};

export interface TransitionValidationResult {
  isValid: boolean;
  error?: string;
}

export class ContentStateMachine {
  /**
   * Evaluates whether a content item can transition to the target status.
   * Enforces rules:
   * 1. Cannot skip states (e.g. draft directly to published without approved).
   * 2. Items with source_type === 'news' MUST have an approved_by / approved_at before becoming scheduled or published.
   * 3. Cannot re-publish already published content.
   */
  static validateContentTransition(
    item: Pick<ContentItem, 'status' | 'source_type' | 'approved_by' | 'approved_at'>,
    nextStatus: ContentStatus,
    approverId?: string
  ): TransitionValidationResult {
    const currentStatus = item.status;

    // Protection: Already published content cannot be re-published directly
    if (currentStatus === 'published' && nextStatus === 'published') {
      return {
        isValid: false,
        error: `Duplicate publication prevented: Content item is already published.`
      };
    }

    if (currentStatus === nextStatus) {
      return { isValid: true };
    }

    const allowed = VALID_CONTENT_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      return {
        isValid: false,
        error: `Invalid content transition: Cannot move from '${currentStatus}' to '${nextStatus}'. Allowed transitions: ${allowed.join(', ') || 'none'}`
      };
    }

    // Protection: News-derived content requires explicit human approval
    if (item.source_type === 'news') {
      if ((nextStatus === 'scheduled' || nextStatus === 'published') && !item.approved_by && !approverId) {
        return {
          isValid: false,
          error: `Approval policy violation: News-derived content requires human approval prior to being scheduled or published.`
        };
      }
    }

    // Protection: Already published content cannot be re-published directly
    if (currentStatus === 'published' && nextStatus === 'published') {
      return {
        isValid: false,
        error: `Duplicate publication prevented: Content item is already published.`
      };
    }

    return { isValid: true };
  }
}

/**
 * Valid transitions for Social Delivery Receipts:
 * queued -> publishing -> published | failed | unconfirmed | retrying | cancelled
 */
const VALID_DELIVERY_TRANSITIONS: Record<SocialDeliveryStatus, SocialDeliveryStatus[]> = {
  queued: ['publishing', 'cancelled', 'failed'],
  publishing: ['published', 'failed', 'retrying', 'unconfirmed', 'cancelled'],
  retrying: ['publishing', 'failed', 'unconfirmed', 'cancelled'],
  unconfirmed: ['published', 'failed', 'cancelled'],
  failed: ['retrying', 'cancelled'],
  published: [], // Terminal
  cancelled: []  // Terminal
};

export class SocialDeliveryStateMachine {
  /**
   * Enforces truthful delivery state transitions.
   * NEVER silently convert an unknown provider response or timeout to "published".
   */
  static validateDeliveryTransition(
    currentStatus: SocialDeliveryStatus,
    nextStatus: SocialDeliveryStatus,
    providerConfirmed: boolean = false
  ): TransitionValidationResult {
    if (currentStatus === nextStatus) {
      return { isValid: true };
    }

    const allowed = VALID_DELIVERY_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      return {
        isValid: false,
        error: `Invalid delivery status transition: Cannot move from '${currentStatus}' to '${nextStatus}'.`
      };
    }

    // Strict truth-first requirement
    if (nextStatus === 'published' && !providerConfirmed) {
      return {
        isValid: false,
        error: `Truthful state violation: Cannot mark delivery as 'published' without explicit provider receipt confirmation.`
      };
    }

    return { isValid: true };
  }
}

/**
 * News Candidate Verification & Editorial State Machine
 */
export class NewsCandidateStateMachine {
  static canDraft(verificationStatus: NewsVerificationStatus): boolean {
    return verificationStatus === 'verified' || verificationStatus === 'partially_verified';
  }

  static canPublish(verificationStatus: NewsVerificationStatus): boolean {
    // Phase 1 rule: Only verified candidates can transition to published Drawdown content
    return verificationStatus === 'verified';
  }
}
