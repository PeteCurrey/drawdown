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

export interface MorningBriefData {
  dateStr: string;
  subject: string;
  preview: string;
  sessionBullets: string[];
  economicEvents: EconomicEvent[];
  marketRates: MarketRate[];
  petesTake: string;
  oneThing: string;
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
  unsubscribeUrl: string;
}

const getBaseStyles = () => `
  body { margin: 0; padding: 0; width: 100% !important; background-color: #08090D; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #E4E2DD; -webkit-text-size-adjust: none; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  td { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  p { margin: 0 0 16px 0; line-height: 1.6; font-size: 15px; color: #8C8B87; }
  ul { margin: 0 0 16px 0; padding-left: 20px; }
  li { margin-bottom: 8px; line-height: 1.6; font-size: 15px; color: #8C8B87; }
  h1, h2, h3 { color: #E4E2DD; margin: 0 0 16px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
  a { color: #00C2FF; text-decoration: none; }
  .wrapper { width: 100%; table-layout: fixed; background-color: #08090D; padding-top: 40px; padding-bottom: 40px; }
  .main { background-color: #0D0E12; margin: 0 auto; width: 100%; max-width: 600px; border: 1px solid #1A1D24; }
  .header { padding: 30px 24px; border-bottom: 1px solid #1A1D24; text-align: center; }
  .content { padding: 40px 24px; }
  .footer { padding: 30px 24px; text-align: center; color: #4A4D55; font-size: 11px; border-top: 1px solid #1A1D24; background-color: #0A0A0A; }
  .section-box { background-color: #12141C; border: 1px solid #1C1F2B; padding: 24px; margin-bottom: 24px; }
  .accent-bar { border-left: 3px solid #f59e0b; padding-left: 16px; margin: 20px 0; }
  .btn-accent { display: inline-block; background-color: transparent; border: 1px solid #f59e0b; color: #f59e0b !important; padding: 12px 24px; font-family: monospace; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; }
  .disclaimer { font-size: 10px; color: #4A4D55; margin-top: 20px; line-height: 1.5; }
`;

export function getWelcomeTemplate(unsubscribeUrl: string = "#"): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Welcome to Drawdown</title>
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
                <td class="header" style="background-color: #0A0A0A;">
                  <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-family: Georgia, serif; letter-spacing: -0.5px;">Drawdown<span style="color: #f59e0b;">.</span></h1>
                  <p style="margin: 4px 0 0 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #8C8B87;">You're in. Here's what happens next.</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <p>Thanks for joining Drawdown.</p>
                  <p>This is a trading education platform built by Pete Currey — a UK-based trader who got fed up of the industry selling expensive nonsense to people who deserve better.</p>
                  <p>You'll receive two emails from us every trading day:</p>
                  
                  <div class="section-box">
                    <p style="margin-bottom: 8px; font-weight: bold; color: #E4E2DD; font-family: monospace;">• 07:00 GMT — Morning Brief</p>
                    <p style="margin-bottom: 16px; font-size: 14px;">What's moving, what's on the calendar, and the key levels to watch for the session ahead.</p>
                    
                    <p style="margin-bottom: 8px; font-weight: bold; color: #E4E2DD; font-family: monospace;">• 17:30 GMT — Evening Wrap</p>
                    <p style="margin-bottom: 0; font-size: 14px;">How the session played out, what to watch for tomorrow, and one educational insight tied directly to the day's real price action.</p>
                  </div>
                  
                  <p>No spam. No upsells hidden in market commentary. Just honest trading intelligence, twice a day.</p>
                  <p>Your free account gives you access to Phase 1 of the curriculum and two AI tools — the Risk Calculator and the Intelligence Hub. Start there.</p>
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; margin-bottom: 10px;">
                    <tr>
                      <td align="center">
                        <a href="https://drawdown.trading/courses" class="btn-accent" target="_blank">Start Phase 1 Free →</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #4A4D55;">Pete Currey — Drawdown Trading</p>
                  <p style="margin-bottom: 16px; color: #4A4D55;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${unsubscribeUrl}" style="color: #4A4D55; text-decoration: underline;">Unsubscribe</a></p>
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
    <tr style="border-bottom: 1px solid #1C1F2B;">
      <td style="padding: 10px 8px; font-family: monospace; font-size: 13px; color: #8C8B87;">${e.time}</td>
      <td style="padding: 10px 8px; font-size: 13px; font-weight: bold; color: #E4E2DD;">${e.event}</td>
      <td style="padding: 10px 8px; font-family: monospace; font-size: 13px; color: #E4E2DD;">${e.currency}</td>
      <td style="padding: 10px 8px; font-size: 12px; font-weight: bold; color: ${e.expected_impact.toLowerCase() === 'high' ? '#ef4444' : '#f59e0b'};">${e.expected_impact}</td>
    </tr>
  `).join('');

  const ratesHtml = data.marketRates.map(r => `
    <tr style="border-bottom: 1px solid #1C1F2B;">
      <td style="padding: 10px 8px; font-size: 13px; font-weight: bold; color: #E4E2DD;">${r.pair}</td>
      <td style="padding: 10px 8px; font-family: monospace; font-size: 13px; color: #8C8B87;">${r.price}</td>
      <td style="padding: 10px 8px; font-family: monospace; font-size: 13px; color: ${r.change.startsWith('-') ? '#ef4444' : '#22c55e'};">${r.change}</td>
      <td style="padding: 10px 8px; font-size: 12px; font-family: monospace; text-transform: uppercase; color: ${r.bias.toLowerCase() === 'bullish' ? '#22c55e' : r.bias.toLowerCase() === 'bearish' ? '#ef4444' : '#8C8B87'};">${r.bias}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${data.subject}</title>
      <style type="text/css" rel="stylesheet" media="all">
        ${getBaseStyles()}
        .brief-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
        .brief-table th { padding: 8px; text-align: left; font-size: 11px; font-family: monospace; color: #4A4D55; text-transform: uppercase; border-bottom: 1px solid #1C1F2B; }
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Header -->
              <tr>
                <td class="header" style="background-color: #0A0A0A; border-bottom: 2px solid #ef4444;">
                  <span style="color: #ef4444; font-family: monospace; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 4px;">// MORNING BRIEF</span>
                  <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-family: Georgia, serif; letter-spacing: -0.5px;">The Wire</h1>
                  <p style="margin: 4px 0 0 0; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #8C8B87;">${data.dateStr} &bull; 07:00 GMT</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <!-- Today's Session -->
                  <h2 style="font-size: 14px; color: #ef4444; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-bottom: 16px; font-family: monospace;">// Today's Session</h2>
                  <ul>
                    ${data.sessionBullets.map(b => `<li>${b}</li>`).join('')}
                  </ul>
                  
                  <!-- Economic Calendar -->
                  ${data.economicEvents.length > 0 ? `
                    <h2 style="font-size: 14px; color: #ef4444; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: monospace;">// Macro Calendar</h2>
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
                  <h2 style="font-size: 14px; color: #ef4444; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: monospace;">// Market at a Glance</h2>
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
                  <h2 style="font-size: 14px; color: #ef4444; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: monospace;">// Pete's Take</h2>
                  <div class="accent-bar" style="border-left-color: #ef4444;">
                    <div style="font-size: 15px; line-height: 1.6; color: #E4E2DD; font-style: italic;">
                      ${data.petesTake.split('\n\n').map(p => `<p style="color: #E4E2DD; margin-bottom: 12px;">${p}</p>`).join('')}
                    </div>
                  </div>
                  
                  <!-- One Thing to Learn Today -->
                  <h2 style="font-size: 14px; color: #ef4444; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: monospace;">// One Thing to Learn Today</h2>
                  <div class="section-box" style="margin-bottom: 30px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6;">${data.oneThing}</p>
                  </div>
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; margin-bottom: 10px;">
                    <tr>
                      <td align="center">
                        <a href="https://drawdown.trading/dashboard" class="btn-accent" style="border-color: #ef4444; color: #ef4444 !important;" target="_blank">View Full Analysis on Drawdown &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #4A4D55;">Drawdown Platform Ltd &bull; UK-first Market Intelligence</p>
                  <p style="margin-bottom: 16px; color: #4A4D55;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${data.unsubscribeUrl}" style="color: #4A4D55; text-decoration: underline;">Unsubscribe</a></p>
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
                <td class="header" style="background-color: #0A0A0A; border-bottom: 2px solid #00C2FF;">
                  <span style="color: #00C2FF; font-family: monospace; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 4px;">// EVENING WRAP</span>
                  <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-family: Georgia, serif; letter-spacing: -0.5px;">The Wire</h1>
                  <p style="margin: 4px 0 0 0; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #8C8B87;">${data.dateStr} &bull; 17:30 GMT</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  <!-- How the Session Played Out -->
                  <h2 style="font-size: 14px; color: #00C2FF; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-bottom: 16px; font-family: monospace;">// How the Session Played Out</h2>
                  <div style="font-size: 15px; line-height: 1.6; color: #cccccc; margin-bottom: 24px;">
                    ${data.howItPlayedOut.split('\n\n').map(p => `<p style="margin-bottom: 12px;">${p}</p>`).join('')}
                  </div>
                  
                  <!-- Tomorrow's Watch List -->
                  <h2 style="font-size: 14px; color: #00C2FF; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: monospace;">// Tomorrow's Watch List</h2>
                  <div style="font-size: 15px; line-height: 1.6; color: #cccccc; margin-bottom: 24px;">
                    ${data.tomorrowWatchList.split('\n\n').map(p => `<p style="margin-bottom: 12px;">${p}</p>`).join('')}
                  </div>
                  
                  <!-- Trade of the Session -->
                  <h2 style="font-size: 14px; color: #00C2FF; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: monospace;">// Trade of the Session</h2>
                  <div class="section-box" style="margin-bottom: 24px;">
                    <div style="font-size: 14px; line-height: 1.6; color: #cccccc;">
                      ${data.tradeOfSession.split('\n\n').map(p => `<p style="margin-bottom: 12px; &:last-child { margin-bottom: 0; }">${p}</p>`).join('')}
                    </div>
                  </div>
                  
                  <!-- Curriculum Link -->
                  <h2 style="font-size: 14px; color: #00C2FF; border-bottom: 1px solid #1A1D24; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; font-family: monospace;">// Curriculum Connection</h2>
                  <div class="accent-bar" style="border-left-color: #00C2FF; margin-bottom: 30px;">
                    <p style="color: #E4E2DD; font-style: italic; margin-bottom: 8px;">${data.curriculumTopic}</p>
                    <p style="margin-bottom: 0; font-size: 13px; color: #8C8B87;">Learn more about this mechanism inside the Drawdown modules.</p>
                  </div>
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; margin-bottom: 10px;">
                    <tr>
                      <td align="center">
                        <a href="${data.curriculumModuleLink}" class="btn-accent" style="border-color: #00C2FF; color: #00C2FF !important;" target="_blank">Continue Your Curriculum &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin-bottom: 8px; color: #4A4D55;">Drawdown Platform Ltd &bull; UK-first Market Intelligence</p>
                  <p style="margin-bottom: 16px; color: #4A4D55;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin-bottom: 16px;"><a href="${data.unsubscribeUrl}" style="color: #4A4D55; text-decoration: underline;">Unsubscribe</a></p>
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
