# Drawdown Signal Centre — Email Template System

## Overview

Five files in this directory form the complete email template system for Drawdown's Signal Centre broadcasts. All templates are table-based HTML (Outlook-safe), with all CSS inlined where possible and inline fallbacks in `<style>` blocks for clients that support them.

---

## Design Token Reference

| Token | Hex | Usage |
|---|---|---|
| `navy-ink` | `#1B2B4B` | Primary text, wordmark, headlines, stat bar figures |
| `navy-solid` | `#1E2E52` | Solid button fill (all variants), Breaking News accent bar and rule |
| `slate-grey` | `#5B6472` | Body copy, captions, metadata, footer text |
| `hairline-grey` | `#E3E5E9` | All thin borders, dividers, stat bar separators |
| `bg-white` | `#FFFFFF` | Content well background |
| `pill-bg` | `#FAFAFA` | Status pill background, footer background |

### Variant Accent Colours

| Template | Accent | Hex | Bar height | Where it appears |
|---|---|---|---|---|
| Breaking News | Navy matte | `#1E2E52` | **6px solid** | Top bar, 2px headline left-rule, status pill dot |
| Morning Briefing | Thin orange | `#D9762C` | **2px hairline** | Top bar, 2px headline left-rule, status pill dot — nowhere else |
| Evening Briefing | Thin lime | `#8FB93B` | **2px hairline** | Top bar, 2px headline left-rule, status pill dot — nowhere else |

> **Accent rule:** Orange and lime accents appear ONLY as 2px rules/bars. They never appear as fills, never on buttons, never in the stat bar or footer. Breaking News is the sole exception — it is allowed a solid 6px accent bar because it signals urgency.

---

## Font Stacks

**Sans (prose, headlines, CTA):**
```
'IBM Plex Sans', -apple-system, 'Segoe UI', Arial, sans-serif
```

**Monospace (data only — stat bar, status pill, timestamps, unsubscribe link):**
```
'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace
```

> Monospace is used deliberately and sparingly for anything that reads as "data". It is never used for headline or body prose.

---

## Component Library

| # | Component | Notes |
|---|---|---|
| 1 | **Accent bar** | Full-width top rule. 6px solid on Breaking News; 2px hairline on Morning/Evening |
| 2 | **Masthead row** | DRAWDOWN wordmark left · vertical hairline · template label right (monospace tracked-caps) |
| 3 | **Status pill** | 1px hairline border, `#FAFAFA` fill, accent-coloured dot, monospace tracked-caps text, sharp corners |
| 4 | **Headline block** | Large navy headline with 2px accent left-rule; optional subheadline in slate grey |
| 5 | **Body copy** | Up to 3 paragraph blocks in slate grey, 1.65 line-height, sans font |
| 6 | **CTA button** | Bulletproof VML table-button. Always `#1E2E52` navy fill, white text. Zero border-radius. |
| 7 | **Stat bar** | 4 cells divided by 1px hairlines. Monospace figure (22px) + monospace caption (8px, tracked, uppercase) per cell |
| 8 | **Footer** | `#FAFAFA` background, `#E3E5E9` top border, slate grey address + monospace unsubscribe link |

---

## Placeholder Reference

All live content is injected via these `{{DOUBLE_BRACE}}` tokens at send time. Do not fabricate realistic market data, headlines, or numbers in the template HTML itself.

| Placeholder | Component | Description |
|---|---|---|
| `{{EMAIL_SUBJECT}}` | `<title>` | Email subject line |
| `{{PREHEADER_TEXT}}` | Preheader div | Short preview text (50–100 chars) |
| `{{SESSION_LABEL}}` | Status pill | e.g. LONDON SESSION, US SESSION |
| `{{DATE_PLACEHOLDER}}` | Status pill | Formatted date/time, e.g. MON 03 AUG 2026 · 07:00 BST |
| `{{HEADLINE_TEXT}}` | Headline block | Main email headline |
| `{{SUBHEADLINE_TEXT}}` | Headline block | Optional supporting line below headline |
| `{{BODY_PARAGRAPH_1}}` | Body copy | First prose paragraph |
| `{{BODY_PARAGRAPH_2}}` | Body copy | Second prose paragraph (remove `<p>` block if unused) |
| `{{BODY_PARAGRAPH_3}}` | Body copy | Third prose paragraph (remove `<p>` block if unused) |
| `{{CTA_LABEL}}` | CTA button | Button text, e.g. VIEW FULL ANALYSIS |
| `{{CTA_URL}}` | CTA button | Full destination URL |
| `{{SIGNAL_COUNT}}` | Stat bar cell 1 | Numeric value only |
| `{{INSTRUMENTS}}` | Stat bar cell 2 | Numeric or short text value |
| `{{SESSION}}` | Stat bar cell 3 | Short session identifier |
| `{{RISK_GRADE}}` | Stat bar cell 4 | Grade value (e.g. A, B+, MEDIUM) |
| `{{COMPANY_ADDRESS}}` | Footer | Registered address or trading address |
| `{{UNSUBSCRIBE_URL}}` | Footer | Full unsubscribe URL with subscriber token |
| `{{ALERT_TIMESTAMP}}` | Breaking News pill | Timestamp of alert issue |

---

## Structural Non-Negotiables

These rules are inherited from Pete's standing design conventions and must not be overridden:

- **Zero border-radius** on every element — buttons, borders, stat cells, pill. Sharp corners only.
- **1px hairline borders only** — no drop shadows, no gradients anywhere.
- **No emoji, no icons, no illustration, no photography** in the templates.
- **No colour outside the defined tokens** — no ad-hoc hex values.
- **No serif fonts** anywhere.
- Generous whitespace — large top/bottom padding, single-column layout throughout.
- Monospace for data/metadata only, never for prose or headlines.

---

## Swapping Content at Send Time (Resend)

When sending via Resend, substitute all `{{PLACEHOLDER}}` tokens with real values. If using the Resend API directly:

```js
// Example: replace tokens before passing html to resend.emails.send()
const html = templateHtml
  .replace(/\{\{HEADLINE_TEXT\}\}/g, alertData.headline)
  .replace(/\{\{BODY_PARAGRAPH_1\}\}/g, alertData.summary)
  .replace(/\{\{CTA_URL\}\}/g, `https://drawdown.trading/the-wire`)
  .replace(/\{\{CTA_LABEL\}\}/g, 'View Full Alert')
  .replace(/\{\{UNSUBSCRIBE_URL\}\}/g, `https://drawdown.trading/unsubscribe?token=${sub.token}`)
  // ...etc
```

Remove any optional `<p>` blocks (e.g. BODY_PARAGRAPH_3) from the HTML if that content slot is unused for a given send, to avoid empty paragraphs in the rendered email.

---

## Acceptance Checklist

Before any send, verify:

- [ ] Zero border-radius on all elements — visually audit every button, border, and pill
- [ ] Orange and lime accents appear ONLY as 2px rules/bars — never as fills, never on buttons
- [ ] Breaking News is the ONLY variant with a solid (6px) accent bar
- [ ] All `{{PLACEHOLDER}}` tokens have been replaced with real content
- [ ] No `{{PLACEHOLDER}}` tokens appear in the sent email
- [ ] Unsubscribe link is functional and correct per recipient
- [ ] Preheader text is distinct from the headline (avoid duplication in inbox preview)
- [ ] Monospace used only for data cells, pill, timestamps — not prose
