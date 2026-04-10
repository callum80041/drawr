import { emailHeader, emailHeaderEurovision, spotifyBlock } from './_header'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export function inviteEmailHtml({
  participantName,
  sweepstakeName,
  shareToken,
  isEurovision = false,
}: {
  participantName: string
  sweepstakeName: string
  shareToken: string
  isEurovision?: boolean
}) {
  const link = `${APP_URL}/s/${shareToken}`
  const header = isEurovision ? emailHeaderEurovision : emailHeader
  const pageBg = isEurovision ? '#EEE8FF' : '#F5F9F6'
  const sectionBg = isEurovision ? '#E6DCFF' : '#F5F9F6'
  const border = isEurovision ? '#CFC3F0' : '#E5EDEA'
  const accent = isEurovision ? '#F10F59' : '#C8F04D'
  const accentText = isEurovision ? '#ffffff' : '#1A2E22'
  const promoBg = isEurovision ? '#2A0E5A' : '#F0FAF4'
  const promoText = isEurovision ? 'rgba(255,255,255,0.65)' : '#5A7265'
  const promoLink = isEurovision ? '#ffffff' : '#1A2E22'
  const footerBg = isEurovision ? '#1B0744' : '#F5F9F6'
  const footerText = isEurovision ? 'rgba(255,255,255,0.4)' : '#8EA899'

  const emoji = isEurovision ? '🎤' : '⚽'
  const tagline = isEurovision
    ? 'Once the draw is run, you\'ll be assigned a country — then it\'s fingers crossed until the final vote.'
    : 'Once the draw is run, you\'ll be assigned a team — then it\'s fingers crossed until the final whistle.'
  const signoff = isEurovision
    ? 'No account needed — just bookmark the link above.<br/>May your country serve up three minutes of pure drama.'
    : 'No account needed — just bookmark the link above.<br/>Good luck. You\'re going to need it. Or maybe not. That\'s the beauty of a sweepstake.'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>You've been added to a sweepstake</title>
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
            You're in the sweepstake! ${emoji}
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">
            Hey ${escapeHtml(participantName)}, you've been added to <strong style="color:#1A2E22;">${escapeHtml(sweepstakeName)}</strong>.
            ${tagline}
          </p>

          <table cellpadding="0" cellspacing="0" style="width:100%;background:${sectionBg};border-radius:12px;margin-bottom:20px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Your sweepstake</p>
                <p style="margin:0;font-size:17px;font-weight:700;color:#1A2E22;">${escapeHtml(sweepstakeName)}</p>
              </td>
            </tr>
          </table>

          ${isEurovision ? spotifyBlock : ''}

          <a href="${link}" style="display:block;text-align:center;background:${accent};color:${accentText};font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            View the leaderboard →
          </a>

          <p style="margin:20px 0 0;font-size:12px;color:#8EA899;text-align:center;line-height:1.5;">
            ${signoff}
          </p>
        </td>
      </tr>

      <!-- Create your own promo -->
      <tr>
        <td style="background:${promoBg};padding:16px 32px;border-top:1px solid ${border};text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:${promoText};line-height:1.5;">
            Running your own group? Set up a sweepstake in 3 minutes — free.
          </p>
          <a href="${APP_URL}/signup" style="font-size:12px;font-weight:600;color:${promoLink};text-decoration:none;border-bottom:1px solid ${promoLink};">
            Create your sweepstake at playdrawr.co.uk →
          </a>
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
