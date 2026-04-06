import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await sendEmail({
    to: 'headcoach@playdrawr.co.uk',
    subject: `[Contact] ${subject?.trim() || 'Message from playdrawr.co.uk'}`,
    html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#F5F9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9F6;padding:40px 16px;"><tr><td align="center">
<table width="100%" style="max-width:520px;background:#fff;border-radius:16px;border:1px solid #E5EDEA;overflow:hidden;">
  <tr><td style="background:#1A2E22;padding:24px 32px;">
    <p style="margin:0;font-size:18px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Drawr 🎲 — New message</p>
  </td></tr>
  <tr><td style="padding:32px;">
    <table cellpadding="0" cellspacing="0" style="width:100%;background:#F5F9F6;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.08em;">From</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#1A2E22;">${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      </td></tr>
    </table>
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#5A7265;text-transform:uppercase;letter-spacing:0.06em;">Message</p>
    <p style="margin:0;font-size:15px;color:#1A2E22;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
  </td></tr>
  <tr><td style="background:#F5F9F6;padding:14px 32px;border-top:1px solid #E5EDEA;">
    <p style="margin:0;font-size:11px;color:#8EA899;">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`,
    replyTo: email,
  })

  return NextResponse.json({ ok: true })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
