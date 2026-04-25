import { emailHeaderEurovision, spotifyBlock } from './_header'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

interface CountryAssignment {
  name: string
  flag: string | null
  semi_final: number | null  // 1, 2, or null (auto-qualified)
}

export function drawCompleteEurovisionEmailHtml({
  participantName,
  sweepstakeName,
  shareToken,
  countries,
  isPro = false,
  logoUrl = null,
}: {
  participantName: string
  sweepstakeName: string
  shareToken: string
  countries: CountryAssignment[]
  isPro?: boolean
  logoUrl?: string | null
}) {
  const link = `${APP_URL}/s/${shareToken}`
  const primary = countries[0]

  const semiLabel = (sf: number | null) =>
    sf === 1 ? 'Semi-Final 1' : sf === 2 ? 'Semi-Final 2' : 'Auto-qualified ✨'

  const countryRows = countries.map(c => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #CFC3F0;">
        <span style="font-size:22px;margin-right:10px;">${c.flag ?? '🏳️'}</span>
        <span style="font-size:15px;font-weight:700;color:#1A2E22;">${escapeHtml(c.name)}</span>
        <span style="font-size:12px;color:#8EA899;margin-left:8px;">${semiLabel(c.semi_final)}</span>
      </td>
    </tr>`
  ).join('')

  const heroFlag = primary?.flag ?? '🎤'
  const autoQualified = primary?.semi_final === null

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your country has been drawn!</title>
</head>
<body style="margin:0;padding:0;background:#EEE8FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEE8FF;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid #CFC3F0;overflow:hidden;">
      ${emailHeaderEurovision}

      <!-- Organiser logo -->
      ${logoUrl ? `
      <tr>
        <td style="padding:16px 32px 0;text-align:center;">
          <img src="${logoUrl}" alt="Logo" style="max-height:48px;max-width:200px;height:auto;width:auto;" />
        </td>
      </tr>` : ''}

      <!-- Hero country -->
      <tr>
        <td style="background:#040241;padding:0 32px 32px;text-align:center;">
          <div style="font-size:80px;line-height:1;margin-bottom:12px;padding-top:24px;">${heroFlag}</div>
          <p style="margin:0;font-size:24px;font-weight:800;color:#F10F59;letter-spacing:-0.5px;">
            ${primary ? escapeHtml(primary.name) : 'Draw complete'}
          </p>
          ${primary ? `<p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">${semiLabel(primary.semi_final)}</p>` : ''}
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A2E22;letter-spacing:-0.3px;">
            The draw is done, ${escapeHtml(participantName)}! 🎤
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">
            Countries have been drawn for <strong style="color:#1A2E22;">${escapeHtml(sweepstakeName)}</strong>.
            ${countries.length === 1
              ? `You've got <strong style="color:#1A2E22;">${escapeHtml(primary!.name)}</strong>.${autoQualified ? " Great news — they're already through to the Grand Final." : " Fingers crossed for the semi-final."}`
              : `You've got <strong style="color:#1A2E22;">${countries.length} countries</strong>. You're practically a Eurovision bloc.`
            }
          </p>

          ${countries.length > 1 ? `
          <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #CFC3F0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
            <tr>
              <td style="background:#E6DCFF;padding:10px 16px;border-bottom:1px solid #CFC3F0;">
                <p style="margin:0;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Your countries</p>
              </td>
            </tr>
            ${countryRows}
          </table>` : ''}

          ${spotifyBlock}

          <!-- Scoring reminder -->
          <table cellpadding="0" cellspacing="0" style="width:100%;background:#E6DCFF;border-radius:12px;margin-bottom:24px;">
            <tr>
              <td style="padding:16px 20px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">How scoring works</p>
                <p style="margin:0 0 4px;font-size:13px;color:#1A2E22;">🏁 <strong>Reaches Grand Final:</strong> 10 pts</p>
                <p style="margin:0 0 4px;font-size:13px;color:#1A2E22;">🥉 <strong>Top 3 in the Final:</strong> +20 pts</p>
                <p style="margin:0 0 4px;font-size:13px;color:#1A2E22;">🥇 <strong>Wins Eurovision:</strong> +50 pts</p>
                <p style="margin:0;font-size:12px;color:#8EA899;margin-top:8px;">Max possible: 60 points. Nul points: also possible.</p>
              </td>
            </tr>
          </table>

          <a href="${link}" style="display:block;text-align:center;background:#F10F59;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            View the leaderboard →
          </a>

          <p style="margin:20px 0 0;font-size:12px;color:#8EA899;text-align:center;line-height:1.5;">
            No account needed — just bookmark the link above.<br/>
            May your country serve up three minutes of pure drama.
          </p>

          ${!isPro ? `
          <p style="margin:16px 0 0;font-size:11px;color:#8EA899;text-align:center;">
            Powered by <a href="${APP_URL}" style="color:#8EA899;text-decoration:none;font-weight:600;border-bottom:1px solid #8EA899;">playdrawr</a>
          </p>` : ''}
        </td>
      </tr>

      <!-- Create your own promo -->
      <tr>
        <td style="background:#2A0E5A;padding:16px 32px;border-top:1px solid #CFC3F0;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.5;">
            Running your own group? Set up a sweepstake in 3 minutes — free.
          </p>
          <a href="${APP_URL}/signup" style="font-size:12px;font-weight:600;color:#ffffff;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.5);">
            Create your sweepstake at playdrawr.co.uk →
          </a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#1B0744;padding:16px 32px;border-top:1px solid #CFC3F0;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);text-align:center;">
            playdrawr · playdrawr.co.uk · We will never share your details with anyone. No spam, ever.
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
