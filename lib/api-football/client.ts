const BASE_URL = 'https://v3.football.api-sports.io'

interface ApiResponse<T> {
  response: T
  results: number
  errors: Record<string, string>
}

export async function apiFetch<T = unknown>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY! },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`API-Football ${res.status}: ${path}`)
  return res.json()
}

export const WC2026_LEAGUE_ID = 1
export const WC2026_SEASON = 2026
export const WC2026_TOURNAMENT_ID = 1 // our internal tournament ID
