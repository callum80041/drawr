/**
 * Sends a sample of every email template to a test address.
 * Usage: node scripts/send-sample-emails.mjs
 */

import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = join(__dirname, '..')

// Load .env.local manually
const envFile = join(root, '.env.local')
const env = readFileSync(envFile, 'utf8')
for (const line of env.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const key = trimmed.slice(0, eq).trim()
  const val = trimmed.slice(eq + 1).trim()
  process.env[key] = val
}

const { Resend } = await import('/Users/callum/Documents/Drawr/node_modules/resend/dist/index.mjs')

const resend   = new Resend(process.env.RESEND_API_KEY)
const FROM     = process.env.RESEND_FROM_EMAIL ?? 'headcoach@playdrawr.co.uk'
const TO       = 'callum8004+drawr@gmail.com'
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'

function escape(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ── Templates (inline so no TS transpile needed) ──────────────────────────────

function welcomeHtml({ name }) {
  const dashboardLink = `${APP_URL}/dashboard`
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Welcome to Drawr</title></head>
<body style="margin:0;padding:0;background:#F5F9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9F6;padding:40px 16px;"><tr><td align="center">
<table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid #E5EDEA;overflow:hidden;">
  <tr><td style="background:#1A2E22;padding:28px 32px;">
    <p style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Drawr 🎲</p>
    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">World Cup 2026 Sweepstakes</p>
  </td></tr>
  <tr><td style="padding:32px;">
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A2E22;letter-spacing:-0.3px;">Welcome to Drawr, ${escape(name)}! ⚽</p>
    <p style="margin:0 0 20px;font-size:15px;color:#5A7265;line-height:1.6;">You're all set to run your World Cup 2026 sweepstake. Add your participants, set an entry fee if you want, and when you're ready — hit the draw button and watch the chaos unfold.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:24px;"><tr><td style="padding:20px 24px;">
      <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#1A2E22;text-transform:uppercase;letter-spacing:0.06em;">What happens next</p>
      <table cellpadding="0" cellspacing="0">
        <tr><td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;"><span style="color:#C8F04D;font-weight:700;margin-right:10px;">1.</span>Add your participants and their email addresses</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;"><span style="color:#C8F04D;font-weight:700;margin-right:10px;">2.</span>Run the draw — teams are assigned randomly, one by one</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;"><span style="color:#C8F04D;font-weight:700;margin-right:10px;">3.</span>Everyone gets their team emailed to them automatically</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#5A7265;line-height:1.5;"><span style="color:#C8F04D;font-weight:700;margin-right:10px;">4.</span>Sit back. Watch the tournament. Collect the prize pot.</td></tr>
      </table>
    </td></tr></table>
    <a href="${dashboardLink}" style="display:block;text-align:center;background:#C8F04D;color:#1A2E22;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">Go to your dashboard →</a>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:24px;background:#F5F9F6;border-radius:10px;"><tr><td style="padding:16px 20px;">
      <p style="margin:0;font-size:13px;color:#5A7265;line-height:1.6;"><strong style="color:#1A2E22;">One more thing —</strong> we're not going to clog up your inbox. We'll only ever drop you a line when there's actually something worth knowing: a leaderboard shake-up after matchday, or your sweepstake reaching a big moment. No newsletters. No "just checking in." Just football. ⚽</p>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#F5F9F6;padding:16px 32px;border-top:1px solid #E5EDEA;">
    <p style="margin:0;font-size:11px;color:#8EA899;text-align:center;">Drawr · playdrawr.co.uk · We will never share your details with anyone. No spam, ever.</p>
  </td></tr>
</table></td></tr></table></body></html>`
}

function inviteHtml({ participantName, sweepstakeName, shareToken }) {
  const link = `${APP_URL}/s/${shareToken}`
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>You've been added to a sweepstake</title></head>
<body style="margin:0;padding:0;background:#F5F9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9F6;padding:40px 16px;"><tr><td align="center">
<table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid #E5EDEA;overflow:hidden;">
  <tr><td style="background:#1A2E22;padding:28px 32px;">
    <p style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Drawr 🎲</p>
    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">World Cup 2026 Sweepstakes</p>
  </td></tr>
  <tr><td style="padding:32px;">
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A2E22;letter-spacing:-0.3px;">You're in the sweepstake! ⚽</p>
    <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">Hey ${escape(participantName)}, you've been added to <strong style="color:#1A2E22;">${escape(sweepstakeName)}</strong>. Once the draw is run, you'll be assigned a team — then it's fingers crossed until the final whistle.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:24px;"><tr><td style="padding:20px 24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Your sweepstake</p>
      <p style="margin:0;font-size:17px;font-weight:700;color:#1A2E22;">${escape(sweepstakeName)}</p>
    </td></tr></table>
    <a href="${link}" style="display:block;text-align:center;background:#C8F04D;color:#1A2E22;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">View the leaderboard →</a>
    <p style="margin:20px 0 0;font-size:12px;color:#8EA899;text-align:center;line-height:1.5;">No account needed — just bookmark the link above.<br/>Good luck. You're going to need it. Or maybe not. That's the beauty of a sweepstake.</p>
  </td></tr>
  <tr><td style="background:#F5F9F6;padding:16px 32px;border-top:1px solid #E5EDEA;">
    <p style="margin:0;font-size:11px;color:#8EA899;text-align:center;">Drawr · playdrawr.co.uk · We will never share your details with anyone. No spam, ever.</p>
  </td></tr>
</table></td></tr></table></body></html>`
}

function drawCompleteHtml({ participantName, sweepstakeName, shareToken, teams }) {
  const link = `${APP_URL}/s/${shareToken}`
  const primary = teams[0]
  const teamRows = teams.map(t =>
    `<tr><td style="padding:10px 16px;border-bottom:1px solid #E5EDEA;">
      <span style="font-size:22px;margin-right:10px;">${t.flag ?? '🏳️'}</span>
      <span style="font-size:15px;font-weight:700;color:#1A2E22;">${escape(t.name)}</span>
      ${t.group ? `<span style="font-size:12px;color:#8EA899;margin-left:8px;">${escape(t.group)}</span>` : ''}
    </td></tr>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Your team has been drawn!</title></head>
<body style="margin:0;padding:0;background:#F5F9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9F6;padding:40px 16px;"><tr><td align="center">
<table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid #E5EDEA;overflow:hidden;">
  <tr><td style="background:#1A2E22;padding:28px 32px;">
    <p style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Drawr 🎲</p>
    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">World Cup 2026 Sweepstakes</p>
  </td></tr>
  <tr><td style="background:#1A2E22;padding:0 32px 32px;text-align:center;">
    <div style="font-size:80px;line-height:1;margin-bottom:12px;">${primary?.flag ?? '🏳️'}</div>
    <p style="margin:0;font-size:24px;font-weight:800;color:#C8F04D;letter-spacing:-0.5px;">${primary ? escape(primary.name) : 'Draw complete'}</p>
    ${primary?.group ? `<p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">${escape(primary.group)}</p>` : ''}
  </td></tr>
  <tr><td style="padding:32px;">
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A2E22;letter-spacing:-0.3px;">The draw is done, ${escape(participantName)}!</p>
    <p style="margin:0 0 24px;font-size:15px;color:#5A7265;line-height:1.6;">The teams have been drawn for <strong style="color:#1A2E22;">${escape(sweepstakeName)}</strong>. ${teams.length === 1 ? `You drew <strong style="color:#1A2E22;">${escape(primary.name)}</strong>. May they go all the way. Or at least win a few games.` : `You drew <strong style="color:#1A2E22;">${teams.length} teams</strong>. You're basically running a one-person squad.`}</p>
    ${teams.length > 1 ? `
    <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #E5EDEA;border-radius:12px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="background:#F5F9F6;padding:10px 16px;border-bottom:1px solid #E5EDEA;"><p style="margin:0;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">Your teams</p></td></tr>
      ${teamRows}
    </table>` : ''}
    <a href="${link}" style="display:block;text-align:center;background:#C8F04D;color:#1A2E22;font-weight:700;font-size:15px;text-decoration:none;padding:14px 24px;border-radius:12px;letter-spacing:-0.2px;">View the leaderboard →</a>
    <p style="margin:20px 0 0;font-size:12px;color:#8EA899;text-align:center;line-height:1.5;">Points accumulate as your team progresses through the tournament.<br/>No refunds if your team exits in the group stage. You knew the risks.</p>
  </td></tr>
  <tr><td style="background:#F5F9F6;padding:16px 32px;border-top:1px solid #E5EDEA;">
    <p style="margin:0;font-size:11px;color:#8EA899;text-align:center;">Drawr · playdrawr.co.uk · We will never share your details with anyone. No spam, ever.</p>
  </td></tr>
</table></td></tr></table></body></html>`
}

// ── Send ──────────────────────────────────────────────────────────────────────

const emails = [
  {
    subject: '[Sample] Welcome to Drawr',
    html: welcomeHtml({ name: 'Callum' }),
  },
  {
    subject: "[Sample] You've been added to Office World Cup 2026",
    html: inviteHtml({
      participantName: 'Callum',
      sweepstakeName: 'Office World Cup 2026',
      shareToken: 'demo2026',
    }),
  },
  {
    subject: '[Sample] Your team for Office World Cup 2026 has been drawn!',
    html: drawCompleteHtml({
      participantName: 'Callum',
      sweepstakeName: 'Office World Cup 2026',
      shareToken: 'demo2026',
      teams: [
        { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'Group F' },
      ],
    }),
  },
  {
    subject: '[Sample — multi team] Your teams for Office World Cup 2026 have been drawn!',
    html: drawCompleteHtml({
      participantName: 'Callum',
      sweepstakeName: 'Office World Cup 2026',
      shareToken: 'demo2026',
      teams: [
        { name: 'Brazil', flag: '🇧🇷', group: 'Group E' },
        { name: 'Morocco', flag: '🇲🇦', group: 'Group A' },
      ],
    }),
  },
]

console.log(`Sending ${emails.length} sample emails to ${TO}…\n`)

for (const email of emails) {
  process.stdout.write(`  → ${email.subject} … `)
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: email.subject,
    html: email.html,
  })
  if (error) {
    console.log(`FAILED: ${error.message}`)
  } else {
    console.log(`sent (id: ${data.id})`)
  }
}

console.log('\nDone.')
