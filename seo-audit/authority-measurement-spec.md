# Drawdown Authority Measurement & Analytics Framework

**Document Version:** 1.0  
**Effective Date:** August 5, 2026  
**Repository:** `drawdown.trading`  

---

## 1. Core Measurement Pillars

To track authority growth without invasive user tracking, Drawdown measures four core performance pillars:

### A. Technical & Indexation Health
* **Indexable vs Excluded URLs:** Ratio of canonical indexable URLs vs excluded drafts (`noindex`).
* **Sitemap Cleanliness:** 0 redirect chains, 0 404s, 0 draft leaks in `sitemap.xml`.
* **Core Web Vitals:** Mobile LCP < 2.2s, CLS < 0.05, INP < 150ms.

### B. Search Performance & Intent Distribution
* **Non-Brand Commercial & Informational Clicks:** Tracked via Search Console API.
* **Research Hub Clicks:** Impressions and click-through rates on `/research/*` URLs.
* **Calculator Asset Performance:** CTR on `/calculators/*` entries.

### C. Authority & E-E-A-T Link Signals
* **Editorial Backlinks & Citations:** Inbound links to research papers and datasets.
* **Dataset Downloads:** Unique downloads of CSV/JSON research files.
* **Widget Embeds:** Number of external `<iframe>` calculator embeds referencing Drawdown.

### D. User Value & Engagement
* **Calculator Completion Rate:** Percentage of users completing calculation inputs.
* **Methodology Views:** Pageviews on `/research/methodology` and `/editorial-policy`.
* **Error Report Submissions:** Number of user-submitted error reports and average resolution time (<48 hours).
