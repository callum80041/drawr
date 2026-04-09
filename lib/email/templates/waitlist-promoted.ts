import { emailHeader } from './_header'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export function waitlistPromotedEmailHtml({
  name,
  sweepstakeName,
  shareToken,
  entryFee,
}: {
  name: string
  sweepstakeName: string
  shareToken: string
  entryFee: number
}) {
  const leaderboardLink = `${APP_URL}/s/${shareToken}`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>You're in!</title>
</head>
<body style="margin:0;padding:0;background:#F5F9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9F6;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid #E5EDEA;overflow:hidden;">

      ${emailHeader}

      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A2E22;letter-spacing:-0.3px;">
            Good news, ${escapeHtml(name)}! You&apos;re in 🎉
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">
            A spot opened up in <strong style="color:#1A2E22;">${escapeHtml(sweepstakeName)}</strong> and you&apos;ve
            been moved from the reserve list to a confirmed place. You&apos;ll be assigned a team when the organiser runs the draw.
          </p>

          ${entryFee > 0 ? `
          <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0;font-size:13px;color:#5A7265;">
                <strong style="color:#1A2E22;">Entry fee:</strong> £${Number(entryFee).toFixed(2)} — pay your organiser directly.
              </p>
            </td></tr>
          </table>
          ` : ''}

          <a href="${leaderboardLink}" style="display:block;text-align:center;background:#C8F04D;color:#1A2E22;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            View the leaderboard →
          </a>
        </td>
      </tr>

      <tr>
        <td style="background:#F5F9F6;padding:16px 32px;border-top:1px solid #E5EDEA;">
          <p style="margin:0;font-size:11px;color:#8EA899;text-align:center;">
            Drawr · playdrawr.co.uk · We will never share your details with anyone.
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
