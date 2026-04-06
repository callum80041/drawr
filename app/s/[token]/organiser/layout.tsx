import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const DEMO_TOKEN = 'demo2026'

interface Props {
  children: React.ReactNode
  params: Promise<{ token: string }>
}

// This layout only renders for the demo token — no auth required
export default async function OrganiserDemoLayout({ children, params }: Props) {
  const { token } = await params

  if (token !== DEMO_TOKEN) notFound()

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
