import { Resend } from 'resend'

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string
  subject: string
  html: string
  replyTo?: string
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
  return data
}
