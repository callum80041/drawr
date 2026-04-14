import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Unsubscribe — playdrawr',
  robots: { index: false },
}

// GET side-effect is intentional and industry-standard for email unsubscribe links.
// The update is idempotent — visiting again after unsubscribing is a no-op.

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return <UnsubscribeLayout status="invalid" />
  }

  const supabase = await createServiceClient()

  // Look up the token
  const { data: row } = await supabase
    .from('email_campaign_tokens')
    .select('email, unsubscribed_at')
    .eq('token', token)
    .maybeSingle()

  if (!row) {
    return <UnsubscribeLayout status="invalid" />
  }

  if (row.unsubscribed_at) {
    return <UnsubscribeLayout status="already" />
  }

  // Mark as unsubscribed
  await supabase
    .from('email_campaign_tokens')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('token', token)

  return <UnsubscribeLayout status="done" />
}

// ── Presentational component ──────────────────────────────────────────────────

type Status = 'done' | 'already' | 'invalid'

function UnsubscribeLayout({ status }: { status: Status }) {
  const content: Record<Status, { heading: string; body: string }> = {
    done: {
      heading: "You've been unsubscribed",
      body: "You won't receive any more campaign emails from playdrawr. Transactional emails (like draw results) will still be sent if you're a participant.",
    },
    already: {
      heading: "Already unsubscribed",
      body: "You've already opted out of campaign emails from playdrawr.",
    },
    invalid: {
      heading: "Invalid link",
      body: "This unsubscribe link isn't valid. If you'd like to opt out of emails, reply to any email you received from us.",
    },
  }

  const { heading, body } = content[status]

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-xs font-medium text-grass uppercase tracking-widest mb-4">Email preferences</p>
      <h1 className="font-heading text-3xl font-bold text-pitch tracking-tight mb-4">{heading}</h1>
      <p className="text-mid text-[15px] leading-relaxed mb-8">{body}</p>
      <a
        href="/"
        className="inline-block text-sm font-semibold text-pitch underline underline-offset-2 hover:text-grass transition-colors"
      >
        Back to playdrawr
      </a>
    </div>
  )
}
