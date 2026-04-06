'use client'

type Mode = 'random' | 'auto' | 'manual'

const modes: { value: Mode; label: string; icon: string; desc: string }[] = [
  {
    value: 'random',
    label: 'Random draw',
    icon: '🎲',
    desc: 'You hit the button and teams are shuffled fairly across all participants.',
  },
  {
    value: 'auto',
    label: 'Auto-assign',
    icon: '⚡',
    desc: 'Teams are assigned automatically as participants are added, or when you hit a threshold.',
  },
  {
    value: 'manual',
    label: 'Manual',
    icon: '✋',
    desc: 'Drag and drop teams onto participants yourself. Full control over every assignment.',
  },
]

interface Props {
  value: Mode
  onChange: (mode: Mode) => void
}

export function AssignmentModeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {modes.map(m => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={`text-left p-4 rounded-xl border-2 transition-all ${
            value === m.value
              ? 'border-grass bg-grass/5'
              : 'border-[#D1D9D5] bg-white hover:border-mid'
          }`}
        >
          <span className="text-2xl mb-2 block">{m.icon}</span>
          <p className={`text-sm font-medium mb-1 ${value === m.value ? 'text-pitch' : 'text-pitch'}`}>
            {m.label}
          </p>
          <p className="text-xs text-mid leading-relaxed">{m.desc}</p>
        </button>
      ))}
    </div>
  )
}
