const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export function welcomeEmailHtml({ name }: { name: string }) {
  const dashboardLink = `${APP_URL}/dashboard`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to Drawr</title>
</head>
<body style="margin:0;padding:0;background:#F5F9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9F6;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid #E5EDEA;overflow:hidden;">

      <!-- Header -->
      <tr>
        <td style="background:#1A2E22;padding:28px 32px;">
          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Drawr 🎲</p>
          <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">World Cup 2026 Sweepstakes</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A2E22;letter-spacing:-0.3px;">
            Welcome to Drawr, ${escapeHtml(name)}! ⚽
          </p>
          <p style="margin:0 0 20px;font-size:15px;color:#5A7265;line-height:1.6;">
            You're all set to run your World Cup 2026 sweepstake. Add your participants,
            set an entry fee if you want, and when you're ready — hit the draw button and
            watch the chaos unfold.
          </p>

          <!-- What happens next -->
          <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#1A2E22;text-transform:uppercase;letter-spacing:0.06em;">What happens next</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:#C8F04D;font-weight:700;margin-right:10px;">1.</span>
                    Add your participants and their email addresses
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:#C8F04D;font-weight:700;margin-right:10px;">2.</span>
                    Run the draw — teams are assigned randomly, one by one
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:#C8F04D;font-weight:700;margin-right:10px;">3.</span>
                    Everyone gets their team emailed to them automatically
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:#C8F04D;font-weight:700;margin-right:10px;">4.</span>
                    Sit back. Watch the tournament. Collect the prize pot.
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <a href="${dashboardLink}" style="display:block;text-align:center;background:#C8F04D;color:#1A2E22;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            Go to your dashboard →
          </a>

          <!-- No spam note -->
          <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:24px;background:#F5F9F6;border-radius:10px;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0;font-size:13px;color:#5A7265;line-height:1.6;">
                <strong style="color:#1A2E22;">One more thing —</strong> we're not going to clog up your inbox.
                We'll only ever drop you a line when there's actually something worth knowing:
                a leaderboard shake-up after matchday, or your sweepstake reaching a big moment.
                No newsletters. No "just checking in." Just football. ⚽
              </p>
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#F5F9F6;padding:16px 32px;border-top:1px solid #E5EDEA;">
          <p style="margin:0;font-size:11px;color:#8EA899;text-align:center;">
            Drawr · playdrawr.co.uk · We will never share your details with anyone. No spam, ever.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
