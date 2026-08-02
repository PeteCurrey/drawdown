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
  body { margin: 0; padding: 0; width: 100% !important; background-color: #08090D; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #E4E2DD; -webkit-text-size-adjust: none; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  td { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  p { margin: 0 0 16px 0; line-height: 1.6; font-size: 15px; color: #7A7D85; }
  ul { margin: 0 0 16px 0; padding-left: 20px; }
  li { margin-bottom: 8px; line-height: 1.6; font-size: 15px; color: #7A7D85; }
  h1, h2, h3 { color: #E4E2DD; margin: 0 0 16px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  a { color: #F9771D; text-decoration: none; }
  .wrapper { width: 100%; table-layout: fixed; background-color: #08090D; padding-top: 40px; padding-bottom: 40px; }
  .main { background-color: #111318; margin: 0 auto; width: 100%; max-width: 600px; border: 1px solid #1A1D24; border-radius: 8px; overflow: hidden; }
  .header { padding: 32px 24px; border-bottom: 1px solid #1A1D24; text-align: center; background-color: #0B0C10; }
  .content { padding: 32px 24px; }
  .footer { padding: 30px 24px; text-align: center; color: #555550; font-size: 11px; border-top: 1px solid #1A1D24; background-color: #090A0E; }
  .section-box { background-color: #161922; border: 1px solid #1A1D24; border-radius: 6px; padding: 20px; margin-bottom: 24px; }
  .accent-bar { border-left: 3px solid #F9771D; padding-left: 16px; margin: 20px 0; }
  .btn-accent { display: inline-block; background-color: #F9771D; color: #FFFFFF !important; padding: 12px 28px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; border-radius: 4px; }
  .disclaimer { font-size: 10px; color: #555550; margin-top: 20px; line-height: 1.5; }
  .hero-image-container { margin-bottom: 24px; border-radius: 6px; overflow: hidden; border: 1px solid #1A1D24; background-color: #08090D; text-align: center; }
  .hero-image { width: 100%; height: auto; max-height: 320px; object-fit: cover; display: block; }
  .hero-caption { padding: 8px 12px; font-size: 12px; color: #7A7D85; background-color: #161922; border-top: 1px solid #1A1D24; text-align: left; }
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
                  <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #F9771D;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #7A7D85; font-family: ui-monospace, monospace;">You're in. Here's what happens next.</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <p style="color: #E4E2DD; font-size: 16px; font-weight: 500;">Thanks for joining Drawdown.</p>
                  <p>This is a trading education platform built by Pete Currey — a UK-based trader who got fed up of the industry selling expensive nonsense to people who deserve better.</p>
                  <p>You'll receive two emails from us every trading day:</p>
                  
                  <div class="section-box">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #F9771D; font-family: ui-monospace, monospace;">• 07:00 GMT — Morning Brief</p>
                    <p style="margin-bottom: 16px; font-size: 14px; color: #E4E2DD;">What's moving, what's on the calendar, and the key levels to watch for the session ahead.</p>
                    
                    <p style="margin-bottom: 8px; font-weight: bold; color: #F9771D; font-family: ui-monospace, monospace;">• 17:30 GMT — Evening Wrap</p>
                    <p style="margin-bottom: 0; font-size: 14px; color: #E4E2DD;">How the session played out, what to watch for tomorrow, and one educational insight tied directly to the day's real price action.</p>
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
                  <p style="margin-bottom: 8px; color: #7A7D85; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #555550;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${unsubscribeUrl}" style="color: #7A7D85; text-decoration: underline;">Unsubscribe</a></p>
                  <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 20px 0;" />
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
    .map(p => `<p style="font-size: 15px; line-height: 1.6; color: #E4E2DD; margin-bottom: 14px;">${p.replace(/\\n/g, '<br/>')}</p>`)
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
                  <span style="color: #F9771D; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; display: inline-block; background-color: rgba(249, 119, 29, 0.12); padding: 4px 12px; border-radius: 4px; margin-bottom: 10px;">🚨 BREAKING NEWS</span>
                  <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #F9771D;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #7A7D85; font-family: ui-monospace, monospace;">The Wire &bull; Instant Market Alert</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  ${renderHeroImage(data.imageUrl, data.imageCaption || data.subject, data.articleUrl)}
                  
                  <div class="accent-bar" style="border-left-color: #F9771D;">
                    ${contentParagraphs}
                  </div>

                  ${data.source || data.articleUrl ? `
                    <div class="section-box" style="margin-top: 24px; padding: 14px 18px;">
                      <p style="margin: 0; font-size: 13px; color: #7A7D85;">
                        Original Source: ${data.articleUrl ? `<a href="${data.articleUrl}" target="_blank" style="color: #F9771D; font-weight: 600; text-decoration: underline;">${data.source || 'Read full article'} &rarr;</a>` : `<strong style="color: #E4E2DD;">${data.source}</strong>`}
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
                  <p style="margin-bottom: 8px; color: #7A7D85;">Drawdown Platform Ltd &bull; UK-first Market Intelligence</p>
                  <p style="margin-bottom: 16px; color: #555550;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${data.unsubscribeUrl || '#'}" style="color: #7A7D85; text-decoration: underline;">Unsubscribe</a></p>
                  <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 20px 0;" />
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
    <tr style="border-bottom: 1px solid #1A1D24;">
      <td style="padding: 10px 8px; font-family: ui-monospace, monospace; font-size: 13px; color: #7A7D85;">${e.time}</td>
      <td style="padding: 10px 8px; font-size: 13px; font-weight: 600; color: #E4E2DD;">${e.event}</td>
      <td style="padding: 10px 8px; font-family: ui-monospace, monospace; font-size: 13px; color: #E4E2DD;">${e.currency}</td>
      <td style="padding: 10px 8px; font-size: 12px; font-weight: 700; color: ${e.expected_impact.toLowerCase() === 'high' ? '#CE6969' : '#F9771D'};">${e.expected_impact}</td>
    </tr>
  `).join('');

  const ratesHtml = data.marketRates.map(r => `
    <tr style="border-bottom: 1px solid #1A1D24;">
      <td style="padding: 10px 8px; font-size: 13px; font-weight: 600; color: #E4E2DD;">${r.pair}</td>
      <td style="padding: 10px 8px; font-family: ui-monospace, monospace; font-size: 13px; color: #7A7D85;">${r.price}</td>
      <td style="padding: 10px 8px; font-family: ui-monospace, monospace; font-size: 13px; font-weight: 600; color: ${r.change.startsWith('-') ? '#CE6969' : '#18B880'};">${r.change}</td>
      <td style="padding: 10px 8px; font-size: 12px; font-family: ui-monospace, monospace; text-transform: uppercase; font-weight: 700; color: ${r.bias.toLowerCase() === 'bullish' ? '#18B880' : r.bias.toLowerCase() === 'bearish' ? '#CE6969' : '#7A7D85'};">${r.bias}</td>
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
        .brief-table th { padding: 8px; text-align: left; font-size: 11px; font-family: ui-monospace, monospace; color: #7A7D85; text-transform: uppercase; border-bottom: 1px solid #1A1D24; }
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
                  <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">The Wire</h1>
                  <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #7A7D85; font-family: ui-monospace, monospace;">${data.dateStr} &bull; 07:00 GMT</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  ${renderHeroImage(data.imageUrl, data.imageCaption, data.articleUrl)}

                  <!-- Today's Session -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Today's Session</h2>
                  <ul>
                    ${data.sessionBullets.map(b => `<li style="color: #E4E2DD;">${b}</li>`).join('')}
                  </ul>
                  
                  <!-- Economic Calendar -->
                  ${data.economicEvents.length > 0 ? `
                    <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Macro Calendar</h2>
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
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Market at a Glance</h2>
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
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Pete's Take</h2>
                  <div class="accent-bar" style="border-left-color: #F9771D;">
                    <div style="font-size: 15px; line-height: 1.6; color: #E4E2DD; font-style: italic;">
                      ${data.petesTake.split('\n\n').map(p => `<p style="color: #E4E2DD; margin-bottom: 12px;">${p}</p>`).join('')}
                    </div>
                  </div>
                  
                  <!-- One Thing to Learn Today -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// One Thing to Learn Today</h2>
                  <div class="section-box" style="margin-bottom: 30px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #E4E2DD;">${data.oneThing}</p>
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
                  <p style="margin-bottom: 8px; color: #7A7D85;">Drawdown Platform Ltd &bull; UK-first Market Intelligence</p>
                  <p style="margin-bottom: 16px; color: #555550;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${data.unsubscribeUrl}" style="color: #7A7D85; text-decoration: underline;">Unsubscribe</a></p>
                  <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 20px 0;" />
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
                  <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">The Wire</h1>
                  <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #7A7D85; font-family: ui-monospace, monospace;">${data.dateStr} &bull; 17:30 GMT</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  ${renderHeroImage(data.imageUrl, data.imageCaption, data.articleUrl)}

                  <!-- How the Session Played Out -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// How the Session Played Out</h2>
                  <div style="font-size: 15px; line-height: 1.6; color: #E4E2DD; margin-bottom: 24px;">
                    ${data.howItPlayedOut.split('\n\n').map(p => `<p style="margin-bottom: 12px; color: #E4E2DD;">${p}</p>`).join('')}
                  </div>
                  
                  <!-- Tomorrow's Watch List -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Tomorrow's Watch List</h2>
                  <div style="font-size: 15px; line-height: 1.6; color: #E4E2DD; margin-bottom: 24px;">
                    ${data.tomorrowWatchList.split('\n\n').map(p => `<p style="margin-bottom: 12px; color: #E4E2DD;">${p}</p>`).join('')}
                  </div>
                  
                  <!-- Trade of the Session -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Trade of the Session</h2>
                  <div class="section-box" style="margin-bottom: 24px;">
                    <div style="font-size: 14px; line-height: 1.6; color: #E4E2DD;">
                      ${data.tradeOfSession.split('\n\n').map(p => `<p style="margin-bottom: 12px; color: #E4E2DD; &:last-child { margin-bottom: 0; }">${p}</p>`).join('')}
                    </div>
                  </div>
                  
                  <!-- Curriculum Link -->
                  <h2 style="font-size: 13px; color: #F9771D; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: ui-monospace, monospace; letter-spacing: 1px;">// Curriculum Connection</h2>
                  <div class="accent-bar" style="border-left-color: #F9771D; margin-bottom: 30px;">
                    <p style="color: #E4E2DD; font-style: italic; margin-bottom: 8px;">${data.curriculumTopic}</p>
                    <p style="margin-bottom: 0; font-size: 13px; color: #7A7D85;">Learn more about this mechanism inside the Drawdown modules.</p>
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
                  <p style="margin-bottom: 8px; color: #7A7D85;">Drawdown Platform Ltd &bull; UK-first Market Intelligence</p>
                  <p style="margin-bottom: 16px; color: #555550;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${data.unsubscribeUrl}" style="color: #7A7D85; text-decoration: underline;">Unsubscribe</a></p>
                  <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 20px 0;" />
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

export function getSurvivalKitConfirmationTemplate(downloadUrl: string, tempPassword?: string): string {
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
                <td class="header" style="border-bottom: 2px solid #C8F135;">
                  <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #C8F135;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #7A7D85; font-family: ui-monospace, monospace;">Prop Challenge Survival Kit</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <p style="color: #E4E2DD; font-size: 16px; font-weight: 500;">Your Survival Kit is ready.</p>
                  <p>Thank you for your purchase. You are now equipped with the complete blueprint to navigate, protect, and pass your prop firm evaluation.</p>
                  
                  <div class="section-box" style="border-color: #C8F135; background-color: rgba(200, 241, 53, 0.04);">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #C8F135; font-family: ui-monospace, monospace;">// WHAT IS INCLUDED:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #E4E2DD;">
                      <li style="color: #E4E2DD;"><strong>The Rule Decoder:</strong> Every drawdown calculation type explained with clear examples.</li>
                      <li style="color: #E4E2DD;"><strong>The Position Sizing Sheets:</strong> The templates to manage your daily loss limits.</li>
                      <li style="color: #E4E2DD;"><strong>The Tilt Protocol:</strong> Psychological blueprints to manage drawdown spirals.</li>
                    </ul>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <a href="${downloadUrl}" class="btn-accent" style="background-color: #C8F135; color: #08090D !important;" target="_blank">Download Survival Kit PDF &rarr;</a>
                      </td>
                    </tr>
                  </table>
                  
                  ${tempPassword ? `
                  <div class="section-box">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #F9771D; font-family: ui-monospace, monospace;">// YOUR ACCOUNT ACCESS:</p>
                    <p style="font-size: 14px; margin-bottom: 8px; color: #E4E2DD;">We created a companion account for you so you can access the interactive modules and templates on the Drawdown dashboard.</p>
                    <p style="font-size: 14px; margin-bottom: 4px; color: #E4E2DD;"><strong>Login URL:</strong> <a href="https://drawdown.trading/login" style="color: #C8F135; text-decoration: underline;">drawdown.trading/login</a></p>
                    <p style="font-size: 14px; margin-bottom: 4px; color: #E4E2DD;"><strong>Password:</strong> <code style="background-color: #1A1D24; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>
                    <p style="font-size: 12px; color: #7A7D85; margin-top: 8px;">Please log in and update your password on your profile dashboard.</p>
                  </div>
                  ` : `
                  <p>You can also log in to your Drawdown account to access the interactive modules and sheets directly on your dashboard.</p>
                  `}
                  
                  <p style="font-size: 14px; margin-top: 24px;">If you have any questions or need support, reply directly to this email.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #7A7D85; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #555550;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 20px 0;" />
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

export function getHowToTradeConfirmationTemplate(downloadUrl: string, tempPassword?: string): string {
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
                  <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #F9771D;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #7A7D85; font-family: ui-monospace, monospace;">How to Trade — 100-Page Framework</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <p style="color: #E4E2DD; font-size: 16px; font-weight: 500;">Your guide is ready to read.</p>
                  <p>Thank you for your purchase. You now have the complete institutional trading framework — from market structure through to live execution.</p>
                  
                  <div class="section-box" style="border-color: #F9771D; background-color: rgba(249, 119, 29, 0.04);">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #F9771D; font-family: ui-monospace, monospace;">// WHAT IS COVERED:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #E4E2DD;">
                      <li style="color: #E4E2DD;"><strong>Market Structure:</strong> How price moves and why — institutional vs retail perspective.</li>
                      <li style="color: #E4E2DD;"><strong>Session Theory:</strong> London, New York & Asian overlap — where the real money is made.</li>
                      <li style="color: #E4E2DD;"><strong>Trade Execution:</strong> Entries, stop placement, and the anatomy of a complete trade.</li>
                      <li style="color: #E4E2DD;"><strong>Risk Management:</strong> Position sizing, R:R, and protecting your capital as a business.</li>
                    </ul>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <a href="${downloadUrl}" class="btn-accent" style="background-color: #F9771D; color: #FFFFFF !important;" target="_blank">Download How to Trade PDF &rarr;</a>
                      </td>
                    </tr>
                  </table>
                  
                  ${tempPassword ? `
                  <div class="section-box">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #F9771D; font-family: ui-monospace, monospace;">// YOUR ACCOUNT ACCESS:</p>
                    <p style="font-size: 14px; margin-bottom: 8px; color: #E4E2DD;">We created a Drawdown account for you so you can access your downloads anytime from your dashboard.</p>
                    <p style="font-size: 14px; margin-bottom: 4px; color: #E4E2DD;"><strong>Login URL:</strong> <a href="https://drawdown.trading/login" style="color: #F9771D; text-decoration: underline;">drawdown.trading/login</a></p>
                    <p style="font-size: 14px; margin-bottom: 4px; color: #E4E2DD;"><strong>Password:</strong> <code style="background-color: #1A1D24; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>
                    <p style="font-size: 12px; color: #7A7D85; margin-top: 8px;">Please log in and update your password on your profile dashboard.</p>
                  </div>
                  ` : `
                  <p>You can also log in to your Drawdown account to access your downloads at any time from your personal dashboard.</p>
                  `}
                  
                  <p style="font-size: 14px; margin-top: 24px;">If you have any questions, reply directly to this email and Pete will get back to you.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #7A7D85; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #555550;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 20px 0;" />
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

export function getTheEdgeConfirmationTemplate(downloadUrl: string, tempPassword?: string): string {
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
                <td class="header" style="border-bottom: 2px solid #818cf8;">
                  <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px;">Drawdown<span style="color: #818cf8;">.</span></h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #7A7D85; font-family: ui-monospace, monospace;">The Edge Manual — Advanced Strategy Playbook</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <p style="color: #E4E2DD; font-size: 16px; font-weight: 500;">Your Edge Manual is ready.</p>
                  <p>Thank you for your purchase. You now have Pete's complete advanced strategy playbook — the same framework used across live funded accounts.</p>
                  
                  <div class="section-box" style="border-color: #818cf8; background-color: rgba(129, 140, 248, 0.04);">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #818cf8; font-family: ui-monospace, monospace;">// WHAT IS COVERED:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #E4E2DD;">
                      <li style="color: #E4E2DD;"><strong>Liquidity Theory:</strong> Where institutional money hunts stops — and how to trade with it.</li>
                      <li style="color: #E4E2DD;"><strong>Confluence Trading:</strong> Stacking multiple confirmations for high-probability entries.</li>
                      <li style="color: #E4E2DD;"><strong>Proprietary Setups:</strong> Pete's personal playbook of repeatable trade patterns.</li>
                      <li style="color: #E4E2DD;"><strong>Psychological Edge:</strong> Managing the mental game — discipline, consistency and detachment.</li>
                    </ul>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <a href="${downloadUrl}" class="btn-accent" style="background-color: #818cf8; color: #FFFFFF !important;" target="_blank">Download The Edge Manual PDF &rarr;</a>
                      </td>
                    </tr>
                  </table>
                  
                  ${tempPassword ? `
                  <div class="section-box">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #818cf8; font-family: ui-monospace, monospace;">// YOUR ACCOUNT ACCESS:</p>
                    <p style="font-size: 14px; margin-bottom: 8px; color: #E4E2DD;">We created a Drawdown account for you so you can access your downloads anytime from your dashboard.</p>
                    <p style="font-size: 14px; margin-bottom: 4px; color: #E4E2DD;"><strong>Login URL:</strong> <a href="https://drawdown.trading/login" style="color: #818cf8; text-decoration: underline;">drawdown.trading/login</a></p>
                    <p style="font-size: 14px; margin-bottom: 4px; color: #E4E2DD;"><strong>Password:</strong> <code style="background-color: #1A1D24; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>
                    <p style="font-size: 12px; color: #7A7D85; margin-top: 8px;">Please log in and update your password on your profile dashboard.</p>
                  </div>
                  ` : `
                  <p>You can also log in to your Drawdown account to access your downloads at any time from your personal dashboard.</p>
                  `}
                  
                  <p style="font-size: 14px; margin-top: 24px;">If you have any questions, reply directly to this email and Pete will get back to you.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #7A7D85; font-weight: 500;">Pete Currey &bull; Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #555550;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 20px 0;" />
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
