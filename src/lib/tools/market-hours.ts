export interface MarketSession {
  id: string;
  name: string;
  city: string;
  country: string;
  utcOpenHour: number;  // 0-23 UTC
  utcCloseHour: number; // 0-23 UTC
  timezone: string;
  color: string;
  keyPairs: string[];
  shareOfVolume: string;
}

export const SESSIONS: MarketSession[] = [
  {
    id: "sydney",
    name: "Sydney Session",
    city: "Sydney",
    country: "Australia",
    utcOpenHour: 21,
    utcCloseHour: 6, // wraps past midnight (21:00 UTC to 06:00 UTC)
    timezone: "Australia/Sydney",
    color: "#0284c7", // Sky/Blue
    keyPairs: ["AUD/USD", "NZD/USD", "AUD/JPY"],
    shareOfVolume: "4% of global turnover",
  },
  {
    id: "tokyo",
    name: "Tokyo Session",
    city: "Tokyo",
    country: "Japan",
    utcOpenHour: 0,
    utcCloseHour: 9,
    timezone: "Asia/Tokyo",
    color: "#d97706", // Amber
    keyPairs: ["USD/JPY", "EUR/JPY", "GBP/JPY", "AUD/JPY"],
    shareOfVolume: "6% of global turnover",
  },
  {
    id: "london",
    name: "London Session",
    city: "London",
    country: "United Kingdom",
    utcOpenHour: 7,
    utcCloseHour: 16,
    timezone: "Europe/London",
    color: "#4f46e5", // Indigo
    keyPairs: ["EUR/USD", "GBP/USD", "EUR/GBP", "XAU/USD"],
    shareOfVolume: "38% of global turnover (Highest)",
  },
  {
    id: "new-york",
    name: "New York Session",
    city: "New York",
    country: "United States",
    utcOpenHour: 12,
    utcCloseHour: 21,
    timezone: "America/New_York",
    color: "#059669", // Emerald
    keyPairs: ["EUR/USD", "GBP/USD", "USD/CAD", "US500", "XAU/USD"],
    shareOfVolume: "19% of global turnover",
  },
];

export interface SessionStatus {
  session: MarketSession;
  isOpen: boolean;
  statusText: "OPEN" | "CLOSED";
  minutesUntilOpen: number;
  minutesUntilClose: number;
  timeRemainingText: string;
  progressPercent: number;
}

export function isHourInSession(currentUtcHourFraction: number, openHour: number, closeHour: number): boolean {
  if (openHour < closeHour) {
    return currentUtcHourFraction >= openHour && currentUtcHourFraction < closeHour;
  } else {
    // Wraps over midnight (e.g. 21 to 6)
    return currentUtcHourFraction >= openHour || currentUtcHourFraction < closeHour;
  }
}

export function getSessionStatuses(now: Date = new Date()): {
  currentUtcHours: number;
  currentUtcMinutes: number;
  sessions: SessionStatus[];
  activeOverlaps: string[];
} {
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const currentUtcFraction = utcHours + utcMinutes / 60;

  const statuses: SessionStatus[] = SESSIONS.map((s) => {
    const isOpen = isHourInSession(currentUtcFraction, s.utcOpenHour, s.utcCloseHour);

    let minutesUntilOpen = 0;
    let minutesUntilClose = 0;
    let progressPercent = 0;

    const currentTotalMins = utcHours * 60 + utcMinutes;
    const openTotalMins = s.utcOpenHour * 60;
    let closeTotalMins = s.utcCloseHour * 60;
    if (s.utcCloseHour <= s.utcOpenHour) {
      closeTotalMins += 24 * 60;
    }

    let adjustedCurrentMins = currentTotalMins;
    if (s.utcCloseHour <= s.utcOpenHour && currentTotalMins < s.utcCloseHour * 60) {
      adjustedCurrentMins += 24 * 60;
    }

    if (isOpen) {
      minutesUntilClose = closeTotalMins - adjustedCurrentMins;
      const totalDuration = closeTotalMins - openTotalMins;
      const elapsed = adjustedCurrentMins - openTotalMins;
      progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    } else {
      let openDiff = openTotalMins - currentTotalMins;
      if (openDiff < 0) openDiff += 24 * 60;
      minutesUntilOpen = openDiff;
    }

    const timeRemainingText = isOpen
      ? `Closes in ${Math.floor(minutesUntilClose / 60)}h ${minutesUntilClose % 60}m`
      : `Opens in ${Math.floor(minutesUntilOpen / 60)}h ${minutesUntilOpen % 60}m`;

    return {
      session: s,
      isOpen,
      statusText: isOpen ? "OPEN" : "CLOSED",
      minutesUntilOpen,
      minutesUntilClose,
      timeRemainingText,
      progressPercent,
    };
  });

  const activeNames = statuses.filter((st) => st.isOpen).map((st) => st.session.name.replace(" Session", ""));
  const activeOverlaps: string[] = [];

  if (activeNames.includes("London") && activeNames.includes("New York")) {
    activeOverlaps.push("London / New York Overlap (Peak Daily Liquidity: 12:00 – 16:00 UTC)");
  }
  if (activeNames.includes("Tokyo") && activeNames.includes("London")) {
    activeOverlaps.push("Tokyo / London Overlap (European Open Volatility: 07:00 – 09:00 UTC)");
  }
  if (activeNames.includes("Sydney") && activeNames.includes("Tokyo")) {
    activeOverlaps.push("Sydney / Tokyo Overlap (Asian Flow Confluence: 00:00 – 06:00 UTC)");
  }

  return {
    currentUtcHours: utcHours,
    currentUtcMinutes: utcMinutes,
    sessions: statuses,
    activeOverlaps,
  };
}
