import { notFound } from 'next/navigation'

// Hidden route — not linked from anywhere. Only accessible via direct URL.
// Returns 404 if somehow crawled or navigated to.
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ token: string }>
}

export default async function FinalPage({ params }: Props) {
  const { token } = await params

  if (!token) notFound()

  // Entry form and result reveal — coming in Step 13
  return (
    <main className="min-h-screen bg-pitch flex items-center justify-center">
      <div className="text-white text-center">
        <p className="text-mid">Loading…</p>
      </div>
    </main>
  )
}
