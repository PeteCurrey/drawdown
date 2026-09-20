import type { ContentItem, ContentPriority } from "./types";

export interface ScheduledSlot {
  slotId: string;
  targetDate: string; // YYYY-MM-DD
  dayOfWeek: string;
  suggestedTime: string; // e.g. "08:30"
  pillar: string;
  recommendedContentType: string;
  assignedContentItem?: ContentItem;
}

export interface InterruptionRecommendation {
  hasConflict: boolean;
  breakingNewsTitle?: string;
  breakingPriority?: ContentPriority;
  affectedSlot?: ScheduledSlot;
  recommendation: 'NONE' | 'CONSIDER_REPLACING' | 'MOVE_NEXT_POST' | 'INSERT_URGENT';
  rationale?: string;
}

export class CalendarPlannerService {
  /**
   * Editorial mix target: 4-5 quality opportunities per week over 30 days.
   * Rolling weekly distribution:
   * - Monday: Market Intelligence / Week Ahead (08:00)
   * - Tuesday: Education / Execution Concepts (12:00)
   * - Wednesday: Trader Psychology / Loss Management (14:30)
   * - Thursday: Historical Case Study / Quantitative Insight (16:00)
   * - Friday: Product / Tool Walkthrough or Weekly Recap (17:30)
   */
  static generate30DayTemplate(startDate: Date = new Date()): ScheduledSlot[] {
    const slots: ScheduledSlot[] = [];
    const current = new Date(startDate);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const pillarPlan: Record<number, { pillar: string; type: string; time: string }> = {
      1: { pillar: 'Market Intelligence', type: 'market_analysis', time: '08:00' },
      2: { pillar: 'Trading Education', type: 'educational', time: '12:00' },
      3: { pillar: 'Trader Psychology', type: 'opinion', time: '14:30' },
      4: { pillar: 'Historical Case Studies', type: 'case_study', time: '16:00' },
      5: { pillar: 'Quantitative Insights & Tools', type: 'product', time: '17:30' }
    };

    for (let day = 0; day < 30; day++) {
      const d = new Date(current);
      d.setDate(current.getDate() + day);
      const dayNum = d.getDay();

      if (pillarPlan[dayNum]) {
        const config = pillarPlan[dayNum];
        const dateStr = d.toISOString().split('T')[0];
        slots.push({
          slotId: `slot_${dateStr}_${config.time.replace(':', '')}`,
          targetDate: dateStr,
          dayOfWeek: dayNames[dayNum],
          suggestedTime: config.time,
          pillar: config.pillar,
          recommendedContentType: config.type
        });
      }
    }

    return slots;
  }

  /**
   * News Radar Interruption Recommendation Engine:
   * When high-priority or critical breaking news is detected, checks if it conflicts
   * with the next scheduled slot.
   * Does NOT silently overwrite the calendar. Flags clear operator recommendations.
   */
  static evaluateInterruption(
    breakingCandidate: {
      title: string;
      priority: ContentPriority;
      discoveredAt: string;
    },
    upcomingSlots: ScheduledSlot[]
  ): InterruptionRecommendation {
    if (breakingCandidate.priority !== 'critical' && breakingCandidate.priority !== 'high') {
      return { hasConflict: false, recommendation: 'NONE' };
    }

    const nextSlot = upcomingSlots.find(s => !!s.assignedContentItem);
    if (!nextSlot) {
      return {
        hasConflict: false,
        breakingNewsTitle: breakingCandidate.title,
        breakingPriority: breakingCandidate.priority,
        recommendation: 'INSERT_URGENT',
        rationale: "No immediate scheduled slot occupied. Recommend scheduling urgent breaking editorial draft."
      };
    }

    return {
      hasConflict: true,
      breakingNewsTitle: breakingCandidate.title,
      breakingPriority: breakingCandidate.priority,
      affectedSlot: nextSlot,
      recommendation: breakingCandidate.priority === 'critical' ? 'CONSIDER_REPLACING' : 'MOVE_NEXT_POST',
      rationale: `High-priority news detected ("${breakingCandidate.title}"). Operator recommendation: Consider delaying or moving scheduled post '${nextSlot.assignedContentItem?.title}' in favour of same-day breaking coverage.`
    };
  }
}
