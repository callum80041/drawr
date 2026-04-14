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

const PRIZE_BOX = `
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#FAFFF0;border:1.5px solid #C8F046;border-radius:12px;margin-bottom:28px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:800;color:#1A2E22;text-transform:uppercase;letter-spacing:0.1em;">🏆 Prize draw</p>
      <p style="margin:0 0 10px;font-size:14px;color:#3D5A46;line-height:1.65;">
        Any World Cup sweepstake with <strong style="color:#1A2E22;">10 or more participants by 30&nbsp;April&nbsp;2026</strong> is entered into a random draw to win a <strong style="color:#1A2E22;">£50 Uber Eats voucher</strong> for the organiser.
      </p>
      <p style="margin:0 0 10px;font-size:14px;color:#3D5A46;line-height:1.65;">
        There's also a separate draw for participants — one will win a <strong style="color:#1A2E22;">£25 Uber Eats voucher</strong>. They need to join using their email address to be eligible.
      </p>
      <p style="margin:0;font-size:11px;color:#8EA899;line-height:1.5;">
        Winners selected at random. Vouchers sent on 17&nbsp;June&nbsp;2026, ahead of England&nbsp;v&nbsp;Croatia.
      </p>
    </td></tr>
  </table>
`

const SIGN_OFF = `
  <p style="margin:28px 0 0;font-size:14px;color:#3D5A46;line-height:1.7;">
    Head Coach<br/>
    <strong style="color:#1A2E22;">playdrawr</strong>
  </p>
`

const TERMS_BLOCK = `
  <tr>
    <td style="padding:20px 32px;border-top:1px solid #E5EDEA;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#8EA899;text-transform:uppercase;letter-spacing:0.08em;">Competition terms</p>
      <p style="margin:0;font-size:10px;color:#A8BDB5;line-height:1.7;">
        Offer applies to World Cup sweepstakes only. To qualify for the organiser draw, your sweepstake must have 10 or more participants by 11:59pm on 30 April 2026. One organiser will be selected at random to win a £50 Uber Eats voucher. One participant will be selected at random to win a £25 Uber Eats voucher. Participants must register using their email address to be entered into the participant draw. One entry per qualifying organiser and one entry per qualifying participant. Winners will be contacted and vouchers sent on 17 June 2026.
      </p>
    </td>
  </tr>
`

const FOOTER = `
  <tr>
    <td style="background:#F5F9F6;padding:14px 32px;border-top:1px solid #E5EDEA;">
      <p style="margin:0;font-size:11px;color:#8EA899;text-align:center;">
        playdrawr &middot; playdrawr.co.uk &middot; We'll never share your details. No spam, ever.
      </p>
    </td>
  </tr>
`

function wrap(bodyContent: string): string {
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
      ${TERMS_BLOCK}
      ${FOOTER}
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
}: {
  firstName: string
  createSweepstakeLink: string
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

    <a href="${esc(createSweepstakeLink)}" style="display:block;text-align:center;background:#C8F046;color:#1A2E22;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;margin-bottom:28px;">
      Create your sweepstake →
    </a>

    <p style="margin:0 0 20px;font-size:15px;color:#3D5A46;line-height:1.7;">
      There's also something in it for getting started early.
    </p>

    ${PRIZE_BOX}

    <a href="${esc(createSweepstakeLink)}" style="display:block;text-align:center;background:#1A2E22;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;margin-bottom:0;">
      Create your sweepstake and start sharing →
    </a>

    ${SIGN_OFF}
  `)
}

// ── Email 2: WC sweepstake created, fewer than 3 participants ────────────────

export function campaignLowParticipantsHtml({
  firstName,
  sweepstakeName,
  sweepstakeLink,
}: {
  firstName: string
  sweepstakeName: string
  sweepstakeLink: string
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

    <p style="margin:0 0 20px;font-size:15px;color:#3D5A46;line-height:1.7;">
      And there's a bonus for getting it out there.
    </p>

    ${PRIZE_BOX}

    <a href="${esc(sweepstakeLink)}" style="display:block;text-align:center;background:#1A2E22;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;margin-bottom:0;">
      Get sharing →
    </a>

    ${SIGN_OFF}
  `)
}

// ── Email 3: WC sweepstake with 3–9 participants, push to 10+ ───────────────

export function campaignPushToTenHtml({
  firstName,
  sweepstakeName,
  sweepstakeLink,
  participantCount,
}: {
  firstName: string
  sweepstakeName: string
  sweepstakeLink: string
  participantCount: number
}): string {
  const remaining = Math.max(10 - participantCount, 0)

  return wrap(`
    <p style="margin:0 0 20px;font-size:13px;color:#5A7265;line-height:1.5;">
      Hi ${esc(firstName)},
    </p>

    <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#1A2E22;letter-spacing:-0.2px;line-height:1.4;">
      Get your sweepstake to 10 players by 30 April ⚽
    </p>

    <p style="margin:0 0 16px;font-size:15px;color:#3D5A46;line-height:1.7;">
      You've already got <strong style="color:#1A2E22;">${esc(sweepstakeName)}</strong> started — now get it in front of more people.
    </p>

    ${remaining > 0 ? `
    <p style="margin:0 0 16px;font-size:15px;color:#3D5A46;line-height:1.7;">
      You're at <strong style="color:#1A2E22;">${participantCount} participant${participantCount === 1 ? '' : 's'}</strong> — just ${remaining} more to qualify for the prize draw.
    </p>` : ''}

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

    ${PRIZE_BOX}

    <a href="${esc(sweepstakeLink)}" style="display:block;text-align:center;background:#1A2E22;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;margin-bottom:0;">
      Share your link →
    </a>

    ${SIGN_OFF}
  `)
}
