import { emailHeader, emailHeaderEurovision, spotifyBlock } from './_header'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export function waitlistPromotedEmailHtml({
  name,
  sweepstakeName,
  shareToken,
  entryFee,
  isEurovision = false,
}: {
  name: string
  sweepstakeName: string
  shareToken: string
  entryFee: number
  isEurovision?: boolean
}) {
  const leaderboardLink = `${APP_URL}/s/${shareToken}`
  const header = isEurovision ? emailHeaderEurovision : emailHeader
  const pageBg = isEurovision ? '#EEE8FF' : '#F5F9F6'
  const sectionBg = isEurovision ? '#E6DCFF' : '#F5F9F6'
  const border = isEurovision ? '#CFC3F0' : '#E5EDEA'
  const accent = isEurovision ? '#F10F59' : '#C8F04D'
  const accentText = isEurovision ? '#ffffff' : '#1A2E22'
  const footerBg = isEurovision ? '#1B0744' : '#F5F9F6'
  const footerText = isEurovision ? 'rgba(255,255,255,0.4)' : '#8EA899'
  const assignedThing = isEurovision ? 'a country' : 'a team'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>You're in!</title>
</head>
<body style="margin:0;padding:0;background:${pageBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${pageBg};padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid ${border};overflow:hidden;">

      ${header}

      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A2E22;letter-spacing:-0.3px;">
            Good news, ${escapeHtml(name)}! You&apos;re in 🎉
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">
            A spot opened up in <strong style="color:#1A2E22;">${escapeHtml(sweepstakeName)}</strong> and you&apos;ve
            been moved from the reserve list to a confirmed place. You&apos;ll be assigned ${assignedThing} when the organiser runs the draw.
          </p>

          ${entryFee > 0 ? `
          <table cellpadding="0" cellspacing="0" style="width:100%;background:${sectionBg};border-radius:12px;margin-bottom:20px;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0;font-size:13px;color:#5A7265;">
                <strong style="color:#1A2E22;">Entry fee:</strong> £${Number(entryFee).toFixed(2)} — pay your organiser directly.
              </p>
            </td></tr>
          </table>
          ` : ''}

          ${isEurovision ? spotifyBlock : ''}

          <a href="${leaderboardLink}" style="display:block;text-align:center;background:${accent};color:${accentText};font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            View the leaderboard →
          </a>
        </td>
      </tr>

      <tr>
        <td style="background:${footerBg};padding:16px 32px;border-top:1px solid ${border};">
          <p style="margin:0;font-size:11px;color:${footerText};text-align:center;">
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
