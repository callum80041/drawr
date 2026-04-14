/**
 * World Cup 2026 campaign email templates — preview only, no sending.
 *
 * Three lifecycle emails targeting organiser segments:
 *   1. Signed up but no WC sweepstake created yet
 *   2. WC sweepstake created, fewer than 3 participants
 *   3. WC sweepstake with 3–9 participants (push to 10+)
 */

import { emailHeader } from './_header'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

// ── Shared blocks ────────────────────────────────────────────────────────────

const SIGN_OFF = `
  <p style="margin:28px 0 0;font-size:14px;color:#3D5A46;line-height:1.7;">
    Head Coach<br/>
    <strong style="color:#1A2E22;">playdrawr</strong>
  </p>
`


function footer(unsubscribeUrl?: string): string {
  return `
  <tr>
    <td style="background:#F5F9F6;padding:14px 32px;border-top:1px solid #E5EDEA;">
      <p style="margin:0 0 ${unsubscribeUrl ? '6px' : '0'};font-size:11px;color:#8EA899;text-align:center;">
        playdrawr &middot; playdrawr.co.uk &middot; We'll never share your details. No spam, ever.
      </p>
      ${unsubscribeUrl ? `<p style="margin:0;font-size:10px;color:#B8CAC3;text-align:center;"><a href="${esc(unsubscribeUrl)}" style="color:#B8CAC3;">Unsubscribe</a> from these emails.</p>` : ''}
    </td>
  </tr>
`
}

function wrap(bodyContent: string, unsubscribeUrl?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>playdrawr</title>
</head>
<body style="margin:0;padding:0;background:#F5F9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9F6;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #E5EDEA;overflow:hidden;">
      ${emailHeader}
      <tr>
        <td style="padding:32px;">
          ${bodyContent}
        </td>
      </tr>
      ${footer(unsubscribeUrl)}
    </table>
  </td></tr>
</table>
</body>
</html>`
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Email 1: signed up, no WC sweepstake ─────────────────────────────────────

export function campaignNoSweepstakeHtml({
  firstName,
  createSweepstakeLink,
  unsubscribeUrl,
}: {
  firstName: string
  createSweepstakeLink: string
  unsubscribeUrl?: string
}): string {
  return wrap(`
    <p style="margin:0 0 20px;font-size:13px;color:#5A7265;line-height:1.5;">
      Hi ${esc(firstName)},
    </p>

    <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#1A2E22;letter-spacing:-0.2px;line-height:1.4;">
      Start your World Cup sweepstake ⚽
    </p>

    <p style="margin:0 0 16px;font-size:15px;color:#3D5A46;line-height:1.7;">
      You've signed up — now get your World Cup sweepstake set up and ready to share.
    </p>

    <p style="margin:0 0 24px;font-size:15px;color:#3D5A46;line-height:1.7;">
      It only takes a couple of minutes to create your sweepstake, and once it's live you can start inviting people straight away.
    </p>

    <a href="${esc(createSweepstakeLink)}" style="display:block;text-align:center;background:#C8F046;color:#1A2E22;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;margin-bottom:0;">
      Create your sweepstake →
    </a>

    ${SIGN_OFF}
  `, unsubscribeUrl)
}

// ── Email 2: WC sweepstake created, fewer than 3 participants ────────────────

export function campaignLowParticipantsHtml({
  firstName,
  sweepstakeName,
  sweepstakeLink,
  unsubscribeUrl,
}: {
  firstName: string
  sweepstakeName: string
  sweepstakeLink: string
  unsubscribeUrl?: string
}): string {
  return wrap(`
    <p style="margin:0 0 20px;font-size:13px;color:#5A7265;line-height:1.5;">
      Hi ${esc(firstName)},
    </p>

    <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#1A2E22;letter-spacing:-0.2px;line-height:1.4;">
      Your sweepstake link is ready to share ⚽
    </p>

    <p style="margin:0 0 16px;font-size:15px;color:#3D5A46;line-height:1.7;">
      <strong style="color:#1A2E22;">${esc(sweepstakeName)}</strong> is live — now it's time to get a few more people in.
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Share this link with your group</p>
        <p style="margin:0 0 14px;font-size:13px;color:#1A2E22;word-break:break-all;font-family:monospace;">${esc(sweepstakeLink)}</p>
        <a href="${esc(sweepstakeLink)}" style="display:inline-block;background:#C8F046;color:#1A2E22;font-weight:700;font-size:13px;text-decoration:none;padding:10px 18px;border-radius:8px;">
          Share your link →
        </a>
      </td></tr>
    </table>

    <p style="margin:0 0 24px;font-size:15px;color:#3D5A46;line-height:1.7;">
      Email it. Drop it in WhatsApp. Stick it on Instagram. Post it on Facebook. However your group chats, this is the bit that gets your sweepstake moving.
    </p>

    <a href="${esc(sweepstakeLink)}" style="display:block;text-align:center;background:#1A2E22;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;margin-bottom:0;">
      Get sharing →
    </a>

    ${SIGN_OFF}
  `, unsubscribeUrl)
}

// ── Email 3: WC sweepstake with 3–9 participants, push to 10+ ───────────────

export function campaignPushToTenHtml({
  firstName,
  sweepstakeName,
  sweepstakeLink,
  participantCount,
  unsubscribeUrl,
}: {
  firstName: string
  sweepstakeName: string
  sweepstakeLink: string
  participantCount: number
  unsubscribeUrl?: string
}): string {
  return wrap(`
    <p style="margin:0 0 20px;font-size:13px;color:#5A7265;line-height:1.5;">
      Hi ${esc(firstName)},
    </p>

    <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#1A2E22;letter-spacing:-0.2px;line-height:1.4;">
      Get more people into your sweepstake ⚽
    </p>

    <p style="margin:0 0 16px;font-size:15px;color:#3D5A46;line-height:1.7;">
      You've already got <strong style="color:#1A2E22;">${esc(sweepstakeName)}</strong> started — now get it in front of more people.
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Your link</p>
        <p style="margin:0 0 14px;font-size:13px;color:#1A2E22;word-break:break-all;font-family:monospace;">${esc(sweepstakeLink)}</p>
        <a href="${esc(sweepstakeLink)}" style="display:inline-block;background:#C8F046;color:#1A2E22;font-weight:700;font-size:13px;text-decoration:none;padding:10px 18px;border-radius:8px;">
          Get sharing →
        </a>
      </td></tr>
    </table>

    <p style="margin:0 0 24px;font-size:15px;color:#3D5A46;line-height:1.7;">
      So get the link out there. Email it. WhatsApp it. Put it on Instagram. Post it on Facebook. However your people join in, now's the time to give it a push.
    </p>

    <a href="${esc(sweepstakeLink)}" style="display:block;text-align:center;background:#1A2E22;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;margin-bottom:0;">
      Share your link →
    </a>

    ${SIGN_OFF}
  `, unsubscribeUrl)
}
