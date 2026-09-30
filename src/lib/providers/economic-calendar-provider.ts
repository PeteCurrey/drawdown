/**
 * Canonical Economic Calendar Provider
 * Manages high-impact macroeconomic events (Central bank rates, CPI, NFP, GDP, PMI).
 * Enforces strict 'NO MOCK DATA' rule — returns empty array or real DB events.
 */

export interface EconomicCalendarEvent {
  id?: string;
  eventTime: string;      // ISO string
  currency: string;       // USD, EUR, GBP, JPY, AUD, CAD
  eventName: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actual?: string | null;
  forecast?: string | null;
  previous?: string | null;
  source: string;
}

/**
 * Retrieves today's and upcoming macroeconomic events from database
 */
export async function getUpcomingEconomicEvents(
  supabase?: any,
  limit: number = 10
): Promise<EconomicCalendarEvent[]> {
  if (supabase) {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('economic_calendar_events')
        .select('*')
        .gte('event_time', now)
        .order('event_time', { ascending: true })
        .limit(limit);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          eventTime: d.event_time,
          currency: d.currency,
          eventName: d.event_name,
          impact: d.impact,
          actual: d.actual,
          forecast: d.forecast,
          previous: d.previous,
          source: d.source || 'Canonical Provider',
        }));
      }
    } catch (err) {
      console.warn('[Economic Calendar Provider] DB fetch error:', err);
    }
  }

  // Strict rule: Never substitute mock data. Return empty array if not in DB.
  return [];
}
