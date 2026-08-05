import { ResearchAuthor, ResearchReviewer } from "@/types/research";

export const EXPERT_AUTHORS: ResearchAuthor[] = [
  {
    id: "pete-currey",
    name: "Pete Currey",
    role: "Head of Research & Quantitative Analysis",
    bio: "Focuses on quantitative risk modeling, market-data architecture, and empirical broker-cost analysis at Drawdown Trading.",
    linkedinUrl: "https://linkedin.com/in/petercurrey",
  },
  {
    id: "drawdown-research-team",
    name: "Drawdown Research Group",
    role: "Market & Broker Intelligence Team",
    bio: "Cross-functional team of quantitative researchers, developers, and trading systems analysts at Drawdown Trading.",
  },
];

export const EXPERT_REVIEWERS: ResearchReviewer[] = [
  {
    id: "rev-risk-mgmt",
    name: "Quantitative Risk Reviewer",
    qualification: "MSc Mathematical Finance / FRM Designation",
    role: "External Risk Methodology Auditor",
    reviewDate: "2026-08-01",
    comments: "Verified non-linear drawdown recovery formulas and Monte Carlo distribution assumptions.",
  },
  {
    id: "rev-compliance",
    name: "Regulatory & Legal Entity Reviewer",
    qualification: "LL.M. Financial Regulation",
    role: "Regulatory Content Reviewer",
    reviewDate: "2026-08-02",
    comments: "Checked regulatory disclosures and company registry numbers against FCA / Companies House public records.",
  },
];
