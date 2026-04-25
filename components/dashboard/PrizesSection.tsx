'use client'

type PrizeType = 'money' | 'prizes'

interface Props {
  value: PrizeType
  onChange: (value: PrizeType) => void
}

export function PrizesSection({ value, onChange }: Props) {
  const options = [
    { value: 'money' as const, icon: '💷', label: 'Money pot', desc: 'Entry fees go into a prize pot.' },
    { value: 'prizes' as const, icon: '🏆', label: 'Prizes', desc: 'Physical or non-cash prizes.' },
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-pitch mb-3">What are you playing for?</label>
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              value === opt.value ? 'border-grass bg-grass/5' : 'border-[#D1D9D5] bg-white hover:border-mid'
            }`}
          >
            <span className="text-2xl mb-2 block">{opt.icon}</span>
            <p className="text-sm font-medium text-pitch mb-1">{opt.label}</p>
            <p className="text-xs text-mid">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
