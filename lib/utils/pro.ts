import type { Database } from '@/lib/supabase/types'

type Sweepstake = Database['public']['Tables']['sweepstakes']['Row']

export function isSweepstakePro(sweepstake: Pick<Sweepstake, 'is_pro' | 'pro_expires_at'>): boolean {
  if (!sweepstake.is_pro) return false
  if (!sweepstake.pro_expires_at) return true
  return new Date(sweepstake.pro_expires_at) > new Date()
}
