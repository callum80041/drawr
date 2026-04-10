import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SweepstakeTabs } from '@/components/dashboard/SweepstakeTabs'

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function SweepstakeLayout({ children, params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!organiser) redirect('/dashboard')

  const { data: sweepstake } = await supabase
    .from('sweepstakes')
    .select('id, name, status, plan, organiser_id, sweepstake_type')
    .eq('id', id)
    .single()

  if (!sweepstake) notFound()
  if (sweepstake.organiser_id !== organiser.id) notFound()

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-[#E5EDEA] px-6 md:px-8 pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-mid mb-1">
              <a href="/dashboard" className="hover:text-pitch transition-colors">My sweepstakes</a>
              <span className="mx-1.5">›</span>
              <span className="text-pitch">{sweepstake.name}</span>
            </p>
            <h1 className="font-heading text-2xl font-bold text-pitch tracking-tight">
              {sweepstake.name}
            </h1>
          </div>
          <span className={`mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            sweepstake.status === 'active'  ? 'bg-lime/30 text-pitch' :
            sweepstake.status === 'complete' ? 'bg-gold/20 text-pitch' :
            'bg-light text-mid'
          }`}>
            {sweepstake.status}
          </span>
        </div>
        <SweepstakeTabs id={id} sweepstakeType={sweepstake.sweepstake_type ?? 'worldcup'} />
      </div>

      <div className="flex-1 p-6 md:p-8">
        {children}
      </div>
    </div>
  )
}
