'use client'

import { useState } from 'react'

const APP_URL = 'https://playdrawr.co.uk'

// ── Types ────────────────────────────────────────────────────────────────────

export interface CampaignQualifier {
  id: string
  name: string
  email: string
  sweepstakeName?: string
  shareToken?: string
  participantCount?: number
}

interface CampaignAudience {
  count: number
  qualifiers: CampaignQualifier[]
}

export interface CampaignData {
  email1: CampaignAudience
  email2: CampaignAudience
  email3: CampaignAudience
}

// ── Campaign definitions ─────────────────────────────────────────────────────

const CAMPAIGNS = [
  {
    id: 1 as const,
    template: 'campaign-1',
    label: 'Start your sweepstake',
    subject: 'Start your World Cup sweepstake',
    previewText: "You've signed up — now get your World Cup sweepstake set up and ready to share.",
    audienceLabel: 'Signed up, no WC sweepstake',
    audienceNote: 'Organisers with an account but no World Cup sweepstake created yet.',
    tag: 'worldcup-only',
  },
  {
    id: 2 as const,
    template: 'campaign-2',
    label: 'Your link is ready to share',
    subject: 'Your sweepstake link is ready to share',
    previewText: "Your World Cup sweepstake is live — now it's time to get a few more people in.",
    audienceLabel: 'WC sweepstake, fewer than 3 participants',
    audienceNote: 'Organisers with a World Cup sweepstake where the participant count is 0–2.',
    tag: 'worldcup-only',
  },
  {
    id: 3 as const,
    template: 'campaign-3',
    label: 'Push to 10 by 30 April',
    subject: 'Get your sweepstake to 10 players by 30 April',
    previewText: "You've already got your sweepstake started — now get it in front of more people.",
    audienceLabel: 'WC sweepstake, 3–9 participants',
    audienceNote: 'Organisers with a World Cup sweepstake where the participant count is 3–9 (within reach of the prize draw threshold).',
    tag: 'worldcup-only',
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildPreviewSrc(
  template: string,
  record: 'sample' | CampaignQualifier,
  campaignId: 1 | 2 | 3
): string {
  const params = new URLSearchParams({ template })

  if (record === 'sample') {
    const firstName = 'Sarah'
    params.set('firstName', firstName)
    if (campaignId === 1) {
      params.set('createLink', `${APP_URL}/dashboard/new`)
    } else {
      params.set('sweepName', 'The Crown World Cup 2026')
      params.set('sweepLink', `${APP_URL}/join/demo2026`)
      if (campaignId === 3) params.set('count', '5')
    }
  } else {
    // Use first name only from full name
    params.set('firstName', record.name.split(' ')[0] ?? record.name)
    if (campaignId === 1) {
      params.set('createLink', `${APP_URL}/dashboard/new`)
    } else {
      params.set('sweepName', record.sweepstakeName ?? 'My Sweepstake')
      params.set('sweepLink', `${APP_URL}/join/${record.shareToken ?? 'demo2026'}`)
      if (campaignId === 3) params.set('count', String(record.participantCount ?? 5))
    }
  }

  return `/api/headcoachadmin/email-preview?${params}`
}

// ── Component ────────────────────────────────────────────────────────────────

export function CampaignSection({ data }: { data: CampaignData }) {
  const [activeId, setActiveId]     = useState<1 | 2 | 3 | null>(null)
  const [record, setRecord]         = useState<'sample' | CampaignQualifier>('sample')

  const audiences: Record<1 | 2 | 3, CampaignAudience> = {
    1: data.email1,
    2: data.email2,
    3: data.email3,
  }

  const totalReach = data.email1.count + data.email2.count + data.email3.count
  const active = activeId ? CAMPAIGNS.find(c => c.id === activeId)! : null
  const activeAudience = activeId ? audiences[activeId] : null

  function toggleCard(id: 1 | 2 | 3) {
    if (activeId === id) {
      setActiveId(null)
      setRecord('sample')
    } else {
      setActiveId(id)
      setRecord('sample')
    }
  }

  const previewSrc = active
    ? buildPreviewSrc(active.template, record, active.id)
    : null

  return (
    <section>
      {/* Section header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight">
            World Cup campaign emails
          </h2>
          <p className="text-xs text-mid mt-0.5">
            Preview only — no sending. Each email targets a different organiser lifecycle stage.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-heading font-bold text-pitch leading-none">{totalReach}</p>
          <p className="text-xs text-mid mt-0.5">total in audience</p>
        </div>
      </div>

      {/* Prize draw callout */}
      <div className="mb-5 bg-[#FAFFF0] border border-[#C8F046] rounded-xl px-5 py-3 flex items-start gap-3">
        <span className="text-xl mt-0.5">🏆</span>
        <div>
          <p className="text-sm font-semibold text-pitch">
            £50 organiser prize draw · £25 participant prize draw
          </p>
          <p className="text-xs text-mid mt-0.5 leading-relaxed">
            Organisers qualify if they have a WC sweepstake with 10+ participants by 11:59pm on 30&nbsp;April&nbsp;2026.
            Participants qualify by joining with their email address.
            Vouchers sent 17&nbsp;June&nbsp;2026, ahead of England&nbsp;v&nbsp;Croatia.
          </p>
        </div>
      </div>

      {/* Campaign cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {CAMPAIGNS.map((c) => {
          const audience = audiences[c.id]
          const isActive = activeId === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCard(c.id)}
              className={`text-left rounded-xl border p-4 transition-all ${
                isActive
                  ? 'border-grass bg-[#F0FAF4] ring-1 ring-grass'
                  : 'border-[#E5EDEA] bg-white hover:border-grass/50 hover:bg-light/60'
              }`}
            >
              {/* Count badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-lime/20 text-pitch px-2 py-0.5 rounded-full">
                  ⚽ World Cup only
                </span>
                <span className={`text-xl font-heading font-bold leading-none ${audience.count === 0 ? 'text-mid' : 'text-pitch'}`}>
                  {audience.count}
                </span>
              </div>

              <p className="text-sm font-semibold text-pitch leading-snug mb-1">
                Email {c.id} — {c.label}
              </p>

              <p className="text-[11px] font-medium text-mid mb-2">
                {c.audienceLabel}
              </p>

              <div className="border-t border-[#E5EDEA] pt-2 mt-2">
                <p className="text-[10px] text-mid uppercase tracking-widest mb-0.5">Subject</p>
                <p className="text-xs text-pitch font-medium leading-snug">{c.subject}</p>
              </div>

              <div className="mt-2">
                <p className="text-[10px] text-mid uppercase tracking-widest mb-0.5">Preview text</p>
                <p className="text-[11px] text-mid italic leading-snug line-clamp-2">{c.previewText}</p>
              </div>

              <p className={`mt-3 text-xs font-semibold transition-colors ${isActive ? 'text-grass' : 'text-mid'}`}>
                {isActive ? 'Close preview ▲' : 'Preview email ▼'}
              </p>
            </button>
          )
        })}
      </div>

      {/* Preview panel */}
      {active && activeAudience && previewSrc && (
        <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden">

          {/* Panel header */}
          <div className="px-5 py-3 border-b border-[#E5EDEA] bg-light flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-pitch">
                Email {active.id} — {active.label}
              </p>
              <p className="text-xs text-mid mt-0.5">
                {activeAudience.count} recipient{activeAudience.count !== 1 ? 's' : ''} · {active.audienceNote}
              </p>
            </div>
            <button
              onClick={() => { setActiveId(null); setRecord('sample') }}
              className="text-xs text-mid hover:text-pitch transition-colors shrink-0"
            >
              Close ✕
            </button>
          </div>

          {/* Record picker */}
          <div className="px-5 py-3 border-b border-[#E5EDEA] flex items-center gap-3 flex-wrap">
            <span className="text-xs text-mid font-medium">Preview with:</span>

            <button
              onClick={() => setRecord('sample')}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                record === 'sample'
                  ? 'bg-lime text-pitch'
                  : 'bg-light text-mid hover:text-pitch'
              }`}
            >
              Sample data
            </button>

            {activeAudience.qualifiers.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-mid">or real record:</span>
                <select
                  className="text-xs border border-[#D1D9D5] rounded-lg px-2 py-1 text-pitch bg-white focus:outline-none focus:ring-1 focus:ring-grass max-w-[220px]"
                  value={record === 'sample' ? '' : (record as CampaignQualifier).id}
                  onChange={e => {
                    const id = e.target.value
                    if (!id) { setRecord('sample'); return }
                    const q = activeAudience.qualifiers.find(q => q.id === id)
                    if (q) setRecord(q)
                  }}
                >
                  <option value="">— select organiser —</option>
                  {activeAudience.qualifiers.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.name}
                      {q.participantCount !== undefined ? ` (${q.participantCount} participants)` : ''}
                    </option>
                  ))}
                </select>

                {record !== 'sample' && (
                  <span className="text-[11px] text-mid font-mono truncate max-w-[180px]">
                    {(record as CampaignQualifier).email}
                  </span>
                )}
              </div>
            )}

            {activeAudience.qualifiers.length === 0 && (
              <span className="text-xs text-mid italic">No qualifying records — showing sample data.</span>
            )}
          </div>

          {/* Email iframe */}
          <iframe
            key={previewSrc}
            src={previewSrc}
            className="w-full"
            style={{ height: 720, border: 'none' }}
            title={`Campaign email preview — Email ${active.id}`}
          />

          {/* Recipient list */}
          {activeAudience.qualifiers.length > 0 && (
            <div>
              <div className="px-5 py-2.5 border-t border-[#E5EDEA] bg-light">
                <p className="text-[10px] font-medium text-mid uppercase tracking-widest">
                  Qualifying recipients ({activeAudience.count} total
                  {activeAudience.count > activeAudience.qualifiers.length
                    ? ` — showing first ${activeAudience.qualifiers.length}`
                    : ''})
                </p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E5EDEA] bg-light/60">
                    <th className="text-left px-5 py-2 font-medium text-mid">Name</th>
                    <th className="text-left px-5 py-2 font-medium text-mid">Email</th>
                    {active.id !== 1 && (
                      <>
                        <th className="text-left px-5 py-2 font-medium text-mid">Sweepstake</th>
                        <th className="text-center px-5 py-2 font-medium text-mid">Participants</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EDEA]/60">
                  {activeAudience.qualifiers.map(q => (
                    <tr key={q.id} className="hover:bg-light/50">
                      <td className="px-5 py-2 font-medium text-pitch">{q.name}</td>
                      <td className="px-5 py-2 text-mid">{q.email}</td>
                      {active.id !== 1 && (
                        <>
                          <td className="px-5 py-2 text-mid truncate max-w-[180px]">
                            {q.sweepstakeName ?? '—'}
                          </td>
                          <td className="px-5 py-2 text-center tabular-nums text-mid">
                            {q.participantCount ?? 0}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
