// Drawdown Email Automation Templates
// Premium responsive HTML/CSS structures compatible with major clients (Outlook, Gmail, Apple Mail)

export interface EconomicEvent {
  time: string;
  event: string;
  currency: string;
  expected_impact: string;
}

export interface MarketRate {
  pair: string;
  price: string;
  change: string;
  bias: string;
}

export interface BreakingNewsData {
  subject: string;
  preview?: string;
  content: string;
  articleUrl?: string;
  source?: string;
  imageUrl?: string;
  imageCaption?: string;
  unsubscribeUrl?: string;
}

export interface MorningBriefData {
  dateStr: string;
  subject: string;
  preview: string;
  sessionBullets: string[];
  economicEvents: EconomicEvent[];
  marketRates: MarketRate[];
  petesTake: string;
  oneThing: string;
  imageUrl?: string;
  imageCaption?: string;
  articleUrl?: string;
  unsubscribeUrl: string;
}

export interface EveningWrapData {
  dateStr: string;
  subject: string;
  preview: string;
  howItPlayedOut: string;
  tomorrowWatchList: string;
  tradeOfSession: string;
  curriculumTopic: string;
  curriculumModuleLink: string;
  imageUrl?: string;
  imageCaption?: string;
  articleUrl?: string;
  unsubscribeUrl: string;
}

const getBaseStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
  body { margin: 0; padding: 0; width: 100% !important; background-color: #F1F5F9; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1E293B; -webkit-text-size-adjust: none; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  td { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  p { margin: 0 0 16px 0; line-height: 1.6; font-size: 15px; color: #334155; }
  ul { margin: 0 0 16px 0; padding-left: 20px; }
  li { margin-bottom: 8px; line-height: 1.6; font-size: 15px; color: #334155; }
  h1, h2, h3 { color: #0F172A; margin: 0 0 16px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  a { color: #F9771D; text-decoration: none; }
  .wrapper { width: 100%; table-layout: fixed; background-color: #F1F5F9; padding-top: 40px; padding-bottom: 40px; }
  .main { background-color: #FFFFFF; margin: 0 auto; width: 100%; max-width: 600px; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
  .header { padding: 32px 24px; border-bottom: 1px solid #E2E8F0; text-align: center; background-color: #FFFFFF; }
  .content { padding: 32px 24px; background-color: #FFFFFF; }
  .footer { padding: 30px 24px; text-align: center; color: #64748B; font-size: 11px; border-top: 1px solid #E2E8F0; background-color: #F8FAFC; }
  .section-box { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 20px; margin-bottom: 24px; }
  .accent-bar { border-left: 3px solid #F9771D; padding-left: 16px; margin: 20px 0; background-color: #FFFBEB; border-radius: 0 4px 4px 0; padding: 14px 16px; }
  .btn-accent { display: inline-block; background-color: #F9771D; color: #FFFFFF !important; padding: 12px 28px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; border-radius: 4px; box-shadow: 0 2px 4px rgba(249, 119, 29, 0.2); }
  .disclaimer { font-size: 10px; color: #94A3B8; margin-top: 20px; line-height: 1.5; }
  .hero-image-container { margin-bottom: 24px; border-radius: 6px; overflow: hidden; border: 1px solid #E2E8F0; background-color: #F8FAFC; text-align: center; }
  .hero-image { width: 100%; height: auto; max-height: 320px; object-fit: cover; display: block; }
  .hero-caption { padding: 8px 12px; font-size: 12px; color: #64748B; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: left; }
`;

function renderHeroImage(imageUrl?: string, caption?: string, sourceUrl?: string): string {
  if (!imageUrl) return '';
  return `
    <div class="hero-image-container">
      ${sourceUrl ? `<a href="${sourceUrl}" target="_blank" style="display: block;">` : ''}
        <img src="${imageUrl}" alt="${caption || 'Market news image'}" class="hero-image" border="0" />
      ${sourceUrl ? `</a>` : ''}
      ${caption ? `
        <div class="hero-caption">
          ${caption}
          ${sourceUrl ? ` &bull; <a href="${sourceUrl}" target="_blank" style="color: #F9771D; text-decoration: underline;">Read story &rarr;</a>` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

export function getWelcomeTemplate(unsubscribeUrl: string = "#"): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Welcome to Drawdown</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header">
                  <h1 style="color: #0F172A; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #F9771D;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #64748B; font-family: ui-monospace, monospace;">You're in. Here's what happens next.</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <p style="color: #0F172A; font-size: 16px; font-weight: 600;">Thanks for joining Drawdown.</p>
                  <p>This is a trading education platform built by Pete Currey — a UK-based trader who got fed up of the industry selling expensive nonsense to people who deserve better.</p>
                  <p>You'll receive two emails from us every trading day:</p>
                  
                  <div class="section-box" style="border-left: 3px solid #16A34A; background-color: #F0FDF4;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #15803D; font-family: ui-monospace, monospace;">• 07:00 GMT — Morning Brief</p>
                    <p style="margin-bottom: 16px; font-size: 14px; color: #1E293B;">What's moving, what's on the calendar, and the key levels to watch for the session ahead.</p>
                    
                    <p style="margin-bottom: 8px; font-weight: bold; color: #F9771D; font-family: ui-monospace, monospace;">• 17:30 GMT — Evening Wrap</p>
                    <p style="margin-bottom: 0; font-size: 14px; color: #1E293B;">How the session played out, what to watch for tomorrow, and one educational insight tied directly to the day's real price action.</p>
                  </div>
                  
                  <p>No spam. No upsells hidden in market commentary. Just honest trading intelligence, twice a day.</p>
                  <p>Your free account gives you access to Phase 1 of the curriculum and two AI tools — the Risk Calculator and the Intelligence Hub. Start there.</p>
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; margin-bottom: 10px;">
                    <tr>
                      <td align="center">
                        <a href="https://drawdown.trading/courses" class="btn-accent" target="_blank">Start Phase 1 Free &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #475569; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${unsubscribeUrl}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a></p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer">
                    <strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getBreakingNewsTemplate(data: BreakingNewsData): string {
  const contentParagraphs = data.content
    .split('\n\n')
    .map(p => `<p style="font-size: 15px; line-height: 1.6; color: #1E293B; margin-bottom: 14px;">${p.replace(/\\n/g, '<br/>')}</p>`)
    .join('');

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${data.subject}</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header" style="border-bottom: 2px solid #F9771D;">
                  <span style="color: #EA580C; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; display: inline-block; background-color: #FFEDD5; padding: 4px 12px; border-radius: 4px; margin-bottom: 10px;">🚨 BREAKING NEWS</span>
                  <h1 style="color: #0F172A; font-size: 22px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #F9771D;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #64748B; font-family: ui-monospace, monospace;">The Wire &bull; Instant Market Alert</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  ${renderHeroImage(data.imageUrl, data.imageCaption || data.subject, data.articleUrl)}
                  
                  <div class="accent-bar" style="border-left-color: #F9771D; background-color: #FFF7ED;">
                    ${contentParagraphs}
                  </div>

                  ${data.source || data.articleUrl ? `
                    <div class="section-box" style="margin-top: 24px; padding: 14px 18px;">
                      <p style="margin: 0; font-size: 13px; color: #64748B;">
                        Original Source: ${data.articleUrl ? `<a href="${data.articleUrl}" target="_blank" style="color: #F9771D; font-weight: 600; text-decoration: underline;">${data.source || 'Read full article'} &rarr;</a>` : `<strong style="color: #0F172A;">${data.source}</strong>`}
                      </p>
                    </div>
                  ` : ''}

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 28px; margin-bottom: 8px;">
                    <tr>
                      <td align="center">
                        <a href="https://drawdown.trading/signal-centre" class="btn-accent" target="_blank">View Live Market Analysis &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #475569;">Drawdown Platform Ltd &bull; UK-first Market Intelligence</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${data.unsubscribeUrl || '#'}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a></p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer">
                    <strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getMorningBriefTemplate(data: MorningBriefData): string {
  const eventsHtml = data.economicEvents.map(e => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 10px 8px; font-family: ui-monospace, monospace; font-size: 13px; color: #64748B;">${e.time}</td>
      <td style="padding: 10px 8px; font-size: 13px; font-weight: 600; color: #0F172A;">${e.event}</td>
      <td style="padding: 10px 8px; font-family: ui-monospace, monospace; font-size: 13px; color: #0F172A;">${e.currency}</td>
      <td style="padding: 10px 8px; font-size: 12px; font-weight: 700; color: ${e.expected_impact.toLowerCase() === 'high' ? '#DC2626' : '#EA580C'};">${e.expected_impact}</td>
    </tr>
  `).join('');

  const ratesHtml = data.marketRates.map(r => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 10px 8px; font-size: 13px; font-weight: 600; color: #0F172A;">${r.pair}</td>
      <td style="padding: 10px 8px; font-family: ui-monospace, monospace; font-size: 13px; color: #64748B;">${r.price}</td>
      <td style="padding: 10px 8px; font-family: ui-monospace, monospace; font-size: 13px; font-weight: 600; color: ${r.change.startsWith('-') ? '#DC2626' : '#16A34A'};">${r.change}</td>
      <td style="padding: 10px 8px; font-size: 12px; font-family: ui-monospace, monospace; text-transform: uppercase; font-weight: 700; color: ${r.bias.toLowerCase() === 'bullish' ? '#16A34A' : r.bias.toLowerCase() === 'bearish' ? '#DC2626' : '#64748B'};">${r.bias}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${data.subject}</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
        .brief-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
        .brief-table th { padding: 8px; text-align: left; font-size: 11px; font-family: ui-monospace, monospace; color: #64748B; text-transform: uppercase; border-bottom: 2px solid #E2E8F0; background-color: #F8FAFC; }
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header" style="border-bottom: 2px solid #F9771D;">
                  <span style="color: #F9771D; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 4px;">// MORNING BRIEF</span>
                  <h1 style="color: #0F172A; font-size: 22px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">The Wire</h1>
                  <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #64748B; font-family: ui-monospace, monospace;">${data.dateStr} &bull; 07:00 GMT</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  ${renderHeroImage(data.imageUrl, data.imageCaption, data.articleUrl)}

                  <!-- Today's Session -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Today's Session</h2>
                  <ul>
                    ${data.sessionBullets.map(b => `<li style="color: #1E293B;">${b}</li>`).join('')}
                  </ul>
                  
                  <!-- Economic Calendar -->
                  ${data.economicEvents.length > 0 ? `
                    <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Macro Calendar</h2>
                    <table class="brief-table" cellpadding="0" cellspacing="0">
                      <thead>
                        <tr>
                          <th width="15%">Time</th>
                          <th width="50%">Event</th>
                          <th width="15%">CCY</th>
                          <th width="20%">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${eventsHtml}
                      </tbody>
                    </table>
                  ` : ''}
                  
                  <!-- Market Rates -->
                  <h2 style="font-size: 13px; color: #16A34A; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Market at a Glance</h2>
                  <table class="brief-table" cellpadding="0" cellspacing="0">
                    <thead>
                      <tr>
                        <th width="25%">Pair</th>
                        <th width="25%">Last Price</th>
                        <th width="25%">24H Change</th>
                        <th width="25%">Bias</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${ratesHtml}
                    </tbody>
                  </table>
                  
                  <!-- Pete's Take -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Pete's Take</h2>
                  <div class="accent-bar" style="border-left-color: #F9771D; background-color: #FFF7ED;">
                    <div style="font-size: 15px; line-height: 1.6; color: #1E293B; font-style: italic;">
                      ${data.petesTake.split('\n\n').map(p => `<p style="color: #1E293B; margin-bottom: 12px;">${p}</p>`).join('')}
                    </div>
                  </div>
                  
                  <!-- One Thing to Learn Today -->
                  <h2 style="font-size: 13px; color: #16A34A; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// One Thing to Learn Today</h2>
                  <div class="section-box" style="margin-bottom: 30px; border-left: 3px solid #16A34A; background-color: #F0FDF4;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1E293B;">${data.oneThing}</p>
                  </div>
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; margin-bottom: 10px;">
                    <tr>
                      <td align="center">
                        <a href="https://drawdown.trading/dashboard" class="btn-accent" target="_blank">View Full Analysis on Drawdown &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #475569;">Drawdown Platform Ltd &bull; UK-first Market Intelligence</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${data.unsubscribeUrl}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a></p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer">
                    <strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getEveningWrapTemplate(data: EveningWrapData): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${data.subject}</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header" style="border-bottom: 2px solid #F9771D;">
                  <span style="color: #F9771D; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 4px;">// EVENING WRAP</span>
                  <h1 style="color: #0F172A; font-size: 22px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">The Wire</h1>
                  <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #64748B; font-family: ui-monospace, monospace;">${data.dateStr} &bull; 17:30 GMT</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  ${renderHeroImage(data.imageUrl, data.imageCaption, data.articleUrl)}

                  <!-- How the Session Played Out -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// How the Session Played Out</h2>
                  <div style="font-size: 15px; line-height: 1.6; color: #1E293B; margin-bottom: 24px;">
                    ${data.howItPlayedOut.split('\n\n').map(p => `<p style="margin-bottom: 12px; color: #1E293B;">${p}</p>`).join('')}
                  </div>
                  
                  <!-- Tomorrow's Watch List -->
                  <h2 style="font-size: 13px; color: #16A34A; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Tomorrow's Watch List</h2>
                  <div style="font-size: 15px; line-height: 1.6; color: #1E293B; margin-bottom: 24px;">
                    ${data.tomorrowWatchList.split('\n\n').map(p => `<p style="margin-bottom: 12px; color: #1E293B;">${p}</p>`).join('')}
                  </div>
                  
                  <!-- Trade of the Session -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Trade of the Session</h2>
                  <div class="section-box" style="margin-bottom: 24px; border-left: 3px solid #F9771D; background-color: #FFF7ED;">
                    <div style="font-size: 14px; line-height: 1.6; color: #1E293B;">
                      ${data.tradeOfSession.split('\n\n').map(p => `<p style="margin-bottom: 12px; color: #1E293B;">${p}</p>`).join('')}
                    </div>
                  </div>
                  
                  <!-- Curriculum Link -->
                  <h2 style="font-size: 13px; color: #16A34A; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Curriculum Connection</h2>
                  <div class="accent-bar" style="border-left-color: #16A34A; background-color: #F0FDF4; margin-bottom: 30px;">
                    <p style="color: #0F172A; font-style: italic; margin-bottom: 8px; font-weight: 500;">${data.curriculumTopic}</p>
                    <p style="margin-bottom: 0; font-size: 13px; color: #64748B;">Learn more about this mechanism inside the Drawdown modules.</p>
                  </div>
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; margin-bottom: 10px;">
                    <tr>
                      <td align="center">
                        <a href="${data.curriculumModuleLink}" class="btn-accent" target="_blank">Continue Your Curriculum &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #475569;">Drawdown Platform Ltd &bull; UK-first Market Intelligence</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${data.unsubscribeUrl}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a></p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer">
                    <strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getSurvivalKitConfirmationTemplate(dashboardUrl: string, tempPassword?: undefined, magicLink?: string): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Your Prop Challenge Survival Kit</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header" style="border-bottom: 2px solid #16A34A;">
                  <h1 style="color: #0F172A; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #16A34A;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #64748B; font-family: ui-monospace, monospace;">Prop Challenge Survival Kit</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <p style="color: #0F172A; font-size: 16px; font-weight: 600;">Your Survival Kit is ready.</p>
                  <p>Thank you for your purchase. You are now equipped with the complete blueprint to navigate, protect, and pass your prop firm evaluation.</p>
                  
                  <div class="section-box" style="border-color: #16A34A; background-color: #F0FDF4;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #15803D; font-family: ui-monospace, monospace;">// WHAT IS INCLUDED:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #1E293B;">
                      <li style="color: #1E293B;"><strong>The Rule Decoder:</strong> Every drawdown calculation type explained with clear examples.</li>
                      <li style="color: #1E293B;"><strong>The Position Sizing Sheets:</strong> The templates to manage your daily loss limits.</li>
                      <li style="color: #1E293B;"><strong>The Tilt Protocol:</strong> Psychological blueprints to manage drawdown spirals.</li>
                    </ul>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <a href="${dashboardUrl}" class="btn-accent" style="background-color: #16A34A; color: #FFFFFF !important;" target="_blank">Access Your Survival Kit &rarr;</a>
                      </td>
                    </tr>
                  </table>
                  
                  ${magicLink ? `
                  <div class="section-box">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #F9771D; font-family: ui-monospace, monospace;">// YOUR ACCOUNT ACCESS:</p>
                    <p style="font-size: 14px; margin-bottom: 12px; color: #1E293B;">We created a Drawdown account for you. Click the button below to sign in and access your download — no password needed.</p>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 12px;">
                      <tr><td align="center">
                        <a href="${magicLink}" class="btn-accent" style="background-color: #0F172A;" target="_blank">Sign In to Your Account &rarr;</a>
                      </td></tr>
                    </table>
                    <p style="font-size: 12px; color: #64748B; margin-top: 12px;">This link expires in 1 hour. After that, use the magic link sign-in on drawdown.trading/login.</p>
                  </div>
                  ` : `
                  <p>Log in to your Drawdown account to access your purchase at any time from your dashboard.</p>
                  `}
                  
                  <p style="font-size: 14px; margin-top: 24px;">If you have any questions or need support, reply directly to this email.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #475569; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer">
                    <strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getHowToTradeConfirmationTemplate(dashboardUrl: string, tempPassword?: undefined, magicLink?: string): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Your How to Trade Guide</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header" style="border-bottom: 2px solid #F9771D;">
                  <h1 style="color: #0F172A; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #F9771D;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #64748B; font-family: ui-monospace, monospace;">How to Trade — 100-Page Framework</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <p style="color: #0F172A; font-size: 16px; font-weight: 600;">Your guide is ready to read.</p>
                  <p>Thank you for your purchase. You now have the complete institutional trading framework — from market structure through to live execution.</p>
                  
                  <div class="section-box" style="border-color: #F9771D; background-color: #FFF7ED;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #EA580C; font-family: ui-monospace, monospace;">// WHAT IS COVERED:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #1E293B;">
                      <li style="color: #1E293B;"><strong>Market Structure:</strong> How price moves and why — institutional vs retail perspective.</li>
                      <li style="color: #1E293B;"><strong>Session Theory:</strong> London, New York & Asian overlap — where the real money is made.</li>
                      <li style="color: #1E293B;"><strong>Trade Execution:</strong> Entries, stop placement, and the anatomy of a complete trade.</li>
                      <li style="color: #1E293B;"><strong>Risk Management:</strong> Position sizing, R:R, and protecting your capital as a business.</li>
                    </ul>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <a href="${dashboardUrl}" class="btn-accent" style="background-color: #F9771D; color: #FFFFFF !important;" target="_blank">Access Your Guide &rarr;</a>
                      </td>
                    </tr>
                  </table>
                  
                  ${magicLink ? `
                  <div class="section-box">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #F9771D; font-family: ui-monospace, monospace;">// YOUR ACCOUNT ACCESS:</p>
                    <p style="font-size: 14px; margin-bottom: 12px; color: #1E293B;">We created a Drawdown account for you. Click the button below to sign in and access your download — no password needed.</p>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 12px;">
                      <tr><td align="center">
                        <a href="${magicLink}" class="btn-accent" style="background-color: #0F172A;" target="_blank">Sign In to Your Account &rarr;</a>
                      </td></tr>
                    </table>
                    <p style="font-size: 12px; color: #64748B; margin-top: 12px;">This link expires in 1 hour. After that, use the magic link sign-in on drawdown.trading/login.</p>
                  </div>
                  ` : `
                  <p>Log in to your Drawdown account to access your purchase at any time from your dashboard.</p>
                  `}
                  
                  <p style="font-size: 14px; margin-top: 24px;">If you have any questions, reply directly to this email and Pete will get back to you.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #475569; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer">
                    <strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getTheEdgeConfirmationTemplate(dashboardUrl: string, tempPassword?: undefined, magicLink?: string): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Your The Edge Manual</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header" style="border-bottom: 2px solid #6366F1;">
                  <h1 style="color: #0F172A; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #6366F1;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #64748B; font-family: ui-monospace, monospace;">The Edge Manual — Advanced Strategy Playbook</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td class="content">
                  <p style="color: #0F172A; font-size: 16px; font-weight: 600;">Your Edge Manual is ready.</p>
                  <p>Thank you for your purchase. You now have Pete's complete advanced strategy playbook — the same framework used across live funded accounts.</p>
                  <div class="section-box" style="border-color: #6366F1; background-color: #EEF2FF;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #4338CA; font-family: ui-monospace, monospace;">// WHAT IS COVERED:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #1E293B;">
                      <li style="color: #1E293B;"><strong>Liquidity Theory:</strong> Where institutional money hunts stops — and how to trade with it.</li>
                      <li style="color: #1E293B;"><strong>Confluence Trading:</strong> Stacking multiple confirmations for high-probability entries.</li>
                      <li style="color: #1E293B;"><strong>Proprietary Setups:</strong> Pete's personal playbook of repeatable trade patterns.</li>
                      <li style="color: #1E293B;"><strong>Psychological Edge:</strong> Managing the mental game — discipline, consistency and detachment.</li>
                    </ul>
                  </div>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; margin-bottom: 30px;">
                    <tr><td align="center">
                      <a href="${dashboardUrl}" class="btn-accent" style="background-color: #6366F1;" target="_blank">Access Your Edge Manual &rarr;</a>
                    </td></tr>
                  </table>
                  ${magicLink ? `
                  <div class="section-box">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #6366F1; font-family: ui-monospace, monospace;">// YOUR ACCOUNT ACCESS:</p>
                    <p style="font-size: 14px; margin-bottom: 12px; color: #1E293B;">We created a Drawdown account for you. Click below to sign in — no password needed.</p>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 12px;">
                      <tr><td align="center">
                        <a href="${magicLink}" class="btn-accent" style="background-color: #0F172A;" target="_blank">Sign In to Your Account &rarr;</a>
                      </td></tr>
                    </table>
                    <p style="font-size: 12px; color: #64748B; margin-top: 12px;">This link expires in 1 hour. After that, use magic link sign-in at drawdown.trading/login.</p>
                  </div>
                  ` : `<p>Log in to your Drawdown account to access your purchase at any time.</p>`}
                  <p style="font-size: 14px; margin-top: 24px;">Questions? Reply directly to this email and Pete will get back to you.</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #475569; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer"><strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getManualBundleConfirmationTemplate(dashboardUrl: string, tempPassword?: undefined, magicLink?: string): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Your Drawdown Manual Bundle</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header" style="border-bottom: 2px solid #818CF8;">
                  <h1 style="color: #0F172A; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #818CF8;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #64748B; font-family: ui-monospace, monospace;">Complete Manual Collection</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <p style="color: #0F172A; font-size: 16px; font-weight: 600;">Your Complete Manual Collection is ready.</p>
                  <p>Thank you for your purchase. You now have permanent lifetime access to all three of Drawdown's flagship playbooks.</p>
                  
                  <div class="section-box" style="border-color: #818CF8; background-color: #EEF2FF;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #4F46E5; font-family: ui-monospace, monospace;">// MANUALS INCLUDED:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #1E293B;">
                      <li style="color: #1E293B;"><strong>Prop Firm Survival Kit:</strong> The complete evaluation blueprint and decoding protocol.</li>
                      <li style="color: #1E293B;"><strong>How to Trade Manual:</strong> Pete's institutional 100-page framework.</li>
                      <li style="color: #1E293B;"><strong>The Edge Manual:</strong> Advanced setups, confluence models, and execution triggers.</li>
                    </ul>
                  </div>

                  <p>All manuals have been added to your Drawdown dashboard. Click below to access the store downloads area immediately.</p>
                  
                  ${magicLink ? `
                    <div style="background-color: #F8FAFC; border: 1px dashed #CBD5E1; padding: 20px; border-radius: 6px; margin: 24px 0; text-align: center;">
                      <p style="margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #0F172A;">Temporary Access Link:</p>
                      <a href="${magicLink}" class="btn-accent" style="background-color: #818CF8; box-shadow: 0 2px 4px rgba(129, 140, 248, 0.2);">Sign In Instantly</a>
                      <p style="margin: 12px 0 0 0; font-size: 11px; color: #64748B;">This link will log you in automatically and direct you to your store downloads.</p>
                    </div>
                  ` : `
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${dashboardUrl}" class="btn-accent" style="background-color: #818CF8; box-shadow: 0 2px 4px rgba(129, 140, 248, 0.2);">Access Store Downloads</a>
                    </div>
                  `}

                  <p style="margin-top: 30px; font-size: 13px; color: #64748B;">If you have any questions or require support, reply directly to this email.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #475569; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer"><strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getAcceleratorApplicationConfirmationTemplate(firstName: string = "Trader"): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Drawdown Institutional Accelerator Application Received</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header" style="border-bottom: 2px solid #F9771D; background-color: #0F172A; padding: 40px 24px;">
                  <h1 style="color: #FFFFFF; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #F9771D;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #94A3B8; font-family: ui-monospace, monospace;">Institutional Accelerator Cohort</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content" style="padding: 36px 30px;">
                  <p style="color: #0F172A; font-size: 18px; font-weight: 600; margin-bottom: 8px;">Application Received — Welcome to the Gateway, ${firstName}.</p>
                  <p>Thanks for applying to the <strong>Drawdown Institutional Accelerator (DIA)</strong>. We have successfully received your candidate dossier and our admissions desk is actively reviewing your submission.</p>
                  
                  <p>The Accelerator is our highest-tier, high-ticket program (£1,500+ value) designed strictly for serious market practitioners who want to pass prop evaluations, build institutional risk profiles, and manage large-scale capital pools with absolute consistency.</p>
                  
                  <div class="accent-bar" style="border-left-color: #F9771D; background-color: #FFF7ED; padding: 18px 20px; border-radius: 4px; margin: 24px 0;">
                    <p style="margin: 0; font-weight: 600; color: #EA580C; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-family: ui-monospace, monospace; margin-bottom: 6px;">📋 WHAT TO EXPECT NEXT</p>
                    <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #475569;">
                      Our team manually reviews every candidate profile. Due to the high volume of applications and the strict limit of 15 spots per cohort, we prioritize traders with clear capital objectives and strong psychological alignment. You will receive an email confirmation of your candidate status within 24 to 48 hours.
                    </p>
                  </div>

                  <h3 style="font-size: 13px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1.5px;">// CORE CURRICULUM BREADTH</h3>
                  <p style="font-size: 14px; margin-bottom: 12px;">The Accelerator curriculum represents a significant structural leap in higher financial learning, bypassing retail indicators for raw order-book structures:</p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; vertical-align: top;" width="35%">
                        <strong style="color: #0F172A; font-size: 13px; font-family: ui-monospace, monospace; text-transform: uppercase;">Phase 1: Liquidity</strong>
                      </td>
                      <td style="padding: 10px 0 10px 15px; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #475569; line-height: 1.5;">
                        Order execution theory, Stop Hunt mechanics, Interbank liquidity pools, and algorithmic premium/discount pricing matrices.
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; vertical-align: top;">
                        <strong style="color: #0F172A; font-size: 13px; font-family: ui-monospace, monospace; text-transform: uppercase;">Phase 2: Mechanics</strong>
                      </td>
                      <td style="padding: 10px 0 10px 15px; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #475569; line-height: 1.5;">
                        Anatomy of High-Probability setups, daily session overlapping flows (London/NY), and executing with institutional order blocks.
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; vertical-align: top;">
                        <strong style="color: #0F172A; font-size: 13px; font-family: ui-monospace, monospace; text-transform: uppercase;">Phase 3: Funding</strong>
                      </td>
                      <td style="padding: 10px 0 10px 15px; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #475569; line-height: 1.5;">
                        Prop firm parameter mastery, passing evaluation protocols, handling trailing drawdown, and scaling from £10k to £200k+ allocations.
                      </td>
                    </tr>
                  </table>

                  <h3 style="font-size: 13px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 16px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1.5px;">// PRE-COHORT ACCELERATOR MEMBERSHIP INCLUDES</h3>
                  <ul style="padding-left: 20px; font-size: 14px; margin-bottom: 24px;">
                    <li style="font-size: 14px; margin-bottom: 8px;"><strong>Daily Market Briefings:</strong> Deep dive structural overviews of interbank levels.</li>
                    <li style="font-size: 14px; margin-bottom: 8px;"><strong>The Intelligence Hub:</strong> Unlimited processing of real-time market narratives.</li>
                    <li style="font-size: 14px; margin-bottom: 8px;"><strong>Risk Sizing Suite:</strong> Mathematical model trackers protecting against drawdown spirals.</li>
                  </ul>

                  <p style="font-size: 14px; margin-bottom: 24px;">While our admissions desk conducts your candidate evaluation, you are fully authorized to log into your client portal and begin digesting our foundational pre-study publications.</p>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px; margin-bottom: 12px;">
                    <tr>
                      <td align="center">
                        <a href="https://drawdown.trading/dashboard" class="btn-accent" style="background-color: #0F172A; color: #FFFFFF !important; font-family: 'Outfit', sans-serif;" target="_blank">Access Client Dashboard &rarr;</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="font-size: 14px; margin-top: 24px;">If you have any questions or need to modify your candidate answers, simply reply directly to this email.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer" style="padding: 30px 24px; background-color: #F8FAFC;">
                  <p style="margin-bottom: 8px; color: #475569; font-weight: 500;">Pete Currey &bull; Founder, Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer">
                    <strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export interface BlogPostEmailData {
  title: string;
  category: string;
  eyebrow?: string;
  subtitle?: string;
  body: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  slug: string;
  unsubscribeUrl?: string;
}

export function convertMarkdownToHtml(md: string, postUrl: string = "https://drawdown.trading"): string {
  if (!md) return "";

  // Preprocess: If Tiptap has wrapped raw markdown elements or custom components in simple <p> tags, unwrap them!
  let cleaned = md;
  cleaned = cleaned.replace(/<p>\s*(##+\s+.*?)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(-\s+.*?)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(\*\s+.*?)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(>\s+.*?)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(```[\s\S]*?```)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(<DataTable[\s\S]*?(?:\/>|<\/DataTable>))\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(<PullQuote[\s\S]*?<\/PullQuote>)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(<Callout[\s\S]*?<\/Callout>)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(<KeyTakeaways[\s\S]*?\/?>)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(<BlogTable[\s\S]*?\/?>)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(<BlogChart[\s\S]*?\/?>)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(<TradingViewPromoSection\s*\/?>)\s*<\/p>/g, '$1');
  cleaned = cleaned.replace(/<p>\s*(<AffiliateMarketingSection\s*\/?>)\s*<\/p>/g, '$1');

  // Check if content is already formatted as HTML (i.e. starts with standard HTML structures) after unwrapping
  const isHtml = /<p[^>]*>|<div[^>]*>|<h[1-6][^>]*>|<ul[^>]*>/i.test(cleaned);
  
  let html = cleaned;

  if (isHtml) {
    // ── Tiptap HTML path: fix markdown-as-text and clean up JSX tags ──
    // Tiptap does NOT auto-convert typed markdown syntax to HTML elements.
    // e.g. typing '## Heading' in Tiptap stores <p>## Heading</p> — fix that here.

    // Convert <p>## heading</p> -> proper heading elements
    html = html.replace(/<p[^>]*>\s*####\s+(.*?)\s*<\/p>/gi, '<h4>$1</h4>');
    html = html.replace(/<p[^>]*>\s*###\s+(.*?)\s*<\/p>/gi, '<h3>$1</h3>');
    html = html.replace(/<p[^>]*>\s*##\s+(.*?)\s*<\/p>/gi, '<h2>$1</h2>');
    html = html.replace(/<p[^>]*>\s*#\s+(.*?)\s*<\/p>/gi, '<h1>$1</h1>');

    // Convert <p>---</p> -> <hr/>
    html = html.replace(/<p[^>]*>\s*(?:---|___|\*\*\*)\s*<\/p>/gi, '<hr />');

    // Process inline markdown bold/italic inside text nodes
    html = html.replace(/\*\*([^*<\n]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_<\n]+)__/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*<\n]+)\*/g, '<em>$1</em>');

    // Convert markdown links inside text nodes
    html = html.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>');

    // Strip any HTML-entity-encoded JSX remnants visible as tag text
    html = html.replace(/&lt;[A-Z][A-Za-z]+[^&]*\/&gt;/g, '');
    html = html.replace(/&lt;\/[A-Z][A-Za-z]+&gt;/g, '');
  }

  if (!isHtml) {
    // 1. Normalize line endings
    html = html.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // 2. Parse code blocks: ```lang ... ``` -> <pre><code>...</code></pre>
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; margin: 16px 0; font-family: ui-monospace, monospace; font-size: 13px; line-height: 1.5; color: #0F172A; overflow-x: auto; border-radius: 0;"><code>${code.trim()}</code></pre>`;
    });

    // 3. Parse inline code: `code` -> <code>code</code>
    html = html.replace(/`([^`\n]+)`/g, '<code style="font-family: ui-monospace, monospace; background-color: #F8FAFC; padding: 2px 4px; border: 1px solid #E2E8F0; font-size: 13px; color: #0F172A; border-radius: 0;">$1</code>');

    // 4. Parse headers
    html = html.replace(/^(?:##\s+)(.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^(?:###\s+)(.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^(?:####\s+)(.*?)$/gm, '<h4>$1</h4>');
    html = html.replace(/^(?:#\s+)(.*?)$/gm, '<h1>$1</h1>');

    // 5. Parse horizontal rules
    html = html.replace(/^(?:---|___|\*\*\*)$/gm, '<hr />');

    // 6. Parse list items (unordered lists)
    html = html.replace(/^(?:\*\s+)(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/^(?:-\s+)(.*?)$/gm, '<li>$1</li>');

    // Wrap contiguous <li> tags in <ul> blocks
    html = html.replace(/((?:<li>[\s\S]*?<\/li>\n*)+)/g, '<ul>\n$1\n</ul>');

    // 7. Parse list items (ordered lists)
    html = html.replace(/^(?:\d+\.\s+)(.*?)$/gm, '<oli>$1</oli>');
    html = html.replace(/((?:<oli>[\s\S]*?<\/oli>\n*)+)/g, '<ol>\n$1\n</ol>');
    html = html.replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>');

    // 8. Parse blockquotes (lines starting with >)
    html = html.replace(/^(?:>\s+)(.*?)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/((?:<blockquote>[\s\S]*?<\/blockquote>\n*)+)/g, '<blockquote>\n$1\n</blockquote>');
    html = html.replace(/<\/blockquote>\n*<blockquote>/g, '<br />');

    // 9. Parse images: ![alt](url) -> <img src="url" alt="alt" />
    html = html.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1" />');

    // 10. Parse links: [text](url) -> <a href="url">text</a>
    html = html.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>');

    // 11. Parse bold and italics
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // 12. Parse block breaks into paragraphs
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      
      const startsWithBlockTag = /^(?:<h[1-6]|<ul|<ol|<blockquote|<pre|<hr|<img|<table|<div|<section|<p|<DataTable|<PullQuote|<Callout|<KeyTakeaways|<BlogTable|<BlogChart|<TradingViewPromoSection|<AffiliateMarketingSection)/i.test(trimmed);
      
      if (startsWithBlockTag) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    }).filter(Boolean).join("\n");
  }

  // --- PARSE CUSTOM REACT/MDX COMPONENTS ---
  // We parse these regardless of whether the source is Markdown or HTML to support embedded MDX components.

  // 1. <DataTable ... /> (resilient match)
  html = html.replace(/<DataTable([\s\S]*?)(?:\/>|<\/DataTable>)/g, (match, attrs) => {
    try {
      const headersMatch = attrs.match(/headers=\{\s*\[([\s\S]*?)\]\s*\}/);
      const rowsMatch = attrs.match(/rows=\{\s*\[([\s\S]*?)\]\s*\}/);
      const captionMatch = attrs.match(/caption=(?:"([^"]*)"|'([^']*)'|\{`([\s\S]*?)`\})/);

      const caption = captionMatch ? (captionMatch[1] || captionMatch[2] || captionMatch[3] || "") : "";

      let headers: string[] = [];
      if (headersMatch) {
        const headersStr = headersMatch[1].trim();
        const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
        let m;
        while ((m = regex.exec(headersStr)) !== null) {
          headers.push(m[1] || m[2] || "");
        }
        if (headers.length === 0 && headersStr) {
          headers = headersStr.split(",").map((h: string) => h.trim().replace(/^["']|["']$/g, "").trim()).filter(Boolean);
        }
      }

      let rows: string[][] = [];
      if (rowsMatch) {
        const rowsStr = rowsMatch[1].trim();
        const subArrayMatches = rowsStr.match(/\[([\s\S]*?)\]/g);
        if (subArrayMatches) {
          rows = subArrayMatches.map((subArr: string) => {
            const content = subArr.slice(1, -1);
            const items: string[] = [];
            const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
            let m;
            while ((m = regex.exec(content)) !== null) {
              items.push(m[1] || m[2] || "");
            }
            if (items.length === 0 && content) {
              return content.split(",").map((i: string) => i.trim().replace(/^["']|["']$/g, "").trim()).filter(Boolean);
            }
            return items;
          });
        }
      }

      let tableHtml = `
        <div style="margin: 24px 0; overflow-x: auto; border: 1px solid #E2E8F0;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: ui-monospace, monospace; font-size: 11px; text-align: left;">
      `;

      if (headers.length > 0) {
        tableHtml += `
          <thead>
            <tr style="background-color: #F8FAFC; border-bottom: 2px solid #E2E8F0;">
        `;
        headers.forEach(h => {
          tableHtml += `<th style="padding: 12px 14px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; border-bottom: 2px solid #E2E8F0;">${h}</th>`;
        });
        tableHtml += `
            </tr>
          </thead>
        `;
      }

      if (rows.length > 0) {
        tableHtml += `<tbody>`;
        rows.forEach((row, ri) => {
          const bg = ri % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
          tableHtml += `<tr style="background-color: ${bg}; border-bottom: 1px solid #E2E8F0;">`;
          row.forEach(cell => {
            tableHtml += `<td style="padding: 12px 14px; color: #334155; line-height: 1.5;">${cell}</td>`;
          });
          tableHtml += `</tr>`;
        });
        tableHtml += `</tbody>`;
      }

      tableHtml += `
          </table>
        </div>
      `;

      if (caption) {
        tableHtml += `<p style="margin-top: -12px; margin-bottom: 24px; font-family: ui-monospace, monospace; font-size: 9px; color: #64748B; font-style: italic; text-align: center;">${caption}</p>`;
      }

      return tableHtml;
    } catch (e) {
      console.error("DataTable parse failed:", e);
      return match;
    }
  });

  // 2. <PullQuote author="...">...</PullQuote> or <PullQuote>...</PullQuote>
  html = html.replace(/<PullQuote([\s\S]*?)>([\s\S]*?)<\/PullQuote>/g, (match, attrs, content) => {
    const authorMatch = attrs.match(/author=(?:"([^"]*)"|'([^']*)')/);
    const author = authorMatch ? (authorMatch[1] || authorMatch[2]) : "";

    let quoteHtml = `
      <blockquote style="margin: 28px 0; border-left: 3px solid #F9771D; padding: 16px 20px; font-family: ui-monospace, monospace; font-size: 14px; font-style: italic; line-height: 1.6; color: #0F172A; background-color: #F8FAFC; border-radius: 0 !important;">
        <p style="margin: 0; padding: 0;">"${content.trim().replace(/^["']|["']$/g, "")}"</p>
    `;
    if (author) {
      quoteHtml += `<cite style="display: block; font-size: 9px; text-transform: uppercase; color: #64748B; margin-top: 10px; font-weight: bold; font-style: normal; letter-spacing: 1px;">&mdash; ${author}</cite>`;
    }
    quoteHtml += `</blockquote>`;
    return quoteHtml;
  });

  // 3. <Callout type="...">...</Callout> or <Callout>...</Callout>
  html = html.replace(/<Callout([\s\S]*?)>([\s\S]*?)<\/Callout>/g, (match, attrs, content) => {
    const typeMatch = attrs.match(/type=(?:"([^"]*)"|'([^']*)')/);
    const type = typeMatch ? (typeMatch[1] || typeMatch[2]) : "info";

    let borderColor = "#00C2FF";
    let bgColor = "#F0FDF4";
    let title = "INFORMATION NOTICE";
    let icon = "ℹ️";

    if (type === "warning") {
      borderColor = "#FFB020";
      bgColor = "#FFFBF0";
      title = "WARNING NOTICE";
      icon = "⚠️";
    } else if (type === "success") {
      borderColor = "#00E676";
      bgColor = "#F0FDF4";
      title = "SUCCESS NOTICE";
      icon = "✅";
    } else if (type === "quote") {
      borderColor = "#94A3B8";
      bgColor = "#F8FAFC";
      title = "EDITORIAL QUOTE";
      icon = "📣";
    } else if (type === "financial-advice" || type === "danger") {
      borderColor = "#FF3D57";
      bgColor = "#FFF5F6";
      title = "EDUCATIONAL NOTICE — NOT FINANCIAL ADVICE";
      icon = "🛡️";
    } else {
      borderColor = "#00C2FF";
      bgColor = "#F0FBFF";
      title = "MARKET INTEL ANALYSIS";
      icon = "ℹ️";
    }

    return `
      <div style="margin: 24px 0; border: 1px solid #E2E8F0; border-left: 4px solid ${borderColor}; padding: 18px; background-color: ${bgColor}; font-family: 'Outfit', sans-serif; border-radius: 0 !important;">
        <div style="font-family: ui-monospace, monospace; font-size: 9px; font-weight: 700; color: ${borderColor}; letter-spacing: 1px; margin-bottom: 8px; text-transform: uppercase;">
          ${icon} // ${title}
        </div>
        <div style="font-size: 14px; line-height: 1.6; color: #334155; font-family: 'Outfit', sans-serif;">
          ${content.trim()}
        </div>
      </div>
    `;
  });

  // 4. <KeyTakeaways items="..." /> (self-closing)
  html = html.replace(/<KeyTakeaways\s+items="([^"]*)"\s*\/?>/g, (match, itemsAttr) => {
    const items = itemsAttr.split("|").map((i: string) => i.trim()).filter(Boolean);
    let takeawaysHtml = `
      <div style="margin: 28px 0; border: 1px solid #E2E8F0; border-top: 4px solid #F9771D; padding: 22px; background-color: #F8FAFC; font-family: 'Outfit', sans-serif; border-radius: 0 !important;">
        <div style="font-family: ui-monospace, monospace; font-size: 10px; font-weight: 700; color: #0F172A; letter-spacing: 1.5px; margin-bottom: 16px; text-transform: uppercase;">
          🛡️ // Key Takeaways
        </div>
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
    `;
    items.forEach((item: string) => {
      takeawaysHtml += `
        <tr>
          <td valign="top" style="width: 16px; font-size: 12px; color: #F9771D; padding-bottom: 10px; line-height: 1.5;">▪️</td>
          <td style="font-family: 'Outfit', sans-serif; font-size: 14px; color: #475569; padding-bottom: 10px; line-height: 1.5;">${item}</td>
        </tr>
      `;
    });
    takeawaysHtml += `
        </table>
      </div>
    `;
    return takeawaysHtml;
  });

  // 5. <BlogTable headers="..." rows="..." />
  html = html.replace(/<BlogTable([\s\S]*?)(?:\/>|<\/BlogTable>)/g, (match, attrs) => {
    try {
      const headersMatch = attrs.match(/headers="([^"]*)"/);
      const rowsMatch = attrs.match(/rows="([^"]*)"/);

      const headers = headersMatch ? headersMatch[1].split("|").map((h: string) => h.trim()).filter(Boolean) : [];
      const rows = rowsMatch ? rowsMatch[1].split(";").map((rowStr: string) => rowStr.split("|").map((cell: string) => cell.trim())) : [];

      let tableHtml = `
        <div style="margin: 24px 0; overflow-x: auto; border: 1px solid #E2E8F0;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: ui-monospace, monospace; font-size: 10px; text-align: left;">
      `;

      if (headers.length > 0) {
        tableHtml += `
          <thead>
            <tr style="background-color: #F8FAFC; border-bottom: 2px solid #E2E8F0;">
        `;
        headers.forEach((h: string) => {
          tableHtml += `<th style="padding: 10px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 9px; letter-spacing: 1px;">${h}</th>`;
        });
        tableHtml += `
            </tr>
          </thead>
        `;
      }

      if (rows.length > 0) {
        tableHtml += `<tbody>`;
        rows.forEach((row: string[], ri: number) => {
          if (row.length === 1 && row[0] === "") return;
          const bg = ri % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
          tableHtml += `<tr style="background-color: ${bg}; border-bottom: 1px solid #E2E8F0;">`;
          row.forEach((cell: string) => {
            const isBold = cell.startsWith("**") && cell.endsWith("**");
            const text = isBold ? cell.slice(2, -2) : cell;
            const weight = isBold ? "bold" : "normal";
            const color = isBold ? "#0F172A" : "#334155";
            tableHtml += `<td style="padding: 10px 12px; color: ${color}; font-weight: ${weight}; line-height: 1.4;">${text}</td>`;
          });
          tableHtml += `</tr>`;
        });
        tableHtml += `</tbody>`;
      }

      tableHtml += `
          </table>
        </div>
      `;
      return tableHtml;
    } catch (e) {
      console.error("BlogTable parse failed:", e);
      return match;
    }
  });

  // 6. <BlogChart type="..." title="..." />
  html = html.replace(/<BlogChart([\s\S]*?)(?:\/>|<\/BlogChart>)/g, (match, attrs) => {
    const typeMatch = attrs.match(/type="([^"]*)"/);
    const titleMatch = attrs.match(/title="([^"]*)"/);

    const type = typeMatch ? typeMatch[1] : "";
    const title = titleMatch ? titleMatch[1] : type;

    return `
      <div style="margin: 24px 0; border: 1px solid #E2E8F0; padding: 24px; background-color: #F8FAFC; text-align: center; border-radius: 0 !important;">
        <div style="font-family: ui-monospace, monospace; font-size: 9px; color: #F9771D; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px;">📊 // INTERACTIVE MARKET MODEL</div>
        <h4 style="margin: 0 0 8px 0; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #0F172A; text-transform: uppercase;">[Chart Model: ${title}]</h4>
        <p style="margin: 0 0 16px 0; font-family: 'Outfit', sans-serif; font-size: 12px; color: #64748B; line-height: 1.5; max-width: 440px; margin-left: auto; margin-right: auto;">
          This analysis includes an interactive technical chart model. For full interaction, custom parameters, and structural drawing toolbars, read this article directly on our web terminal.
        </p>
        <a href="${postUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #0F172A; color: #FFFFFF !important; font-family: ui-monospace, monospace; font-size: 10px; font-weight: bold; text-decoration: none; text-transform: uppercase; border-radius: 0 !important; letter-spacing: 1px;">
          Open Interactive Chart &rarr;
        </a>
      </div>
    `;
  });

  // 7. <TradingViewPromoSection />
  html = html.replace(/<TradingViewPromoSection\s*\/?>/g, () => {
    return `
      <div style="margin: 28px 0; border: 1px solid #00C2FF; border-top: 4px solid #00C2FF; padding: 22px; background-color: #F0FBFF; font-family: 'Outfit', sans-serif; border-radius: 0 !important;">
        <div style="font-family: ui-monospace, monospace; font-size: 9px; font-weight: 700; color: #00C2FF; letter-spacing: 1px; margin-bottom: 10px; text-transform: uppercase;">📈 // RECOMMENDED TRADING TERMINAL</div>
        <h4 style="margin: 0 0 6px 0; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #0F172A; text-transform: uppercase;">Unlock Advanced Charts on TradingView</h4>
        <p style="margin: 0 0 16px 0; font-family: 'Outfit', sans-serif; font-size: 12px; color: #475569; line-height: 1.5;">
          Standardize your risk and trade execution models. Join TradingView via Drawdown to get verified premium platform layouts and our private indicators.
        </p>
        <a href="https://www.tradingview.com/?aff=drawdown" target="_blank" style="display: inline-block; padding: 10px 18px; background-color: #00C2FF; color: #FFFFFF !important; font-family: ui-monospace, monospace; font-size: 10px; font-weight: bold; text-decoration: none; text-transform: uppercase; border-radius: 0 !important; letter-spacing: 1px;">
          Get TradingView &rarr;
        </a>
      </div>
    `;
  });

  // 8. <AffiliateMarketingSection />
  html = html.replace(/<AffiliateMarketingSection\s*\/?>/g, () => {
    return `
      <div style="margin: 28px 0; border: 1px solid #0F172A; border-top: 4px solid #F9771D; padding: 24px; background-color: #FFFFFF; font-family: 'Outfit', sans-serif; border-radius: 0 !important;">
        <div style="font-family: ui-monospace, monospace; font-size: 9px; font-weight: 700; color: #64748B; letter-spacing: 1.5px; margin-bottom: 12px; text-transform: uppercase;">🛡️ // INSTITUTIONAL PARTNERSHIP</div>
        <h4 style="margin: 0 0 8px 0; font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #0F172A; text-transform: uppercase;">Trade with Institutional Raw Spreads</h4>
        <p style="margin: 0 0 18px 0; font-family: 'Outfit', sans-serif; font-size: 12.5px; color: #475569; line-height: 1.5;">
          Stop paying wide spreads that trigger stop-losses. Open an account with our institutional broker partner to trade Cable and Indices with zero markups.
        </p>
        <a href="${postUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #F9771D; color: #FFFFFF !important; font-family: ui-monospace, monospace; font-size: 10px; font-weight: bold; text-decoration: none; text-transform: uppercase; border-radius: 0 !important; letter-spacing: 1px;">
          View Partner Accounts &rarr;
        </a>
      </div>
    `;
  });

  return html;
}

export function formatHtmlForEmail(html: string, postUrl: string = "https://drawdown.trading"): string {
  if (!html) return "";

  // Convert raw Markdown and custom MDX components to email-safe HTML first
  let styledHtml = convertMarkdownToHtml(html, postUrl);

  // Replace default elements from Tiptap with inline styled equivalents for robust rendering in email clients (including Outlook)
  // We use inline-styles that match Pete's direct style guidelines perfectly (zero border-radius, hairline borders, sans-serif fonts)

  // 1. Headers
  styledHtml = styledHtml.replace(
    /<h2[^>]*>/g,
    `<h2 style="margin: 28px 0 14px 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 700; line-height: 1.3; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">`
  );

  styledHtml = styledHtml.replace(
    /<h3[^>]*>/g,
    `<h3 style="margin: 24px 0 12px 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; line-height: 1.35; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">`
  );

  // 2. Paragraphs
  styledHtml = styledHtml.replace(
    /<p[^>]*>/g,
    `<p style="margin: 0 0 16px 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 1.65; color: #334155;">`
  );

  // 3. Lists
  styledHtml = styledHtml.replace(
    /<ul[^>]*>/g,
    `<ul style="margin: 0 0 16px 0; padding-left: 20px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">`
  );

  styledHtml = styledHtml.replace(
    /<ol[^>]*>/g,
    `<ol style="margin: 0 0 16px 0; padding-left: 20px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">`
  );

  styledHtml = styledHtml.replace(
    /<li[^>]*>/g,
    `<li style="margin-bottom: 8px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 1.6; color: #334155;">`
  );

  // 4. Blockquotes
  styledHtml = styledHtml.replace(
    /<blockquote[^>]*>/g,
    `<blockquote style="margin: 20px 0; border-left: 3px solid #F9771D; padding: 14px 16px; font-family: ui-monospace, monospace; font-size: 14px; font-style: italic; color: #0F172A; background-color: #F8FAFC; border-radius: 0 !important;">`
  );

  // 5. Anchors
  styledHtml = styledHtml.replace(
    /<a ([^>]*href="[^"]*"[^>]*)>/g,
    `<a $1 style="color: #F9771D; text-decoration: underline; font-weight: 500;">`
  );

  // 6. Strong/Bold
  styledHtml = styledHtml.replace(
    /<strong[^>]*>/g,
    `<strong style="font-weight: 700; color: #0F172A;">`
  );

  // 7. Horizontal Rules
  styledHtml = styledHtml.replace(
    /<hr[^>]*>/g,
    `<hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 24px 0;" />`
  );

  // 8. Images inside rich text
  styledHtml = styledHtml.replace(
    /<img([^>]*src="[^"]*"[^>]*)>/g,
    `<img$1 style="display: block; max-width: 100%; height: auto; margin: 20px auto; border: 1px solid #E2E8F0; border-radius: 0 !important; outline: none; text-decoration: none;" />`
  );

  return styledHtml;
}

export function getBlogPostEmailTemplate(data: BlogPostEmailData): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://drawdown.trading";
  const postUrl = `${appUrl}/blog/${data.slug}`;
  const styledBody = formatHtmlForEmail(data.body, postUrl);
  const unsubUrl = data.unsubscribeUrl || "{{unsubscribeUrl}}";

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${data.title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
        /* Override border radius to zero for Pete's premium aesthetic */
        .main, .section-box, .btn-accent, .hero-image-container, blockquote, img {
          border-radius: 0px !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #F1F5F9; padding-top: 40px; padding-bottom: 40px; width: 100% !important; margin: 0;">
        <tr>
          <td align="center" style="font-family: 'Outfit', sans-serif;">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF; margin: 0 auto; width: 100%; max-width: 600px; border: 1px solid #E2E8F0; border-radius: 0px !important; overflow: hidden; box-shadow: none !important;">
              <!-- Header with top orange rule accent -->
              <tr>
                <td class="header" style="border-top: 2px solid #F9771D; border-bottom: 1px solid #E2E8F0; background-color: #FFFFFF; padding: 32px 24px; text-align: center;">
                  <h1 style="color: #0F172A; font-size: 24px; margin: 0 0 4px 0; font-family: 'Outfit', sans-serif; font-weight: 700; letter-spacing: -0.5px; text-transform: uppercase;">Drawdown<span style="color: #F9771D;">.</span></h1>
                  <p style="margin: 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #64748B; font-family: ui-monospace, monospace;">${data.category.toUpperCase()} &bull; Editorial Newsletter</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content" style="padding: 32px 24px; background-color: #FFFFFF; font-family: 'Outfit', sans-serif;">
                  ${data.eyebrow ? `
                    <span style="color: #F9771D; font-family: ui-monospace, monospace; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; display: block; margin-bottom: 8px;">${data.eyebrow}</span>
                  ` : ''}
                  
                  <h2 style="color: #0F172A; font-size: 22px; font-weight: 700; line-height: 1.3; margin: 0 0 10px 0; text-transform: uppercase; font-family: 'Outfit', sans-serif; letter-spacing: 0.5px;">${data.title}</h2>
                  
                  ${data.subtitle ? `
                    <p style="font-size: 15px; line-height: 1.5; color: #64748B; margin: 0 0 24px 0; font-family: 'Outfit', sans-serif;">${data.subtitle}</p>
                  ` : ''}

                  ${data.heroImageUrl ? `
                    <div class="hero-image-container" style="margin-bottom: 24px; border-radius: 0px !important; overflow: hidden; border: 1px solid #E2E8F0; background-color: #F8FAFC; text-align: center; box-shadow: none !important;">
                      <a href="${postUrl}" target="_blank" style="display: block;">
                        <img src="${data.heroImageUrl}" alt="${data.heroImageAlt || data.title}" class="hero-image" style="width: 100%; height: auto; max-height: 320px; object-fit: cover; display: block; border-radius: 0px !important;" border="0" />
                      </a>
                      ${data.heroImageAlt ? `
                        <div class="hero-caption" style="padding: 8px 12px; font-size: 12px; color: #64748B; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: left;">
                          ${data.heroImageAlt}
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}
                  
                  <div class="blog-body" style="margin-top: 24px;">
                    ${styledBody}
                  </div>

                  <!-- CTAs with Bulletproof button pattern & Zero border radius -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px; margin-bottom: 8px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="background-color: #0F172A; border-radius: 0px !important;" class="cta-button">
                              <!--[if mso]>
                              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                                href="${postUrl}" style="height:44px; v-text-anchor:middle; width:220px;" stroke="f" fillcolor="#0F172A">
                                <w:anchorlock/>
                                <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase;">
                                  READ ON THE WEBSITE &rarr;
                                </center>
                              </v:rect>
                              <![endif]-->
                              <!--[if !mso]><!-->
                              <a href="${postUrl}" target="_blank"
                                style="display: block; padding: 13px 28px; font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; color: #FFFFFF !important; text-decoration: none; text-transform: uppercase; text-align: center; white-space: nowrap; border-radius: 0px !important; box-shadow: none !important;">
                                READ ON THE WEBSITE &rarr;
                              </a>
                              <!--<![endif]-->
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer" style="padding: 30px 24px; text-align: center; color: #64748B; font-size: 11px; border-top: 1px solid #E2E8F0; background-color: #F8FAFC; font-family: 'Outfit', sans-serif;">
                  <p style="margin-bottom: 8px; color: #475569; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #64748B;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${unsubUrl}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a></p>
                  <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                  <p class="disclaimer" style="font-size: 10px; color: #94A3B8; margin-top: 20px; line-height: 1.5; text-align: center;">
                    <strong>RISK WARNING:</strong> Trading financial instruments carries high risk. Most retail traders lose capital. Only risk capital you can afford to lose. All content is for educational use only and does not constitute financial advice.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}


