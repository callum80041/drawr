import { Logo } from './Logo'

interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  /** 'light' = white/lime on dark bg (default), 'dark' = pitch on light bg */
  variant?: 'light' | 'dark'
}

const sizes = {
  sm: { logo: 28, text: 'text-xl' },
  md: { logo: 36, text: 'text-2xl' },
  lg: { logo: 44, text: 'text-3xl' },
}

export function Wordmark({ size = 'md', variant = 'light' }: WordmarkProps) {
  const s = sizes[size]
  const playColor = variant === 'light' ? 'text-white' : 'text-pitch'
  const drawrColor = 'text-lime'

  return (
    <div className="flex items-center gap-2.5">
      <Logo size={s.logo} />
      <span className={`font-heading font-800 tracking-tight ${s.text} leading-none`}>
        <span className={playColor}>play</span>
        <span className={drawrColor}>drawr</span>
      </span>
    </div>
  )
}
