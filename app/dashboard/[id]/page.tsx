import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ShareButtons } from '@/components/dashboard/ShareButtons'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SweepstakeOverviewPage({ params }: Props) {
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
    .select('*')
    .eq('id', id)
    .eq('organiser_id', organiser.id)
    .single()

  if (!sweepstake) notFound()

  const [{ count: participantCount }, { count: paidCount }, { count: assignmentCount }] =
    await Promise.all([
      supabase.from('participants').select('*', { count: 'exact', head: true }).eq('sweepstake_id', id),
      supabase.from('participants').select('*', { count: 'exact', head: true }).eq('sweepstake_id', id).eq('paid', true),
      supabase.from('assignments').select('*', { count: 'exact', head: true }).eq('sweepstake_id', id),
    ])

  const drawDone = (assignmentCount ?? 0) > 0
  const hasParticipants = (participantCount ?? 0) > 0

  const steps = [
    {
      num: 1,
      label: 'Add participants',
      done: hasParticipants,
      href: `/dashboard/${id}/participants`,
      cta: 'Add participants',
    },
    {
      num: 2,
      label: 'Run the draw',
      done: drawDone,
      href: `/dashboard/${id}/draw`,
      cta: 'Go to draw',
    },
    {
      num: 3,
      label: 'Share the link',
      done: sweepstake.status === 'active' || sweepstake.status === 'complete',
      href: `/s/${sweepstake.share_token}`,
      cta: 'View participant page',
      external: true,
    },
  ]

  return (
    <div className="max-w-3xl space-y-8">

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Participants', value: participantCount ?? 0 },
          { label: 'Paid', value: paidCount ?? 0 },
          { label: 'Teams assigned', value: assignmentCount ?? 0 },
          { label: 'Entry fee', value: sweepstake.entry_fee > 0 ? `£${Number(sweepstake.entry_fee).toFixed(2)}` : '—' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E5EDEA]">
            <p className="text-2xl font-heading font-bold text-pitch">{s.value}</p>
            <p className="text-xs text-mid mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Setup checklist */}
      {sweepstake.status === 'setup' && (
        <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5EDEA]">
            <h2 className="font-heading font-bold text-pitch tracking-tight">Get started</h2>
            <p className="text-sm text-mid mt-0.5">Complete these steps to launch your sweepstake.</p>
          </div>
          <ul className="divide-y divide-[#E5EDEA]">
            {steps.map(step => (
              <li key={step.num} className="flex items-center gap-4 px-5 py-4">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step.done ? 'bg-lime text-pitch' : 'bg-light text-mid border border-[#D1D9D5]'
                }`}>
                  {step.done ? (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : step.num}
                </span>
                <span className={`flex-1 text-sm font-medium ${step.done ? 'text-mid line-through' : 'text-pitch'}`}>
                  {step.label}
                </span>
                {!step.done && (
                  <Link
                    href={step.href}
                    target={step.external ? '_blank' : undefined}
                    rel={step.external ? 'noopener noreferrer' : undefined}
                    className="text-xs font-medium text-grass hover:underline"
                  >
                    {step.cta} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Leaderboard link */}
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
          <h2 className="font-heading font-bold text-pitch tracking-tight mb-1">Leaderboard link</h2>
          <p className="text-sm text-mid mb-3">View standings, fixtures and groups.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-light rounded-lg px-3 py-2 text-xs text-pitch font-mono truncate">
              {process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'}/s/{sweepstake.share_token}
            </code>
            <Link
              href={`/s/${sweepstake.share_token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-lime text-pitch text-xs font-medium px-3 py-2 rounded-lg hover:bg-[#b8e03d] transition-colors"
            >
              Open →
            </Link>
          </div>
        </div>

        {/* Self-signup join link */}
        <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
          <h2 className="font-heading font-bold text-pitch tracking-tight mb-1">Self-signup link</h2>
          <p className="text-sm text-mid mb-3">Participants can join themselves — no manual adding.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-light rounded-lg px-3 py-2 text-xs text-pitch font-mono truncate">
              {process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'}/join/{sweepstake.share_token}
            </code>
            <Link
              href={`/join/${sweepstake.share_token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-pitch text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-pitch/80 transition-colors"
            >
              Open →
            </Link>
          </div>
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'}/join/${sweepstake.share_token}`}
            sweepstakeName={sweepstake.name}
          />
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
        <h2 className="font-heading font-bold text-pitch tracking-tight mb-3">Details</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-mid uppercase tracking-wide mb-0.5">Tournament</dt>
            <dd className="text-pitch">{sweepstake.tournament_name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-mid uppercase tracking-wide mb-0.5">Assignment mode</dt>
            <dd className="text-pitch capitalize">{sweepstake.assignment_mode}</dd>
          </div>
          <div>
            <dt className="text-xs text-mid uppercase tracking-wide mb-0.5">Plan</dt>
            <dd className="text-pitch capitalize">{sweepstake.plan}</dd>
          </div>
          <div>
            <dt className="text-xs text-mid uppercase tracking-wide mb-0.5">Entry fee</dt>
            <dd className="text-pitch">
              {sweepstake.entry_fee > 0 ? `£${Number(sweepstake.entry_fee).toFixed(2)}` : 'Free'}
            </dd>
          </div>
        </dl>
      </div>

    </div>
  )
}
