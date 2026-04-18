/**
 * Drawdown Master Newsletter Template
 * Branding: The Wire (Signal Blue accent)
 * Voice: Pete Currey
 */

export function getNewsletterTemplate(content: string, subject: string) {
  const accentColor = "#00C2FF"; // Signal Blue
  const bgColor = "#08090D";
  const surfaceColor = "#111318";
  const textColor = "#E4E2DD";
  const secondaryTextColor = "#7A7D85";

  // Basic HTML sanitization or simple line break conversion if necessary
  const formattedContent = content.replace(/\n/g, "<br/>");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      background-color: ${bgColor};
      color: ${textColor};
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: ${bgColor};
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${surfaceColor};
      border: 1px solid #1A1D24;
    }
    .header {
      padding: 40px;
      border-bottom: 2px solid ${accentColor};
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: ${textColor};
      text-decoration: none;
    }
    .tagline {
      font-size: 10px;
      font-family: 'Courier New', Courier, monospace;
      color: ${secondaryTextColor};
      text-transform: uppercase;
      letter-spacing: 0.2em;
      margin-top: 8px;
    }
    .content {
      padding: 40px;
      font-size: 16px;
      line-height: 1.6;
      color: ${textColor};
    }
    .footer {
      padding: 40px;
      background-color: ${bgColor};
      text-align: center;
      border-top: 1px solid #1A1D24;
    }
    .footer-text {
      font-size: 11px;
      color: ${secondaryTextColor};
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .cta-button {
      display: inline-block;
      padding: 16px 32px;
      background-color: ${accentColor};
      color: ${bgColor} !important;
      text-decoration: none;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 12px;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">DRAWDOWN</div>
        <div class="tagline">// THE WIRE: MORNING INTELLIGENCE</div>
      </div>
      <div class="content">
        ${formattedContent}
        
        <p style="margin-top: 40px; font-weight: bold;">
          Trade with Truth.<br/>
          Pete Currey
        </p>
        
        <a href="https://drawdown.com/dashboard" class="cta-button">Open Dashboard</a>
      </div>
      <div class="footer">
        <p class="footer-text">
          &copy; 2026 DRAWDOWN LTD. CHESTERFIELD, UK.<br/>
          <span style="font-size: 9px; margin-top: 10px; display: block;">NO HYPE. JUST DATA.</span>
        </p>
        <p style="margin-top: 20px;">
          <a href="{{unsubscribe_url}}" style="color: ${secondaryTextColor}; font-size: 10px; text-decoration: underline;">Unsubscribe</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
