const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export function sweepstakeCreatedEmailHtml({
  organiserName,
  sweepstakeName,
  joinLink,
  leaderboardLink,
}: {
  organiserName: string
  sweepstakeName: string
  joinLink: string
  leaderboardLink: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your sweepstake is ready</title>
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
            Your draw is live, ${escapeHtml(organiserName)}! 🙌
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">
            <strong style="color:#1A2E22;">${escapeHtml(sweepstakeName)}</strong> is ready to go.
            Share the sign-up link below and your participants can add themselves — no need to enter them manually.
          </p>

          <!-- Join link box -->
          <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:16px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Self-signup link — share with participants</p>
              <p style="margin:0 0 14px;font-size:13px;color:#1A2E22;word-break:break-all;font-family:monospace;">${joinLink}</p>
              <a href="${joinLink}" style="display:inline-block;background:#C8F04D;color:#1A2E22;font-weight:700;font-size:13px;text-decoration:none;padding:10px 18px;border-radius:8px;letter-spacing:-0.1px;">
                Preview sign-up page →
              </a>
            </td></tr>
          </table>

          <!-- How it works steps -->
          <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#1A2E22;text-transform:uppercase;letter-spacing:0.06em;">How participants sign up</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:#C8F04D;font-weight:700;margin-right:10px;">1.</span>
                    They click the link above (or you send it via WhatsApp, email, etc.)
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:#C8F04D;font-weight:700;margin-right:10px;">2.</span>
                    They enter their name and email — that's it
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:#C8F04D;font-weight:700;margin-right:10px;">3.</span>
                    They appear instantly in your dashboard
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:#C8F04D;font-weight:700;margin-right:10px;">4.</span>
                    When everyone's in — run the draw 🎲
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <a href="${APP_URL}/dashboard" style="display:block;text-align:center;background:#1A2E22;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            Go to your dashboard →
          </a>

          <!-- Leaderboard note -->
          <p style="margin:20px 0 0;font-size:12px;color:#8EA899;text-align:center;line-height:1.6;">
            Your public leaderboard (for after the draw) is at:<br/>
            <a href="${leaderboardLink}" style="color:#5A7265;">${leaderboardLink}</a>
          </p>
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
