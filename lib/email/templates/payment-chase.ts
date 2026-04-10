import { emailHeader, emailHeaderEurovision } from './_header'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export function paymentChaseEmailHtml({
  participantName,
  sweepstakeName,
  organiserName,
  entryFee,
  shareToken,
  isEurovision = false,
}: {
  participantName: string
  sweepstakeName: string
  organiserName: string
  entryFee: number
  shareToken: string
  isEurovision?: boolean
}) {
  const link = `${APP_URL}/s/${shareToken}`
  const amount = entryFee > 0 ? `£${entryFee.toFixed(2)}` : null
  const header = isEurovision ? emailHeaderEurovision : emailHeader
  const pageBg = isEurovision ? '#EEE8FF' : '#F5F9F6'
  const sectionBg = isEurovision ? '#E6DCFF' : '#F5F9F6'
  const border = isEurovision ? '#CFC3F0' : '#E5EDEA'
  const accent = isEurovision ? '#F10F59' : '#C8F04D'
  const accentText = isEurovision ? '#ffffff' : '#1A2E22'
  const footerBg = isEurovision ? '#1B0744' : '#F5F9F6'
  const footerText = isEurovision ? 'rgba(255,255,255,0.4)' : '#8EA899'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Quick reminder about your sweepstake entry</title>
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
            Hey ${escapeHtml(participantName)} — friendly nudge 👀
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">
            You're in <strong style="color:#1A2E22;">${escapeHtml(sweepstakeName)}</strong> but ${escapeHtml(organiserName)}
            is still waiting on your entry fee. Don't be the one holding up the draw.
          </p>

          ${amount ? `
          <table cellpadding="0" cellspacing="0" style="width:100%;background:${sectionBg};border-radius:12px;margin-bottom:24px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Amount owed</p>
                <p style="margin:0;font-size:28px;font-weight:800;color:#1A2E22;letter-spacing:-0.5px;">${amount}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#5A7265;">Pay ${escapeHtml(organiserName)} directly.</p>
              </td>
            </tr>
          </table>
          ` : `
          <table cellpadding="0" cellspacing="0" style="width:100%;background:${sectionBg};border-radius:12px;margin-bottom:24px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Your sweepstake</p>
                <p style="margin:0;font-size:17px;font-weight:700;color:#1A2E22;">${escapeHtml(sweepstakeName)}</p>
              </td>
            </tr>
          </table>
          `}

          <a href="${link}" style="display:block;text-align:center;background:${accent};color:${accentText};font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            View the leaderboard →
          </a>

          <p style="margin:20px 0 0;font-size:12px;color:#8EA899;text-align:center;line-height:1.5;">
            Settle up and you can stop getting these emails. Simple.<br/>
            If you think this has been sent in error, reply and let us know.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:${footerBg};padding:16px 32px;border-top:1px solid ${border};">
          <p style="margin:0;font-size:11px;color:${footerText};text-align:center;">
            Drawr · playdrawr.co.uk · Sent on behalf of ${escapeHtml(organiserName)}.
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
