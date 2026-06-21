export interface CentralBankRate {
  currency: string; bank: string; rate: number;
  lastChanged: string; trend: "hiking" | "cutting" | "holding"; nextMeeting: string;
}
export const CENTRAL_BANK_RATES: Record<string, CentralBankRate> = {
  USD: { currency:"USD", bank:"Federal Reserve",   rate:5.25, lastChanged:"2024-07-26", trend:"holding", nextMeeting:"2025-07-30" },
  EUR: { currency:"EUR", bank:"ECB",               rate:4.00, lastChanged:"2024-06-06", trend:"cutting", nextMeeting:"2025-07-24" },
  GBP: { currency:"GBP", bank:"Bank of England",   rate:4.75, lastChanged:"2024-11-07", trend:"cutting", nextMeeting:"2025-08-07" },
  JPY: { currency:"JPY", bank:"Bank of Japan",     rate:0.50, lastChanged:"2025-01-24", trend:"hiking",  nextMeeting:"2025-07-31" },
  CHF: { currency:"CHF", bank:"SNB",               rate:1.00, lastChanged:"2024-09-26", trend:"cutting", nextMeeting:"2025-09-25" },
  AUD: { currency:"AUD", bank:"RBA",               rate:4.35, lastChanged:"2024-11-05", trend:"holding", nextMeeting:"2025-08-05" },
  CAD: { currency:"CAD", bank:"Bank of Canada",    rate:3.25, lastChanged:"2024-12-11", trend:"cutting", nextMeeting:"2025-07-30" },
  NZD: { currency:"NZD", bank:"RBNZ",              rate:3.50, lastChanged:"2025-02-19", trend:"cutting", nextMeeting:"2025-07-09" },
};
export const STATIC_RATES_UPDATED = "2025-06-21";
