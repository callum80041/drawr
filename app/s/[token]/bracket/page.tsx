import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ token: string }>
}

export default async function BracketPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, sweepstake_type')
    .eq('share_token', token)
    .single()

  if (!sweepstake) notFound()
  if (sweepstake.sweepstake_type === 'eurovision') notFound()

  return (
    <div className="text-center py-16 text-mid">
      <p className="text-4xl mb-3">🏆</p>
      <p className="font-medium text-pitch">Knockout bracket coming soon.</p>
    </div>
  )
}
