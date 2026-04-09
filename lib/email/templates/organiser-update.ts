const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function organiserUpdateEmailHtml({
  name,
  joinUrl,
  dashboardUrl,
}: {
  name: string
  joinUrl: string | null   // null = no sweepstake yet
  dashboardUrl: string
}) {
  const hasSweepstake = !!joinUrl

  const ctaHref   = hasSweepstake ? joinUrl! : dashboardUrl
  const ctaLabel  = hasSweepstake ? 'Share your join link →' : 'Create your sweepstake →'
  const ctaIntro  = hasSweepstake
    ? `Now's a great time to share your join link with your group so everyone can sign up before the draw:`
    : `If you haven't set one up yet, now's the time — the World Cup is less than two months away and your group will thank you for it.`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Update from Playdrawr</title>
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

          <p style="margin:0 0 20px;font-size:15px;color:#5A7265;line-height:1.6;">
            Hi ${escapeHtml(name)},
          </p>

          <p style="margin:0 0 16px;font-size:15px;color:#5A7265;line-height:1.6;">
            A quick one from the dugout.
          </p>

          <p style="margin:0 0 16px;font-size:15px;color:#5A7265;line-height:1.6;">
            We dropped the ball slightly on our end — there was a bug in the sign-up flow
            that meant some participants couldn't join properly. That's now fixed and
            everything's running smoothly again.
          </p>

          <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">
            We've also unlocked full settings editing, so you've got complete control over
            your sweepstake ahead of kick-off — entry fee, prize type, cover photo, the lot.
          </p>

          <!-- CTA box -->
          <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 14px;font-size:14px;color:#5A7265;line-height:1.6;">
                ${ctaIntro}
              </p>
              <a href="${ctaHref}" style="display:block;text-align:center;background:#C8F04D;color:#1A2E22;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">
                ${ctaLabel}
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 16px;font-size:15px;color:#5A7265;line-height:1.6;">
            Appreciate your patience while we got that sorted. If you need anything at all,
            just reply to this email.
          </p>

          <p style="margin:0 0 4px;font-size:15px;color:#5A7265;line-height:1.6;">
            Back on track — ready for a strong finish. ⚽
          </p>

          <p style="margin:24px 0 0;font-size:15px;color:#5A7265;line-height:1.6;">
            Cheers,<br />
            <strong style="color:#1A2E22;">Callum</strong><br />
            <span style="font-size:13px;">Playdrawr</span>
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#F5F9F6;padding:16px 32px;border-top:1px solid #E5EDEA;">
          <p style="margin:0;font-size:11px;color:#8EA899;text-align:center;">
            Drawr · playdrawr.co.uk · You're receiving this because you signed up to run a sweepstake.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}
