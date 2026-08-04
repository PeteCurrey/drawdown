/**
 * Central Legal & Business Configuration for Drawdown.trading
 * Contracting Entity: Black & Rowan Management Group Limited t/a Drawdown
 * 
 * IMPORTANT: Do not scatter legal entity assumptions or hard-code contact emails
 * across individual pages. Import from this central configuration file instead.
 */

export const LEGAL_CONFIG = {
  tradingName: "Drawdown",
  contractingEntity: "Black & Rowan Management Group Limited",
  fullTradingEntity: "Black & Rowan Management Group Limited t/a Drawdown",
  
  // Verification Flags & Details
  // Set companyNumberVerified / registeredOfficeVerified to true when official Companies House details are confirmed.
  companyNumber: "LEGAL_ENTITY_VERIFICATION_REQUIRED",
  companyNumberVerified: false,
  registeredOffice: "LEGAL_ENTITY_VERIFICATION_REQUIRED",
  registeredOfficeVerified: false,
  tradingAddress: "Chesterfield, Derbyshire, United Kingdom",
  countryOfIncorporation: "United Kingdom",
  
  // Tax & VAT
  vatRegistered: false,
  vatNumber: null,
  
  // Contact Channels
  privacyEmail: "privacy@drawdown.trading",
  supportEmail: "support@drawdown.trading",
  complaintsEmail: "complaints@drawdown.trading",
  legalEmail: "legal@drawdown.trading",
  securityEmail: "security@drawdown.trading",
  
  // Versioning & Dates
  effectiveDate: "August 4, 2026",
  documentVersion: "LEG-2026-V1",
  
  // Regulatory & Contract Parameters
  minimumCustomerAge: 18,
  stripeBillingCurrency: "GBP",
  governingLaw: "England and Wales",
  jurisdiction: "Courts of England and Wales",
  
  // Authorisation Perimeter Disclosure
  fcaStatus: "Drawdown is not authorised or regulated by the Financial Conduct Authority (FCA). It provides financial education, market research, quantitative analysis tools, and subscription software.",
  
  // Refund Policy Summary
  moneyBackGuaranteeDays: 7,
} as const;

export type LegalConfig = typeof LEGAL_CONFIG;
