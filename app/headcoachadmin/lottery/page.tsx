import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { NewSyndicateForm } from './NewSyndicateForm'

export const dynamic = 'force-dynamic'

export default async function LotteryAdminPage() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('hc_admin')
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || adminCookie?.value !== adminPassword) redirect('/headcoachadmin')

  const supabase = await createServiceClient()
  const { data: syndicates } = await supabase
    .from('syndicates')
    .select('id, name, status, entry_fee_pence, current_pot_cycle, start_date, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/headcoachadmin" className="text-gray-400 hover:text-white text-sm">← Admin</Link>
          <h1 className="font-heading text-2xl font-bold">Lottery Syndicates</h1>
        </div>

        <div className="grid gap-4 mb-10">
          {(syndicates ?? []).length === 0 && (
            <p className="text-gray-400 text-sm">No syndicates yet.</p>
          )}
          {(syndicates ?? []).map(s => (
            <Link
              key={s.id}
              href={`/headcoachadmin/lottery/${s.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{s.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    £{(s.entry_fee_pence / 100).toFixed(2)}/week · Pot cycle {s.current_pot_cycle} · Started {s.start_date}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  s.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                }`}>
                  {s.status}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Create syndicate</h2>
          <NewSyndicateForm />
        </div>
      </div>
    </div>
  )
}
