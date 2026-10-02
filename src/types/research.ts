/**
 * Drawdown Research Centre — Type Definitions
 * Evidence-led research, datasets, broker testing, and transparency systems.
 */

export type EvidenceClassification =
  | "BROKER_SUPPLIED"
  | "REGULATOR_VERIFIED"
  | "DRAWDOWN_OBSERVED"
  | "THIRD_PARTY_SOURCE"
  | "UNVERIFIED";

export type ResearchStatus = "published" | "draft" | "under_review" | "archived";

export interface ResearchAuthor {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  linkedinUrl?: string;
}

export interface ResearchReviewer {
  id: string;
  name: string;
  qualification: string;
  role: string;
  reviewDate: string;
  comments?: string;
}

export interface ContentVersion {
  version: string;
  date: string;
  author: string;
  reviewer?: string;
  summary: string;
  type: "initial" | "minor_edit" | "material_review" | "data_refresh" | "correction";
  conclusionChanged: boolean;
}

export interface CorrectionEntry {
  id: string;
  pageUrl: string;
  pageTitle: string;
  reportedDate: string;
  correctedDate: string;
  issueType: "factual_error" | "data_outdated" | "typo" | "methodology_clarification" | "other";
  description: string;
  natureOfCorrection: string;
  conclusionChanged: boolean;
  status: "submitted" | "triaged" | "under_review" | "accepted" | "rejected" | "corrected" | "published" | "closed";
}

export interface ResearchDataset {
  id: string;
  title: string;
  description: string;
  category: "broker-costs" | "execution" | "withdrawals" | "risk-math" | "prop-firms" | "trader-behavior";
  format: "CSV" | "JSON";
  fileUrl: string;
  fileSizeBytes: number;
  rowCount: number;
  dataPeriod: string;
  lastUpdated: string;
  license: string;
  citationFormat: string;
}

export interface ResearchStudy {
  slug: string;
  title: string;
  subtitle: string;
  category: "broker-costs" | "execution" | "withdrawals" | "risk-math" | "prop-firms" | "trader-behavior";
  status: ResearchStatus;
  isDraft: boolean; // if true, enforces noindex and excludes from sitemap
  publishedAt: string;
  lastReviewedAt: string;
  authors: ResearchAuthor[];
  reviewers: ResearchReviewer[];
  researchQuestion: string;
  evidenceClassification: EvidenceClassification;
  sampleSize: string;
  dataPeriod: string;
  methodologySummary: string;
  keyFindings: string[];
  limitations: string[];
  dataset?: ResearchDataset;
  citationFormat: string;
  versionHistory: ContentVersion[];
  relatedTools: Array<{ name: string; url: string }>;
  relatedGuides: Array<{ title: string; url: string }>;
}

export interface BrokerTestRecord {
  id: string;
  brokerName: string;
  legalEntity: string;
  regulator: string;
  licenseNumber: string;
  accountType: string;
  testDate: string;
  instrumentsTested: string[];
  sampleSizeOrders: number;
  avgSpreadPips: number;
  avgExecutionTimeMs: number;
  slippageDistribution: {
    positiveSlippagePct: number;
    zeroSlippagePct: number;
    negativeSlippagePct: number;
  };
  depositFeePct: number;
  withdrawalProcessingHours: number;
  evidenceClassification: EvidenceClassification;
  verificationStatus: "VERIFIED" | "PENDING_VERIFICATION" | "DRAFT";
  notes: string;
}
