import crypto from 'crypto'

export function generateUnsubscribeToken(participantId: string): string {
  const secret = process.env.RESEND_API_KEY
  if (!secret) throw new Error('RESEND_API_KEY not configured')
  return crypto.createHmac('sha256', secret).update(participantId).digest('hex')
}

export function buildUnsubscribeUrl(participantId: string, appUrl: string): string {
  const token = generateUnsubscribeToken(participantId)
  return `${appUrl}/unsubscribe?pid=${participantId}&token=${token}`
}
