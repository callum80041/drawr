import { emailHeader, emailHeaderEurovision } from './_header'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export function notificationTeamPlayingEmailHtml({
  participantName,
  sweepstakeName,
  shareToken,
  teamName,
  teamFlag,
  kickOffTime,
  unsubscribeUrl,
  isEurovision = false,
}: {
  participantName: string
  sweepstakeName: string
  shareToken: string
  teamName: string
  teamFlag: string | null
  kickOffTime: string
  unsubscribeUrl: string
  isEurovision?: boolean
}) {
  const link = `${APP_URL}/s/${shareToken}`
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
<title>${isEurovision ? teamName : teamName} is performing today</title>
</head>
<body style="margin:0;padding:0;background:${pageBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${pageBg};padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid ${border};overflow:hidden;">
      ${header}

      <!-- Hero section -->
      <tr>
        <td style="background:#1A2E22;padding:0 32px 32px;text-align:center;">
          <div style="font-size:60px;line-height:1;margin-bottom:12px;padding-top:24px;">${teamFlag ?? '🏳️'}</div>
          <p style="margin:0;font-size:24px;font-weight:800;color:#C8F04D;letter-spacing:-0.5px;">
            ${escapeHtml(teamName)}
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A2E22;letter-spacing:-0.3px;">
            ${isEurovision ? '🎤' : '🏟️'} Match day!
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">
            <strong style="color:#1A2E22;">${escapeHtml(teamName)}</strong> ${isEurovision ? 'performs' : 'plays'} today in <strong style="color:#1A2E22;">${escapeHtml(sweepstakeName)}</strong>.
            ${isEurovision ? 'Fingers crossed for a great performance.' : 'Kick off at ' + kickOffTime + '.'}
          </p>

          <table cellpadding="0" cellspacing="0" style="width:100%;background:${sectionBg};border-radius:12px;margin-bottom:24px;">
            <tr>
              <td style="padding:16px 20px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Kick off</p>
                <p style="margin:0;font-size:18px;font-weight:700;color:#1A2E22;">${escapeHtml(kickOffTime)}</p>
              </td>
            </tr>
          </table>

          <a href="${link}" style="display:block;text-align:center;background:${accent};color:${accentText};font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            Follow the action →
          </a>

          <p style="margin:20px 0 0;font-size:12px;color:#8EA899;text-align:center;">
            Check the leaderboard for live updates.
          </p>
        </td>
      </tr>

      <!-- Footer with unsubscribe -->
      <tr>
        <td style="background:${footerBg};padding:16px 32px;border-top:1px solid ${border};text-align:center;">
          <p style="margin:0;font-size:11px;color:${footerText};text-align:center;">
            <a href="${unsubscribeUrl}" style="color:${footerText};text-decoration:underline;">
              Stop notifications
            </a>
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
