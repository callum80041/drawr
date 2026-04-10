'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Stats {
  totalOrganisers: number
  organisersLast7: number
  organisersLast30: number
  totalSweepstakes: number
  byStatus: Record<string, number>
  drawsDone: number
  paidEntries: number
  totalParticipants: number
  participantsWithEmail: number
}

interface Organiser {
  id: string
  name: string
  email: string
  created_at: string
  last_login_at?: string | null
}

interface ParticipantDetail {
  id: string
  name: string
  email: string | null
  paid: boolean
  created_at: string
}

interface SweepstakeDetail {
  id: string
  name: string
  status: string
  entry_fee: number | null
  share_token: string
  created_at: string
  draw_completed_at: string | null
  participants: ParticipantDetail[]
}

interface OrganiserDetail {
  id: string
  name: string
  email: string
  created_at: string
  last_login_at: string | null
  sweepstakes: SweepstakeDetail[]
}

interface AnalyticsData {
  stats7:   { pageviews?: { value: number }; visitors?: { value: number } } | null
  stats30:  { pageviews?: { value: number }; visitors?: { value: number } } | null
  topPages: { data?: { path: string; total: number }[] } | null
}

interface EmailLogEntry {
  id: string
  to_email: string
  subject: string
  template: string | null
  resend_id: string | null
  created_at: string
}

interface Props {
  stats: Stats
  recentOrganisers: Organiser[]
  organiserDetails: OrganiserDetail[]
  emailLog: EmailLogEntry[]
  analytics: AnalyticsData | null
}

const APP_URL = 'https://playdrawr.co.uk'

const STATUS_COLOURS: Record<string, string> = {
  setup:    'bg-amber-100 text-amber-800',
  active:   'bg-green-100 text-green-800',
  complete: 'bg-slate-100 text-slate-600',
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5EDEA] p-5">
      <p className="text-3xl font-heading font-bold text-pitch tracking-tight">{value}</p>
      <p className="text-sm font-medium text-pitch mt-0.5">{label}</p>
      {sub && <p className="text-xs text-mid mt-0.5">{sub}</p>}
    </div>
  )
}

export function AdminDashboard({ stats, recentOrganisers, organiserDetails, emailLog, analytics }: Props) {
  const router = useRouter()
  const [expandedOrganiser, setExpandedOrganiser] = useState<string | null>(null)
  const [expandedSweepstake, setExpandedSweepstake] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')

  // Reset draw
  const [confirmResetDraw, setConfirmResetDraw] = useState<string | null>(null) // sweepstakeId
  const [resettingDraw, setResettingDraw] = useState<string | null>(null)
  const [resetDrawError, setResetDrawError] = useState('')

  async function handleResetDraw(sweepstakeId: string) {
    setResettingDraw(sweepstakeId)
    setResetDrawError('')
    try {
      const res = await fetch('/api/headcoachadmin/reset-draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sweepstakeId }),
      })
      const data = await res.json()
      if (!res.ok) { setResetDrawError(data.error ?? 'Failed'); setResettingDraw(null); return }
      setConfirmResetDraw(null)
      router.refresh()
    } catch {
      setResetDrawError('Something went wrong.')
      setResettingDraw(null)
    }
  }

  // Template preview
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  // Bulk email
  type Recipient = { id: string; name: string; email: string; version: 'A' | 'B'; joinUrl: string | null }
  const [bulkStep, setBulkStep] = useState<'idle' | 'loading' | 'preview' | 'sending' | 'done'>('idle')
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [bulkResult, setBulkResult] = useState<{ sent: number; failed: number } | null>(null)
  const [bulkError, setBulkError] = useState('')
  const [emailPreviewVersion, setEmailPreviewVersion] = useState<'A' | 'B' | null>(null)

  async function handleBulkPreview() {
    setBulkStep('loading')
    setBulkError('')
    try {
      const res = await fetch('/api/headcoachadmin/bulk-email')
      const data = await res.json()
      if (!res.ok) { setBulkError(data.error ?? 'Failed'); setBulkStep('idle'); return }
      setRecipients(data.recipients)
      setBulkStep('preview')
    } catch {
      setBulkError('Failed to load preview.')
      setBulkStep('idle')
    }
  }

  async function handleBulkSend() {
    setBulkStep('sending')
    setBulkError('')
    try {
      const res = await fetch('/api/headcoachadmin/bulk-email', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setBulkError(data.error ?? 'Failed'); setBulkStep('preview'); return }
      setBulkResult({ sent: data.sent, failed: data.failed })
      setBulkStep('done')
    } catch {
      setBulkError('Something went wrong.')
      setBulkStep('preview')
    }
  }

  async function handleLogout() {
    await fetch('/api/headcoachadmin', { method: 'DELETE' })
    router.refresh()
  }

  async function handleDelete(organiserId: string) {
    setDeleting(organiserId)
    setDeleteError('')
    try {
      const res = await fetch('/api/headcoachadmin/delete-organiser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organiserId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDeleteError(data.error ?? 'Failed to delete.')
        setDeleting(null)
        return
      }
      setConfirmDelete(null)
      router.refresh()
    } catch {
      setDeleteError('Something went wrong.')
      setDeleting(null)
    }
  }

  const emailPct = stats.totalParticipants > 0
    ? Math.round((stats.participantsWithEmail / stats.totalParticipants) * 100)
    : 0

  const views7   = analytics?.stats7?.pageviews?.value
  const views30  = analytics?.stats30?.pageviews?.value
  const visits7  = analytics?.stats7?.visitors?.value
  const visits30 = analytics?.stats30?.visitors?.value
  const topPages = analytics?.topPages?.data ?? []

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-pitch px-6 md:px-10 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-white tracking-tight">🎲 Head Coach</h1>
          <p className="text-white/40 text-xs mt-0.5">playdrawr admin</p>
        </div>
        <button onClick={handleLogout} className="text-xs text-white/50 hover:text-white transition-colors">
          Log out
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Traffic */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">Traffic</h2>
          {analytics === null ? (
            <p className="text-sm text-mid">Analytics not configured — add VERCEL_TOKEN and VERCEL_PROJECT_ID to env vars.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Page views (7d)"      value={views7  ?? '—'} />
              <StatCard label="Unique visitors (7d)" value={visits7 ?? '—'} />
              <StatCard label="Page views (30d)"     value={views30  ?? '—'} />
              <StatCard label="Unique visitors (30d)" value={visits30 ?? '—'} />
            </div>
          )}

          {topPages.length > 0 && (
            <div className="mt-4 bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#E5EDEA] bg-light">
                <p className="text-xs font-medium text-mid uppercase tracking-wide">Top pages (30d)</p>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#E5EDEA]/60">
                  {topPages.map(p => (
                    <tr key={p.path} className="hover:bg-light/50">
                      <td className="px-5 py-2.5 text-pitch font-mono text-xs">{p.path}</td>
                      <td className="px-5 py-2.5 text-mid text-right tabular-nums">{p.total.toLocaleString()} views</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Signups */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">Organisers (signups)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total signups"  value={stats.totalOrganisers} />
            <StatCard label="Last 7 days"    value={stats.organisersLast7} />
            <StatCard label="Last 30 days"   value={stats.organisersLast30} />
          </div>
        </section>

        {/* Sweepstakes */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">Sweepstakes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total created"  value={stats.totalSweepstakes} />
            <StatCard label="Draw completed" value={stats.drawsDone} sub={`${stats.totalSweepstakes > 0 ? Math.round((stats.drawsDone / stats.totalSweepstakes) * 100) : 0}% of total`} />
            <StatCard label="With entry fee" value={stats.paidEntries} sub="money pot sweepstakes" />
            <StatCard label="Active"         value={stats.byStatus['active'] ?? 0} sub={Object.entries(stats.byStatus).map(([s, n]) => `${n} ${s}`).join(' · ') || '—'} />
          </div>
        </section>

        {/* Participants */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">Participants</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total participants"  value={stats.totalParticipants} />
            <StatCard label="With email address"  value={stats.participantsWithEmail} sub={`${emailPct}% — eligible for notifications`} />
            <StatCard label="Avg per sweepstake"  value={stats.totalSweepstakes > 0 ? Math.round(stats.totalParticipants / stats.totalSweepstakes) : '—'} />
          </div>
        </section>

        {/* Bulk email */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">Bulk email</h2>

          {bulkStep === 'idle' && (
            <div className="bg-white rounded-xl border border-[#E5EDEA] p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-pitch mb-0.5">"A quick one from the dugout"</p>
                <p className="text-xs text-mid">Bug-fix + settings update. Version A includes sweepstake join link, Version B has a create CTA.</p>
              </div>
              <button
                onClick={handleBulkPreview}
                className="shrink-0 bg-lime text-pitch font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors"
              >
                Preview send
              </button>
            </div>
          )}

          {bulkStep === 'loading' && (
            <div className="bg-white rounded-xl border border-[#E5EDEA] p-5 text-sm text-mid">Loading recipient list…</div>
          )}

          {bulkStep === 'preview' && (
            <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5EDEA] flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-pitch">{recipients.length} recipients</p>
                  <p className="text-xs text-mid mt-0.5">
                    {recipients.filter(r => r.version === 'A').length} × Version A (with join link) &nbsp;·&nbsp;
                    {recipients.filter(r => r.version === 'B').length} × Version B (create CTA)
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => setBulkStep('idle')} className="text-xs text-mid hover:text-pitch transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkSend}
                    className="bg-pitch text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-pitch/90 transition-colors"
                  >
                    Send to all {recipients.length} →
                  </button>
                </div>
              </div>
              {bulkError && <p className="px-5 py-3 text-xs text-red-600">{bulkError}</p>}

              {/* Email preview */}
              <div className="px-5 py-3 border-b border-[#E5EDEA] flex items-center gap-3">
                <span className="text-xs text-mid">Preview email:</span>
                <button
                  onClick={() => setEmailPreviewVersion(emailPreviewVersion === 'A' ? null : 'A')}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${emailPreviewVersion === 'A' ? 'bg-lime text-pitch' : 'bg-light text-mid hover:text-pitch'}`}
                >
                  Version A (with join link)
                </button>
                <button
                  onClick={() => setEmailPreviewVersion(emailPreviewVersion === 'B' ? null : 'B')}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${emailPreviewVersion === 'B' ? 'bg-amber-200 text-amber-900' : 'bg-light text-mid hover:text-pitch'}`}
                >
                  Version B (create CTA)
                </button>
              </div>
              {emailPreviewVersion && (
                <div className="border-b border-[#E5EDEA]">
                  <iframe
                    src={`/api/headcoachadmin/email-preview?version=${emailPreviewVersion}`}
                    className="w-full"
                    style={{ height: 600, border: 'none' }}
                    title={`Email preview version ${emailPreviewVersion}`}
                  />
                </div>
              )}

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E5EDEA] bg-light">
                    <th className="text-left px-5 py-2.5 font-medium text-mid">Name</th>
                    <th className="text-left px-5 py-2.5 font-medium text-mid">Email</th>
                    <th className="text-center px-5 py-2.5 font-medium text-mid">Version</th>
                    <th className="text-left px-5 py-2.5 font-medium text-mid">Join link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EDEA]/60">
                  {recipients.map(r => (
                    <tr key={r.id} className="hover:bg-light/50">
                      <td className="px-5 py-2.5 font-medium text-pitch">{r.name}</td>
                      <td className="px-5 py-2.5 text-mid">{r.email}</td>
                      <td className="px-5 py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-semibold ${r.version === 'A' ? 'bg-lime/30 text-pitch' : 'bg-amber-100 text-amber-800'}`}>
                          {r.version}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-mid font-mono truncate max-w-[180px]">
                        {r.joinUrl ?? <span className="text-[#C0CFC8]">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {bulkStep === 'sending' && (
            <div className="bg-white rounded-xl border border-[#E5EDEA] p-5 text-sm text-mid">
              Sending… this may take a moment.
            </div>
          )}

          {bulkStep === 'done' && bulkResult && (
            <div className="bg-white rounded-xl border border-[#E5EDEA] p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-pitch">
                  ✓ {bulkResult.sent} sent{bulkResult.failed > 0 ? `, ${bulkResult.failed} failed` : ''}
                </p>
                <p className="text-xs text-mid mt-0.5">Email sent successfully.</p>
              </div>
              <button onClick={() => { setBulkStep('idle'); setBulkResult(null) }} className="text-xs text-mid hover:text-pitch transition-colors">
                Dismiss
              </button>
            </div>
          )}
        </section>

        {/* Email template previews */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-1">Email templates</h2>
          <p className="text-xs text-mid mb-4">Click any template to preview it with sample data.</p>

          {(() => {
            const templates = [
              { id: 'welcome',                  label: 'Welcome',                    desc: 'New organiser signup',         tag: 'organiser' },
              { id: 'sweepstake-created',       label: 'Sweepstake created',         desc: 'Organiser confirmation',       tag: 'organiser' },
              { id: 'participant-joined',       label: 'Participant joined',          desc: 'Notifies organiser of signup', tag: 'organiser' },
              { id: 'invite',                   label: 'Participant invite',          desc: 'Added to sweepstake',          tag: 'participant' },
              { id: 'draw-complete',            label: 'Draw complete (WC)',          desc: 'World Cup team assigned',      tag: 'participant' },
              { id: 'draw-complete-eurovision', label: 'Draw complete (Eurovision)',  desc: 'Eurovision country assigned',  tag: 'participant' },
              { id: 'payment-chase',            label: 'Payment chase',              desc: 'Entry fee reminder',           tag: 'participant' },
              { id: 'waitlist-promoted',        label: 'Waitlist promoted',          desc: 'Reserve list → confirmed',     tag: 'participant' },
              { id: 'organiser-update',         label: 'Organiser update (bulk)',     desc: 'Campaign email (version A)',   tag: 'campaign' },
            ]

            const tagColour: Record<string, string> = {
              organiser:   'bg-blue-50 text-blue-700',
              participant: 'bg-lime/20 text-pitch',
              campaign:    'bg-amber-100 text-amber-800',
            }

            return (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {templates.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setPreviewTemplate(previewTemplate === t.id ? null : t.id)}
                      className={`text-left rounded-xl border p-4 transition-all ${
                        previewTemplate === t.id
                          ? 'border-grass bg-[#F0FAF4] ring-1 ring-grass'
                          : 'border-[#E5EDEA] bg-white hover:border-grass/50 hover:bg-light/60'
                      }`}
                    >
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${tagColour[t.tag]}`}>
                        {t.tag}
                      </span>
                      <p className="text-sm font-semibold text-pitch leading-tight mb-0.5">{t.label}</p>
                      <p className="text-xs text-mid">{t.desc}</p>
                    </button>
                  ))}
                </div>

                {previewTemplate && (
                  <div className="rounded-xl border border-[#E5EDEA] overflow-hidden">
                    <div className="px-4 py-2.5 bg-light border-b border-[#E5EDEA] flex items-center justify-between">
                      <p className="text-xs font-medium text-mid">
                        Preview — <span className="text-pitch font-semibold">{templates.find(t => t.id === previewTemplate)?.label}</span>
                        {' '}(sample data)
                      </p>
                      <button onClick={() => setPreviewTemplate(null)} className="text-xs text-mid hover:text-pitch transition-colors">
                        Close ✕
                      </button>
                    </div>
                    <iframe
                      key={previewTemplate}
                      src={`/api/headcoachadmin/email-preview?template=${previewTemplate}`}
                      className="w-full"
                      style={{ height: 700, border: 'none' }}
                      title={`Email preview: ${previewTemplate}`}
                    />
                  </div>
                )}
              </div>
            )
          })()}
        </section>

        {/* All organisers — drill-down */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">All organisers</h2>
          <div className="space-y-2">
            {organiserDetails.length === 0 && (
              <p className="text-sm text-mid">No organisers yet.</p>
            )}
            {organiserDetails.map(o => {
              const isOpen = expandedOrganiser === o.id
              const totalParticipants = o.sweepstakes.reduce((n, s) => n + s.participants.length, 0)
              return (
                <div key={o.id} className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
                  {/* Organiser row */}
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedOrganiser(isOpen ? null : o.id)
                      setExpandedSweepstake(null)
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-light/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-pitch text-sm truncate">{o.name}</p>
                      <p className="text-xs text-mid truncate">{o.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs text-mid shrink-0">
                      <span>{o.sweepstakes.length} sweepstake{o.sweepstakes.length !== 1 ? 's' : ''}</span>
                      <span>{totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}</span>
                      <span>
                        {o.last_login_at
                          ? `Last login ${new Date(o.last_login_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                          : 'Never logged in'}
                      </span>
                      <span>Joined {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <span className="text-mid text-xs ml-2">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Delete controls */}
                  {confirmDelete === o.id ? (
                    <div className="px-5 py-3 bg-red-50 border-t border-red-100 flex items-center gap-3 flex-wrap">
                      <p className="text-xs text-red-700 flex-1">
                        Delete <strong>{o.name}</strong> and all their sweepstakes, participants and assignments? This cannot be undone.
                      </p>
                      <button
                        onClick={() => handleDelete(o.id)}
                        disabled={deleting === o.id}
                        className="text-xs font-semibold bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {deleting === o.id ? 'Deleting…' : 'Yes, delete everything'}
                      </button>
                      <button
                        onClick={() => { setConfirmDelete(null); setDeleteError('') }}
                        className="text-xs text-mid hover:text-pitch transition-colors"
                      >
                        Cancel
                      </button>
                      {deleteError && <p className="text-xs text-red-600 w-full">{deleteError}</p>}
                    </div>
                  ) : (
                    <div className="px-5 pb-3 flex justify-end">
                      <button
                        onClick={() => { setConfirmDelete(o.id); setExpandedOrganiser(null) }}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Delete organiser
                      </button>
                    </div>
                  )}

                  {/* Sweepstakes */}
                  {isOpen && (
                    <div className="border-t border-[#E5EDEA] bg-light/40 px-5 py-4 space-y-3">
                      {o.sweepstakes.length === 0 && (
                        <p className="text-sm text-mid italic">No sweepstakes created yet.</p>
                      )}
                      {o.sweepstakes.map(s => {
                        const swOpen = expandedSweepstake === s.id
                        const joinUrl = `${APP_URL}/join/${s.share_token}`
                        const lbUrl   = `${APP_URL}/s/${s.share_token}`
                        const paidCount = s.participants.filter(p => p.paid).length
                        return (
                          <div key={s.id} className="bg-white rounded-lg border border-[#E5EDEA] overflow-hidden">
                            {/* Sweepstake row */}
                            <button
                              type="button"
                              onClick={() => setExpandedSweepstake(swOpen ? null : s.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-light/50 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-pitch text-sm">{s.name}</p>
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOURS[s.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                    {s.status}
                                  </span>
                                  {Number(s.entry_fee) > 0 && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                      £{Number(s.entry_fee).toFixed(2)} entry
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-mid mt-0.5">
                                  {s.participants.length} participant{s.participants.length !== 1 ? 's' : ''}
                                  {Number(s.entry_fee) > 0 ? ` · ${paidCount} paid` : ''}
                                  {' · '}Created {new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                              <span className="text-mid text-xs shrink-0">{swOpen ? '▲' : '▼'}</span>
                            </button>

                            {/* Sweepstake detail */}
                            {swOpen && (
                              <div className="border-t border-[#E5EDEA] px-4 py-3 space-y-3">
                                {/* Links */}
                                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                  <div className="bg-light rounded-lg px-3 py-2">
                                    <p className="font-semibold text-pitch mb-1">Self-signup link</p>
                                    <a href={joinUrl} target="_blank" rel="noopener noreferrer" className="text-grass hover:underline break-all font-mono">{joinUrl}</a>
                                  </div>
                                  <div className="bg-light rounded-lg px-3 py-2">
                                    <p className="font-semibold text-pitch mb-1">Leaderboard link</p>
                                    <a href={lbUrl} target="_blank" rel="noopener noreferrer" className="text-grass hover:underline break-all font-mono">{lbUrl}</a>
                                  </div>
                                </div>

                                {/* Reset draw */}
                                {s.draw_completed_at && (
                                  confirmResetDraw === s.id ? (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 flex items-center gap-3 flex-wrap">
                                      <p className="text-xs text-orange-800 flex-1">
                                        This will delete all {s.participants.length} team assignments and reset the sweepstake to setup. Cannot be undone.
                                      </p>
                                      <button
                                        onClick={() => handleResetDraw(s.id)}
                                        disabled={resettingDraw === s.id}
                                        className="text-xs font-semibold bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors shrink-0"
                                      >
                                        {resettingDraw === s.id ? 'Resetting…' : 'Yes, reset draw'}
                                      </button>
                                      <button
                                        onClick={() => { setConfirmResetDraw(null); setResetDrawError('') }}
                                        className="text-xs text-mid hover:text-pitch transition-colors shrink-0"
                                      >
                                        Cancel
                                      </button>
                                      {resetDrawError && <p className="text-xs text-red-600 w-full">{resetDrawError}</p>}
                                    </div>
                                  ) : (
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => setConfirmResetDraw(s.id)}
                                        className="text-xs text-orange-500 hover:text-orange-700 transition-colors"
                                      >
                                        Reset draw
                                      </button>
                                    </div>
                                  )
                                )}

                              {/* Participants table */}
                                {s.participants.length === 0 ? (
                                  <p className="text-xs text-mid italic px-1">No participants yet.</p>
                                ) : (
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-[#E5EDEA]">
                                        <th className="text-left py-1.5 px-1 font-medium text-mid">Name</th>
                                        <th className="text-left py-1.5 px-1 font-medium text-mid">Email</th>
                                        {Number(s.entry_fee) > 0 && (
                                          <th className="text-center py-1.5 px-1 font-medium text-mid">Paid</th>
                                        )}
                                        <th className="text-right py-1.5 px-1 font-medium text-mid">Joined</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5EDEA]/60">
                                      {s.participants.map(p => (
                                        <tr key={p.id} className="hover:bg-light/50">
                                          <td className="py-1.5 px-1 text-pitch font-medium">{p.name}</td>
                                          <td className="py-1.5 px-1 text-mid">{p.email ?? <span className="text-[#C0CFC8]">—</span>}</td>
                                          {Number(s.entry_fee) > 0 && (
                                            <td className="py-1.5 px-1 text-center">
                                              {p.paid
                                                ? <span className="text-green-600 font-semibold">✓</span>
                                                : <span className="text-[#C0CFC8]">–</span>
                                              }
                                            </td>
                                          )}
                                          <td className="py-1.5 px-1 text-mid text-right tabular-nums whitespace-nowrap">
                                            {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Email log */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-1">Emails sent</h2>
          <p className="text-xs text-mid mb-4">Last 200 transactional emails — logged from the moment this feature was deployed.</p>
          {emailLog.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5EDEA] px-5 py-8 text-center text-sm text-mid">
              No emails logged yet. Emails will appear here as they are sent.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#E5EDEA] bg-light flex items-center justify-between">
                <p className="text-xs font-medium text-mid uppercase tracking-wide">Email log</p>
                <p className="text-xs text-mid">{emailLog.length} shown</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#E5EDEA]">
                      <th className="text-left px-4 py-2.5 font-medium text-mid">Sent</th>
                      <th className="text-left px-4 py-2.5 font-medium text-mid">To</th>
                      <th className="text-left px-4 py-2.5 font-medium text-mid">Subject</th>
                      <th className="text-left px-4 py-2.5 font-medium text-mid">Template</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EDEA]/60">
                    {emailLog.map(e => (
                      <tr key={e.id} className="hover:bg-light/50">
                        <td className="px-4 py-2.5 text-mid whitespace-nowrap tabular-nums">
                          {new Date(e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' '}
                          <span className="text-[#C0CFC8]">
                            {new Date(e.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-pitch font-medium">{e.to_email}</td>
                        <td className="px-4 py-2.5 text-mid max-w-[220px] truncate">{e.subject}</td>
                        <td className="px-4 py-2.5">
                          {e.template ? (
                            <span className="inline-block px-2 py-0.5 rounded-full bg-lime/20 text-pitch font-medium">
                              {e.template}
                            </span>
                          ) : (
                            <span className="text-[#C0CFC8]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Recent signups */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">Recent signups</h2>
          <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">
            {recentOrganisers.length === 0 ? (
              <p className="px-5 py-8 text-center text-mid text-sm">No signups yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5EDEA] bg-light">
                    <th className="text-left px-5 py-3 text-xs font-medium text-mid uppercase tracking-wide">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-mid uppercase tracking-wide">Email</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-mid uppercase tracking-wide">Joined</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-mid uppercase tracking-wide">Last login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EDEA]/60">
                  {recentOrganisers.map(o => (
                    <tr key={o.id} className="hover:bg-light/50">
                      <td className="px-5 py-3 font-medium text-pitch">{o.name}</td>
                      <td className="px-5 py-3 text-mid">{o.email}</td>
                      <td className="px-5 py-3 text-mid text-right tabular-nums whitespace-nowrap">
                        {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3 text-mid text-right tabular-nums whitespace-nowrap">
                        {o.last_login_at
                          ? new Date(o.last_login_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : <span className="text-[#C0CFC8]">Never</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
