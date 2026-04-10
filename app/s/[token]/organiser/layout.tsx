import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const DEMO_TOKENS = new Set(['demo2026', 'demoeurovision'])

interface Props {
  children: React.ReactNode
  params: Promise<{ token: string }>
}

// This layout only renders for demo tokens — no auth required
export default async function OrganiserDemoLayout({ children, params }: Props) {
  const { token } = await params

  if (!DEMO_TOKENS.has(token)) notFound()

  // Verify the sweepstake exists (public read RLS is fine here)
  const supabase = await createClient()
  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()

  return <>{children}</>
}
