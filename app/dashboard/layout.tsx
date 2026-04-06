import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id, name, email')
    .eq('user_id', user.id)
    .single()

  // Organiser row is created by DB trigger on signup.
  // If somehow missing (e.g. OAuth provider added later), create it now.
  if (!organiser) {
    await supabase.from('organisers').insert({
      user_id: user.id,
      name: user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Organiser',
      email: user.email ?? '',
    })
  }

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar organiserName={organiser?.name ?? user.email ?? ''} userEmail={user.email ?? ''} />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
