import { emailHeader, emailHeaderEurovision } from './_header'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export function sweepstakeCreatedEmailHtml({
  organiserName,
  sweepstakeName,
  joinLink,
  leaderboardLink,
  isEurovision = false,
}: {
  organiserName: string
  sweepstakeName: string
  joinLink: string
  leaderboardLink: string
  isEurovision?: boolean
}) {
  const header = isEurovision ? emailHeaderEurovision : emailHeader
  const pageBg = isEurovision ? '#EEE8FF' : '#F5F9F6'
  const sectionBg = isEurovision ? '#E6DCFF' : '#F5F9F6'
  const border = isEurovision ? '#CFC3F0' : '#E5EDEA'
  const accent = isEurovision ? '#F10F59' : '#C8F04D'
  const accentText = isEurovision ? '#ffffff' : '#1A2E22'
  const stepColor = isEurovision ? '#F10F59' : '#C8F04D'
  const footerBg = isEurovision ? '#1B0744' : '#F5F9F6'
  const footerText = isEurovision ? 'rgba(255,255,255,0.4)' : '#8EA899'

  const thing = isEurovision ? 'country' : 'team'
  const things = isEurovision ? 'countries' : 'teams'
  const drawEmoji = isEurovision ? '🎤' : '🎲'
  const step4 = isEurovision
    ? `When everyone's in — run the draw and assign ${things} ${drawEmoji}`
    : `When everyone's in — run the draw ${drawEmoji}`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your sweepstake is ready</title>
</head>
<body style="margin:0;padding:0;background:${pageBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${pageBg};padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid ${border};overflow:hidden;">
      ${header}

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
          <table cellpadding="0" cellspacing="0" style="width:100%;background:${sectionBg};border-radius:12px;margin-bottom:16px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Self-signup link — share with participants</p>
              <p style="margin:0 0 14px;font-size:13px;color:#1A2E22;word-break:break-all;font-family:monospace;">${joinLink}</p>
              <a href="${joinLink}" style="display:inline-block;background:${accent};color:${accentText};font-weight:700;font-size:13px;text-decoration:none;padding:10px 18px;border-radius:8px;letter-spacing:-0.1px;">
                Preview sign-up page →
              </a>
            </td></tr>
          </table>

          <!-- How it works steps -->
          <table cellpadding="0" cellspacing="0" style="width:100%;background:${sectionBg};border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#1A2E22;text-transform:uppercase;letter-spacing:0.06em;">How participants sign up</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:${stepColor};font-weight:700;margin-right:10px;">1.</span>
                    They click the link above (or you send it via WhatsApp, email, etc.)
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:${stepColor};font-weight:700;margin-right:10px;">2.</span>
                    They enter their name and email — that's it
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:${stepColor};font-weight:700;margin-right:10px;">3.</span>
                    They appear instantly in your dashboard
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;">
                    <span style="color:${stepColor};font-weight:700;margin-right:10px;">4.</span>
                    ${step4}
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <a href="${APP_URL}/dashboard" style="display:block;text-align:center;background:#1A2E22;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            Go to your dashboard →
          </a>

          <p style="margin:20px 0 0;font-size:12px;color:#8EA899;text-align:center;line-height:1.6;">
            Your public leaderboard (for after the draw) is at:<br/>
            <a href="${leaderboardLink}" style="color:#5A7265;">${leaderboardLink}</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:${footerBg};padding:16px 32px;border-top:1px solid ${border};">
          <p style="margin:0;font-size:11px;color:${footerText};text-align:center;">
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
