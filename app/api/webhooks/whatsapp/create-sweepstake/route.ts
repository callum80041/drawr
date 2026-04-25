import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { sweepstakeVerificationEmailHtml } from '@/lib/email/templates/sweepstake-verification'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'
const WHATSAPP_WEBHOOK_SECRET = process.env.WHATSAPP_WEBHOOK_SECRET || ''

interface WhatsAppFlowSubmission {
  email: string
  phone?: string
  sweepstake_name: string
  tournament_type: 'worldcup' | 'eurovision'
  entry_fee?: string
  assignment_mode?: 'random' | 'auto' | 'manual'
}

export async function POST(req: NextRequest) {
  const service = await createServiceClient()

  // Verify webhook signature (basic Bearer token check)
  // TODO: implement proper Twilio WhatsApp signature verification if using Twilio provider
  const authHeader = req.headers.get('authorization')
  if (WHATSAPP_WEBHOOK_SECRET && authHeader !== `Bearer ${WHATSAPP_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: WhatsAppFlowSubmission
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Validate required fields
  const { email, sweepstake_name, tournament_type } = payload
  if (!email?.trim() || !sweepstake_name?.trim() || !tournament_type) {
    return NextResponse.json(
      { error: 'Missing required fields: email, sweepstake_name, tournament_type' },
      { status: 400 }
    )
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Validate tournament_type
  if (!['worldcup', 'eurovision'].includes(tournament_type)) {
    return NextResponse.json({ error: 'Invalid tournament_type' }, { status: 400 })
  }

  const trimmedEmail = email.trim().toLowerCase()
  const entryFee = payload.entry_fee ? parseFloat(payload.entry_fee) : 0
  const assignmentMode = payload.assignment_mode ?? 'random'
  const tournamentId = tournament_type === 'worldcup' ? 1 : 2

  try {
    // Look up organiser by email
    let { data: organiser } = await service
      .from('organisers')
      .select('id, name')
      .eq('email', trimmedEmail)
      .single()

    // Auto-create organiser if doesn't exist
    if (!organiser) {
      const { data: newOrganiser, error: createError } = await service
        .from('organisers')
        .insert({
          email: trimmedEmail,
          name: trimmedEmail.split('@')[0], // Use email prefix as initial name
          plan: 'free',
        })
        .select('id, name')
        .single()

      if (createError || !newOrganiser) {
        return NextResponse.json({ error: 'Failed to create organiser account' }, { status: 500 })
      }

      organiser = newOrganiser
    }

    // Create unverified sweepstake
    const { data: sweepstake, error: sweepstakeError } = await service
      .from('sweepstakes')
      .insert({
        organiser_id: organiser.id,
        name: sweepstake_name.trim(),
        tournament_id: tournamentId,
        sweepstake_type: tournament_type,
        entry_fee: entryFee,
        assignment_mode: assignmentMode,
        status: 'setup',
        plan: 'free',
        verified_at: null,
      })
      .select('id, name, sweepstake_type')
      .single()

    if (sweepstakeError || !sweepstake) {
      return NextResponse.json({ error: 'Failed to create sweepstake' }, { status: 500 })
    }

    // Generate verification token
    const { data: tokenEntry, error: tokenError } = await service
      .from('sweepstake_verification_tokens')
      .insert({
        sweepstake_id: sweepstake.id,
        email: trimmedEmail,
      })
      .select('token')
      .single()

    if (tokenError || !tokenEntry) {
      return NextResponse.json({ error: 'Failed to generate verification token' }, { status: 500 })
    }

    const verificationUrl = `${APP_URL}/verify-sweepstake?token=${tokenEntry.token}`

    // Send verification email (non-blocking)
    ;(async () => {
      try {
        await sendEmail({
          to: trimmedEmail,
          subject: `Verify your sweepstake: ${sweepstake.name}`,
          html: sweepstakeVerificationEmailHtml({
            sweepstakeName: sweepstake.name,
            verificationUrl,
            isEurovision: sweepstake.sweepstake_type === 'eurovision',
          }),
          template: 'sweepstake-verification',
        })
      } catch {
        // Best-effort — log but don't fail the webhook response
        console.error('Failed to send verification email for sweepstake', sweepstake.id)
      }
    })()

    return NextResponse.json({
      ok: true,
      sweepstake: {
        id: sweepstake.id,
        name: sweepstake.name,
        verificationRequired: true,
        message: 'Check your email to verify your sweepstake',
      },
    })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
