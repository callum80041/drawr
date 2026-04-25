import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSweepstakePro } from '@/lib/utils/pro'
import { SetupBanner } from '@/components/dashboard/SetupBanner'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  const { data: sweepstakes } = organiser
    ? await supabase
        .from('sweepstakes')
        .select('id, name, status, plan, entry_fee, is_pro, pro_expires_at, created_at')
        .eq('organiser_id', organiser.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  // Check user_metadata, not organiser.name — the DB trigger auto-fills
  // organiser.name from the email prefix, so it's not a reliable signal.
  const hasName = !!user.user_metadata?.name && (user.user_metadata.name as string).trim().length > 0
  const providers = user.identities?.map((i: any) => i.provider) || []
  const hasPassword = providers.includes('password')
  const needsSetup = !hasName || !hasPassword

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {needsSetup && <SetupBanner userId={user.id} organiserId={organiser!.id} hasName={hasName} hasPassword={hasPassword} />}

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-pitch tracking-tight">
          My sweepstakes
        </h1>
        <Link
          href="/dashboard/new"
          className="bg-lime text-pitch text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors"
        >
          + New sweepstake
        </Link>
      </div>

      {!sweepstakes || sweepstakes.length === 0 ? (
        <div className="border-2 border-dashed border-[#C8D4CC] rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h2 className="font-heading text-xl font-bold text-pitch mb-2">No sweepstakes yet</h2>
          <p className="text-mid text-sm mb-6">
            Create your first sweepstake and share it with your group in minutes.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-block bg-lime text-pitch text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors"
          >
            Create sweepstake
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {sweepstakes.map(s => (
            <Link
              key={s.id}
              href={`/dashboard/${s.id}`}
              className="block bg-white rounded-xl p-5 hover:shadow-md transition-shadow border border-transparent hover:border-[#C8D4CC]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-pitch text-lg tracking-tight">{s.name}</h2>
                  <p className="text-sm text-mid mt-0.5 capitalize">{s.status}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  isSweepstakePro(s) ? 'bg-lime/20 text-pitch' : 'bg-light text-mid'
                }`}>
                  {isSweepstakePro(s) ? 'Pro' : 'Free'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
