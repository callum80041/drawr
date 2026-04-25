import Link from 'next/link'

interface Props {
  searchParams: Promise<{ reason?: string }>
}

export default async function VerificationErrorPage({ searchParams }: Props) {
  const { reason } = await searchParams

  const reasons: Record<string, { title: string; message: string }> = {
    invalid: {
      title: 'Link not found',
      message: 'This verification link is invalid or has expired. Please create a new sweepstake via WhatsApp.',
    },
    update_failed: {
      title: 'Verification failed',
      message: 'Something went wrong while verifying your sweepstake. Please try again.',
    },
    server_error: {
      title: 'Server error',
      message: 'An unexpected error occurred. Please try again later.',
    },
  }

  const error = reasons[reason ?? 'invalid'] || reasons.invalid

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-light">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5EDEA] p-8 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <h1 className="font-heading font-bold text-2xl text-pitch mb-2">{error.title}</h1>
        <p className="text-mid text-sm leading-relaxed mb-6">{error.message}</p>
        <Link
          href="/dashboard"
          className="inline-block bg-lime text-pitch px-6 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-opacity"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
