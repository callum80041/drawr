import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreateForm } from './CreateForm'

export default async function NewSweepstakePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: organiser } = await supabase
    .from('organisers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!organiser) redirect('/dashboard')

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-pitch tracking-tight">
          New sweepstake
        </h1>
        <p className="text-mid text-sm mt-1">Set it up once, share with everyone.</p>
      </div>
      <CreateForm organiserId={organiser.id} />
    </div>
  )
}
