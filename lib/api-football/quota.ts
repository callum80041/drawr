import { createServiceClient } from '@/lib/supabase/server'

export async function checkQuota(): Promise<boolean> {
  const supabase = await createServiceClient()
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('sync_log')
    .select('api_calls_used')
    .gte('created_at', today)
  const used = data?.reduce((sum, r) => sum + (r.api_calls_used ?? 0), 0) ?? 0
  return used < 90
}
