import { emailHeader } from './_header'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

export function setupGuideEmailHtml({ name }: { name?: string } = {}) {
  const loginLink = `${APP_URL}/login`
  const dashboardLink = `${APP_URL}/dashboard`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>How to set up your World Cup sweepstake</title>
</head>
<body style="margin:0;padding:0;background:#F4F7F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7F2;padding:40px 16px;">
<tr><td align="center">

<table width="100%" style="max-width:600px;background:#fff;border-radius:16px;border:1px solid #E5EDEA;overflow:hidden;">

  ${emailHeader}

  <!-- Countdown Banner -->
  <tr><td style="background:linear-gradient(135deg, #0B3D2E 0%, #1A6B47 100%);padding:32px;text-align:center;">
    <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#C8F046;">World Cup 2026 Kicks Off</p>
    <p style="margin:0;font-size:48px;font-weight:900;color:#ffffff;line-height:1;letter-spacing:-2px;">11 June 2026</p>
    <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.7);font-weight:600;">Don't miss the draw — set up your sweepstake now ⚽</p>
  </td></tr>

  <!-- Intro -->
  <tr><td style="padding:40px 32px 32px;">
    <h1 style="margin:0 0 16px;font-size:32px;font-weight:900;color:#0B3D2E;line-height:1.2;letter-spacing:-1px;">How to set up your World Cup sweepstake</h1>
    <p style="margin:0 0 24px;font-size:16px;color:#4A7C62;line-height:1.6;">Follow these 5 steps to run a fair draw, share one link, and let the leaderboard run itself. Takes about 3 minutes.</p>
  </td></tr>

  <!-- Step 1 -->
  <tr><td style="padding:0 32px 32px;">
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <tr>
      <td style="vertical-align:top;padding-right:16px;">
        <div style="width:48px;height:48px;border-radius:12px;background:#C8F046;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="font-size:24px;font-weight:900;color:#0B3D2E;">1</span>
        </div>
      </td>
      <td style="vertical-align:top;">
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0B3D2E;">Create your sweepstake</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#4A7C62;line-height:1.6;">Click <strong>New sweepstake</strong> from the dashboard and fill in:</p>
        <ul style="margin:0 0 0 20px;padding:0;font-size:15px;color:#4A7C62;line-height:1.8;">
          <li><strong style="color:#0B3D2E;">Name</strong> — e.g. "Office World Cup 2026"</li>
          <li><strong style="color:#0B3D2E;">Currency</strong> — defaults to GBP</li>
          <li><strong style="color:#0B3D2E;">Entry fee</strong> — optional. Set this if people are paying in. You collect it directly — playdrawr never handles money.</li>
          <li><strong style="color:#0B3D2E;">What are you playing for?</strong> — Money pot or physical prizes</li>
          <li><strong style="color:#0B3D2E;">Team assignment</strong> — Random draw (recommended), auto-assign, or manual</li>
        </ul>
        <p style="margin:12px 0 0;font-size:15px;color:#4A7C62;line-height:1.6;">Click <strong>Create sweepstake</strong>.</p>
      </td>
    </tr>
    </table>
  </td></tr>

  <!-- Step 2 -->
  <tr><td style="padding:0 32px 32px;">
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <tr>
      <td style="vertical-align:top;padding-right:16px;">
        <div style="width:48px;height:48px;border-radius:12px;background:#C8F046;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="font-size:24px;font-weight:900;color:#0B3D2E;">2</span>
        </div>
      </td>
      <td style="vertical-align:top;">
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0B3D2E;">Configure prizes (optional)</h2>
        <p style="margin:0;font-size:15px;color:#4A7C62;line-height:1.6;">In <strong>Settings → Prizes</strong>, toggle on any prize categories and set a pot amount for each. Categories include 1st/2nd/3rd place, Wooden Spoon, Golden Boot, Most Cards, and more.</p>
      </td>
    </tr>
    </table>
  </td></tr>

  <!-- Step 3 -->
  <tr><td style="padding:0 32px 32px;">
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <tr>
      <td style="vertical-align:top;padding-right:16px;">
        <div style="width:48px;height:48px;border-radius:12px;background:#C8F046;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="font-size:24px;font-weight:900;color:#0B3D2E;">3</span>
        </div>
      </td>
      <td style="vertical-align:top;">
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0B3D2E;">Get people in</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#4A7C62;line-height:1.6;">From the dashboard, copy your sign-up link and share it (WhatsApp, email, Slack — whatever works). Participants click the link, enter their name and optionally their email, and they're in.</p>
        <p style="margin:0 0 12px;font-size:15px;color:#4A7C62;line-height:1.6;">You can also add participants manually from the <strong>Participants</strong> tab.</p>
        <p style="margin:0;font-size:14px;color:#8EA899;line-height:1.5;padding:12px;background:#F4F7F2;border-radius:8px;">💡 The free plan supports up to 48 participants.</p>
      </td>
    </tr>
    </table>
  </td></tr>

  <!-- Step 4 -->
  <tr><td style="padding:0 32px 32px;">
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <tr>
      <td style="vertical-align:top;padding-right:16px;">
        <div style="width:48px;height:48px;border-radius:12px;background:#C8F046;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="font-size:24px;font-weight:900;color:#0B3D2E;">4</span>
        </div>
      </td>
      <td style="vertical-align:top;">
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0B3D2E;">Run the draw</h2>
        <p style="margin:0;font-size:15px;color:#4A7C62;line-height:1.6;">Once everyone has joined, go to the <strong>Draw</strong> tab and click <strong>Run draw</strong>. Teams are assigned randomly (or per your assignment mode). Everyone who provided an email gets their team sent to them automatically.</p>
      </td>
    </tr>
    </table>
  </td></tr>

  <!-- Step 5 -->
  <tr><td style="padding:0 32px 32px;">
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <tr>
      <td style="vertical-align:top;padding-right:16px;">
        <div style="width:48px;height:48px;border-radius:12px;background:#C8F046;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="font-size:24px;font-weight:900;color:#0B3D2E;">5</span>
        </div>
      </td>
      <td style="vertical-align:top;">
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0B3D2E;">Track the leaderboard</h2>
        <p style="margin:0;font-size:15px;color:#4A7C62;line-height:1.6;">Share the leaderboard link — it's public, no login needed. Scores update automatically as matches are played.</p>
      </td>
    </tr>
    </table>
  </td></tr>

  <!-- Tips Section -->
  <tr><td style="padding:0 32px 32px;">
    <div style="background:#F4F7F2;border-left:4px solid #C8F046;padding:20px;border-radius:0 8px 8px 0;">
      <h3 style="margin:0 0 12px;font-size:18px;font-weight:900;color:#0B3D2E;">💡 Tips</h3>
      <ul style="margin:0 0 0 20px;padding:0;font-size:15px;color:#4A7C62;line-height:1.8;">
        <li>You can mark participants as paid from the Participants tab to track who's settled up.</li>
        <li>If someone drops out before the draw, you can remove them and their team slot goes back into the pool.</li>
        <li>The Draw tab shows a preview of how teams will be distributed before you commit.</li>
      </ul>
    </div>
  </td></tr>

  <!-- CTA Button -->
  <tr><td style="padding:0 32px 40px;text-align:center;">
    <a href="${loginLink}" style="display:inline-block;background:#C8F046;color:#0B3D2E;font-weight:900;font-size:18px;text-decoration:none;padding:16px 40px;border-radius:12px;letter-spacing:-0.5px;box-shadow:0 4px 16px rgba(200,240,70,0.4);">Start your sweepstake now →</a>
    <p style="margin:16px 0 0;font-size:13px;color:#8EA899;">Free forever · No credit card · Set up in 3 minutes</p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F4F7F2;padding:24px 32px;border-top:1px solid #E5EDEA;">
    <p style="margin:0 0 8px;font-size:12px;color:#8EA899;text-align:center;line-height:1.5;">
      <strong style="color:#1A6B47;">playdrawr</strong> · World Cup 2026 sweepstakes made simple
    </p>
    <p style="margin:0;font-size:11px;color:#8EA899;text-align:center;">
      We'll never share your details. No spam, ever. · <a href="${APP_URL}" style="color:#1A6B47;text-decoration:none;">playdrawr.co.uk</a>
    </p>
  </td></tr>

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
