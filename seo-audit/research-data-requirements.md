# Drawdown Research Data Requirements & Sanitization Standards

**Document Version:** 1.0  
**Effective Date:** August 5, 2026  
**Publisher:** Black & Rowan Management Group Limited t/a Drawdown  

---

## 1. First-Party Evidence Collection Protocols

All research publications at Drawdown Trading must be grounded in verified first-party empirical data or statutory public registers.

### Data Collection Standards
1. **Spread & Execution Scrapers:** Tick data must be logged via automated VPS instances situated in London (Equinix LD4) to ensure sub-millisecond timestamp precision.
2. **Broker Withdrawal Audits:** Test deposits and withdrawals must be conducted using real retail accounts with documented receipt timestamps.
3. **Monte Carlo Simulations:** Simulation scripts must run at least 10,000 iterations to achieve statistical significance at the 95% confidence interval.

---

## 2. Privacy & Data Sanitization Rules

To protect trader security and comply with UK GDPR and privacy regulations:

### Strictly Prohibited Data Exposures
* **No Account Credentials:** API keys, account passwords, investor logins, or server credentials must NEVER be logged or published.
* **No PII:** Personal names, residential addresses, bank account numbers, or ID documents must be redacted prior to dataset publication.
* **No Broker Portal Secrets:** Account numbers and direct portal session tokens must be scrubbed from evidence screenshots and CSV files.

### Public Dataset Format
* All public downloadable datasets must contain aggregate, anonymized metrics (`.csv` or `.json` format) accompanied by a data dictionary.

---

## 3. Publication Thresholds & Approval

| Classification | Verification Threshold | Approved Reviewer |
| :--- | :--- | :--- |
| **REGULATOR_VERIFIED** | Official FCA / Statutory Register match | Regulatory Reviewer |
| **DRAWDOWN_OBSERVED** | ≥500 execution/tick logs + raw CSV file | Quantitative Risk Reviewer |
| **BROKER_SUPPLIED** | Official published fee schedule | Content Editor |
| **UNVERIFIED** | Does not meet threshold | **CANNOT BE PUBLISHED** (Keep Draft / `noindex`) |
