'use client'

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
}

interface Props {
  stats: Stats
  recentOrganisers: Organiser[]
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

export function AdminDashboard({ stats, recentOrganisers }: Props) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/headcoachadmin', { method: 'DELETE' })
    router.refresh()
  }

  const emailPct = stats.totalParticipants > 0
    ? Math.round((stats.participantsWithEmail / stats.totalParticipants) * 100)
    : 0

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-pitch px-6 md:px-10 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-white tracking-tight">🎲 Head Coach</h1>
          <p className="text-white/40 text-xs mt-0.5">playdrawr admin</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-white/50 hover:text-white transition-colors"
        >
          Log out
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Signups */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">Organisers (signups)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total signups"     value={stats.totalOrganisers} />
            <StatCard label="Last 7 days"       value={stats.organisersLast7} />
            <StatCard label="Last 30 days"      value={stats.organisersLast30} />
          </div>
        </section>

        {/* Sweepstakes */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">Sweepstakes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total created"     value={stats.totalSweepstakes} />
            <StatCard label="Draw completed"    value={stats.drawsDone} sub={`${stats.totalSweepstakes > 0 ? Math.round((stats.drawsDone / stats.totalSweepstakes) * 100) : 0}% of total`} />
            <StatCard label="With entry fee"    value={stats.paidEntries} sub="money pot sweepstakes" />
            <StatCard
              label="Active"
              value={stats.byStatus['active'] ?? 0}
              sub={Object.entries(stats.byStatus).map(([s, n]) => `${n} ${s}`).join(' · ') || '—'}
            />
          </div>
        </section>

        {/* Participants */}
        <section>
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight mb-4">Participants</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total participants"    value={stats.totalParticipants} />
            <StatCard label="With email address"    value={stats.participantsWithEmail} sub={`${emailPct}% — eligible for notifications`} />
            <StatCard label="Avg per sweepstake"    value={stats.totalSweepstakes > 0 ? Math.round(stats.totalParticipants / stats.totalSweepstakes) : '—'} />
          </div>
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
