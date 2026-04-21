import { type CurrencyCode } from '@/lib/constants/currencies'
import { formatCurrency } from '@/lib/utils/formatCurrency'

interface Props {
  total: number
  paid: number
  entryFee: number
  currency?: CurrencyCode
  sweepstakeName?: string
}

export function PaymentSummary({ total, paid, entryFee, currency = 'GBP' }: Props) {
  const unpaid = total - paid
  const collected = paid * entryFee
  const outstanding = unpaid * entryFee

  const stats = [
    { label: 'Total', value: total },
    { label: 'Paid', value: paid, accent: true },
    { label: 'Unpaid', value: unpaid },
    ...(entryFee > 0
      ? [
          { label: 'Collected', value: formatCurrency(collected, currency), accent: true },
          { label: 'Outstanding', value: formatCurrency(outstanding, currency) },
        ]
      : []),
  ]

  return (
    <div className="space-y-3">
      {entryFee > 0 && (
        <p className="text-xs text-mid bg-white border border-[#E5EDEA] rounded-xl px-4 py-2.5">
          💷 Entry fee is <span className="font-semibold text-pitch">{formatCurrency(entryFee, currency)} per participant</span> — you collect payments directly. Mark each person paid below.
        </p>
      )}
      <div className={`grid gap-3 ${stats.length <= 3 ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-5'}`}>
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E5EDEA] px-4 py-3">
            <p className={`text-xl font-heading font-bold ${s.accent ? 'text-grass' : 'text-pitch'}`}>
              {s.value}
            </p>
            <p className="text-xs text-mid mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
