import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSweepstakePro } from '@/lib/utils/pro'
import { ShareButtons } from '@/components/dashboard/ShareButtons'
import { EntryFeeEditor } from '@/components/dashboard/EntryFeeEditor'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ created?: string; verified?: string }>
}

export default async function SweepstakeOverviewPage({ params, searchParams }: Props) {
  const { id } = await params
  const { created, verified } = await searchParams
  const justCreated = created === '1'
  const justVerified = verified === '1'

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

  const isPro = isSweepstakePro(sweepstake)

  const [{ count: participantCount }, { count: paidCount }, { count: assignmentCount }] =
    await Promise.all([
      supabase.from('participants').select('*', { count: 'exact', head: true }).eq('sweepstake_id', id),
      supabase.from('participants').select('*', { count: 'exact', head: true }).eq('sweepstake_id', id).eq('paid', true),
      supabase.from('assignments').select('*', { count: 'exact', head: true }).eq('sweepstake_id', id),
    ])

  const drawDone = (assignmentCount ?? 0) > 0
  const hasParticipants = (participantCount ?? 0) > 0
  const isEurovision = sweepstake.sweepstake_type === 'eurovision'

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playdrawr.co.uk'
  const joinUrl = `${appUrl}/join/${sweepstake.share_token}`

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

  // Eurovision-aware accent colours
  const accentBg = isEurovision ? 'bg-[#F10F59]' : 'bg-lime'
  const accentText = isEurovision ? 'text-white' : 'text-pitch'
  const accentBorder = isEurovision ? 'border-[#F10F59]/30' : 'border-lime/30'

  return (
    <div className="max-w-3xl space-y-8">

      {/* ── Pending verification banner ── shown when sweepstake not yet verified */}
      {sweepstake.verified_at === null && (
        <div className="bg-white rounded-2xl border-2 border-yellow-400 overflow-hidden">
          <div className="bg-yellow-50 px-6 py-5">
            <p className="text-xs font-bold tracking-widest uppercase mb-1.5 text-yellow-800">
              ⏳ Pending verification
            </p>
            <h2 className="font-heading font-bold text-xl text-yellow-900 tracking-tight leading-tight">
              Check your email
            </h2>
            <p className="text-sm text-yellow-800 mt-2 leading-relaxed">
              We've sent a verification link to your email address. Click it to activate your sweepstake.
            </p>
            {justVerified && (
              <p className="text-sm text-green-700 mt-3 font-semibold">
                ✓ Your sweepstake is now verified!
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Get people in ── shown when just created OR no participants yet */}
      {(!hasParticipants || justCreated) && (
        <div className="bg-white rounded-2xl border border-[#E5EDEA] overflow-hidden">

          {/* Banner */}
          <div className={`${isEurovision ? 'bg-[#1B0744]' : 'bg-pitch'} px-6 py-5`}>
            {justCreated && (
              <p className="text-xs font-bold tracking-widest uppercase mb-1.5 opacity-70 text-white">
                {isEurovision ? '🎤 Eurovision sweepstake created!' : '⚽ Sweepstake created!'}
              </p>
            )}
            <h2 className="font-heading font-bold text-2xl text-white tracking-tight leading-tight">
              Get your group in
            </h2>
            <p className="text-sm text-white/70 mt-1">
              Share the link — they sign themselves up. No faff, no spreadsheet.
            </p>
          </div>

          {/* Share section */}
          <div className="px-6 py-5 border-b border-[#E5EDEA]">
            <p className="text-xs font-bold uppercase tracking-widest text-mid mb-3">Share this link</p>

            {/* Join URL */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
              <code className="flex-1 bg-light rounded-xl px-4 py-3 text-sm text-pitch font-mono truncate border border-[#E5EDEA]">
                {joinUrl}
              </code>
              <Link
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:shrink-0 bg-light text-pitch text-xs font-medium px-3 py-3 rounded-xl border border-[#E5EDEA] hover:border-mid transition-colors text-center"
              >
                Preview ↗
              </Link>
            </div>

            {/* Big share buttons */}
            <ShareButtons
              url={joinUrl}
              sweepstakeName={sweepstake.name}
              isEurovision={isEurovision}
              size="lg"
            />
          </div>

          {/* Manual add option */}
          <div className="px-6 py-4 bg-light/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-pitch">Prefer to add people yourself?</p>
              <p className="text-xs text-mid mt-0.5">Type names in one by one — useful for smaller groups.</p>
            </div>
            <Link
              href={`/dashboard/${id}/participants`}
              className="shrink-0 text-sm font-medium text-grass hover:underline"
            >
              Add manually →
            </Link>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Participants', value: participantCount ?? 0 },
          { label: 'Paid', value: paidCount ?? 0 },
          { label: 'Teams assigned', value: assignmentCount ?? 0 },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E5EDEA]">
            <p className="text-2xl font-heading font-bold text-pitch">{s.value}</p>
            <p className="text-xs text-mid mt-0.5">{s.label}</p>
          </div>
        ))}
        <EntryFeeEditor sweepstakeId={id} initialFee={Number(sweepstake.entry_fee ?? 0)} currency={sweepstake.currency ?? 'GBP'} />
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
                  step.done
                    ? `${accentBg} ${accentText}`
                    : 'bg-light text-mid border border-[#D1D9D5]'
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

      {/* Links — shown only when participants exist (otherwise the top banner covers this) */}
      {hasParticipants && (
        <div className={`grid gap-4 ${isPro ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {/* Leaderboard link */}
          <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
            <h2 className="font-heading font-bold text-pitch tracking-tight mb-1">Leaderboard link</h2>
            <p className="text-sm text-mid mb-3">View standings, fixtures and groups.</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <code className="flex-1 bg-light rounded-lg px-3 py-2 text-xs text-pitch font-mono truncate">
                {appUrl}/s/{sweepstake.share_token}
              </code>
              <Link
                href={`/s/${sweepstake.share_token}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`sm:shrink-0 ${accentBg} ${accentText} text-xs font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity text-center`}
              >
                Open →
              </Link>
            </div>
          </div>

          {/* Self-signup join link */}
          <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
            <h2 className="font-heading font-bold text-pitch tracking-tight mb-1">Self-signup link</h2>
            <p className="text-sm text-mid mb-3">Participants can join themselves — no manual adding.</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
              <code className="flex-1 bg-light rounded-lg px-3 py-2 text-xs text-pitch font-mono truncate">
                {joinUrl}
              </code>
              <Link
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:shrink-0 bg-pitch text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-pitch/80 transition-colors text-center"
              >
                Open →
              </Link>
            </div>
            <ShareButtons
              url={joinUrl}
              sweepstakeName={sweepstake.name}
              isEurovision={isEurovision}
              size="sm"
            />
          </div>

          {/* TV Mode link — Pro only */}
          {isPro && (
            <div className="relative bg-white rounded-xl border border-[#E5EDEA] p-5 opacity-60">
              <div className="absolute -top-2 -right-2">
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Coming soon
                </span>
              </div>
              <h2 className="font-heading font-bold text-pitch tracking-tight mb-1">TV mode</h2>
              <p className="text-sm text-mid mb-3">Full-screen display for break rooms or screens.</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pointer-events-none">
                <code className="flex-1 bg-light rounded-lg px-3 py-2 text-xs text-pitch font-mono truncate">
                  {appUrl}/tv/{sweepstake.custom_slug || sweepstake.share_token}
                </code>
                <div
                  className={`sm:shrink-0 ${accentBg} ${accentText} text-xs font-medium px-3 py-2 rounded-lg text-center cursor-not-allowed`}
                >
                  Open →
                </div>
              </div>
            </div>
          )}

          {/* Embed leaderboard — Pro feature coming soon */}
          {isPro && (
            <div className="relative bg-white rounded-xl border border-[#E5EDEA] p-5 opacity-60">
              <div className="absolute -top-2 -right-2">
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Coming soon
                </span>
              </div>
              <h2 className="font-heading font-bold text-pitch tracking-tight mb-1">Embed leaderboard</h2>
              <p className="text-sm text-mid mb-3">Embed the leaderboard on your website or intranet.</p>
              <code className="block bg-light rounded-lg px-3 py-2 text-xs text-pitch font-mono truncate">
                &lt;iframe src="..." /&gt;
              </code>
            </div>
          )}
        </div>
      )}

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
              {sweepstake.entry_fee > 0 ? `£${Number(sweepstake.entry_fee).toFixed(2)} per participant` : 'Free'}
            </dd>
          </div>
        </dl>
      </div>

    </div>
  )
}
