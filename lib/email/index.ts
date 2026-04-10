import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  template,
}: {
  to: string
  subject: string
  html: string
  replyTo?: string
  template?: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM_EMAIL ?? 'headcoach@playdrawr.co.uk'
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    ...(replyTo ? { reply_to: replyTo } : {}),
  })
  if (error) throw new Error(error.message)

  // Fire-and-forget log — don't let logging failures block email delivery
  try {
    const supabase = await createServiceClient()
    await supabase.from('email_log').insert({
      to_email:  to,
      subject,
      template:  template ?? null,
      resend_id: data?.id ?? null,
    })
  } catch {
    // Silently ignore logging errors
  }

  return data
}
