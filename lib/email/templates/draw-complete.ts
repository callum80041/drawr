import { emailHeader } from './_header'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

interface TeamAssignment {
  name: string
  flag: string | null
  group_name: string | null
}

export function drawCompleteEmailHtml({
  participantName,
  sweepstakeName,
  shareToken,
  teams,
}: {
  participantName: string
  sweepstakeName: string
  shareToken: string
  teams: TeamAssignment[]
}) {
  const link = `${APP_URL}/s/${shareToken}`
  const primaryTeam = teams[0]

  const teamRows = teams.map(t => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #E5EDEA;">
        <span style="font-size:22px;margin-right:10px;">${t.flag ?? '🏳️'}</span>
        <span style="font-size:15px;font-weight:700;color:#1A2E22;">${escapeHtml(t.name)}</span>
        ${t.group_name ? `<span style="font-size:12px;color:#8EA899;margin-left:8px;">${escapeHtml(t.group_name)}</span>` : ''}
      </td>
    </tr>`
  ).join('')

  const heroFlag = primaryTeam?.flag ?? '🏳️'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your team has been drawn!</title>
</head>
<body style="margin:0;padding:0;background:#F5F9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9F6;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid #E5EDEA;overflow:hidden;">
      \${emailHeader}

      <!-- Hero flag -->
      <tr>
        <td style="background:#1A2E22;padding:0 32px 32px;text-align:center;">
          <div style="font-size:80px;line-height:1;margin-bottom:12px;">${heroFlag}</div>
          <p style="margin:0;font-size:24px;font-weight:800;color:#C8F04D;letter-spacing:-0.5px;">
            ${primaryTeam ? escapeHtml(primaryTeam.name) : 'Draw complete'}
          </p>
          ${primaryTeam?.group_name ? `<p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">${escapeHtml(primaryTeam.group_name)}</p>` : ''}
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A2E22;letter-spacing:-0.3px;">
            The draw is done, ${escapeHtml(participantName)}!
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">
            The teams have been drawn for <strong style="color:#1A2E22;">${escapeHtml(sweepstakeName)}</strong>.
            ${teams.length === 1
              ? `You drew <strong style="color:#1A2E22;">${escapeHtml(primaryTeam!.name)}</strong>. May they go all the way. Or at least win a few games.`
              : `You drew <strong style="color:#1A2E22;">${teams.length} teams</strong>. You're basically running a one-person squad.`
            }
          </p>

          ${teams.length > 1 ? `
          <!-- Team list (multi-team) -->
          <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #E5EDEA;border-radius:12px;overflow:hidden;margin-bottom:24px;">
            <tr>
              <td style="background:#F5F9F6;padding:10px 16px;border-bottom:1px solid #E5EDEA;">
                <p style="margin:0;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Your teams</p>
              </td>
            </tr>
            ${teamRows}
          </table>` : ''}

          <a href="${link}" style="display:block;text-align:center;background:#C8F04D;color:#1A2E22;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
            View the leaderboard →
          </a>

          <p style="margin:20px 0 0;font-size:12px;color:#8EA899;text-align:center;line-height:1.5;">
            Points accumulate as your team progresses through the tournament.<br/>
            No refunds if your team exits in the group stage. You knew the risks.
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
