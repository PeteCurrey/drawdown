export function getNewsletterTemplate(content: string, title = "The Wire") {
  // Rigid HTML table structure for maximum email client compatibility (Outlook, Gmail, Apple Mail)
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${title}</title>
      <style type="text/css" rel="stylesheet" media="all">
        body { margin: 0; padding: 0; width: 100% !important; background-color: #08090D; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; color: #E4E2DD; }
        table { border-collapse: collapse; }
        td { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        p { margin: 0 0 15px 0; line-height: 1.6; font-size: 16px; color: #8C8B87; }
        h1, h2, h3 { color: #E4E2DD; margin: 0 0 15px 0; text-transform: uppercase; font-weight: bold; }
        a { color: #00C2FF; text-decoration: none; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #08090D; padding-bottom: 60px; }
        .main { background-color: #111318; margin: 0 auto; width: 100%; max-width: 600px; border: 1px solid #1A1D24; }
        .header { padding: 40px 30px; border-bottom: 2px solid #00C2FF; background-color: #08090D; text-align: center; }
        .content { padding: 40px 30px; }
        .footer { padding: 30px; text-align: center; color: #4A4D55; font-size: 12px; border-top: 1px solid #1A1D24; background-color: #08090D; }
        
        /* Typography overrides for the parsed markdown content */
        .content_html p { margin-bottom: 20px; }
        .content_html h2 { font-size: 24px; margin-top: 30px; color: #E4E2DD; }
        .content_html h3 { font-size: 18px; color: #00C2FF; }
        .content_html ul { margin: 0 0 20px 0; padding-left: 20px; color: #8C8B87;}
        .content_html li { margin-bottom: 10px; line-height: 1.6; }
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
                  <h1 style="color: #00C2FF; font-size: 28px; margin: 0; letter-spacing: 4px;">DRAWDOWN</h1>
                  <p style="margin: 10px 0 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #4A4D55;">Market Intelligence</p>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td class="content">
                  <div class="content_html">
                    ${content}
                  </div>
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 40px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" bgcolor="#00C2FF" style="border-radius: 2px;">
                              <a href="https://drawdown.com/dashboard" target="_blank" style="font-size: 14px; font-weight: bold; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; color: #08090D; text-decoration: none; padding: 15px 30px; border: 1px solid #00C2FF; display: inline-block;">OPEN TERMINAL</a>
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
                <td class="footer">
                  <p style="margin: 0 0 10px 0;">This email is for educational purposes only. Not financial advice.</p>
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} Drawdown. All rights reserved.</p>
                  <p style="margin: 10px 0 0 0;"><a href="#" style="color: #4A4D55; text-decoration: underline;">Unsubscribe</a></p>
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
