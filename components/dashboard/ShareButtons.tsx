'use client'

import { useState, useEffect } from 'react'

interface Props {
  url: string
  sweepstakeName: string
}

export function ShareButtons({ url, sweepstakeName }: Props) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const shareText = `Join my World Cup 2026 sweepstake — ${sweepstakeName}! Sign up here:`
  const fullMessage = `${shareText} ${url}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title: sweepstakeName, text: shareText, url })
    } catch {
      // user dismissed — no-op
    }
  }

  const buttons = [
    {
      label: copied ? '✓ Copied!' : 'Copy link',
      onClick: handleCopy,
      className: copied
        ? 'bg-lime/20 border-lime/40 text-pitch'
        : 'bg-white border-[#D1D9D5] text-pitch hover:border-grass',
      icon: copied ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="4" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <rect x="1" y="4" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="white" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(fullMessage)}`,
      className: 'bg-white border-[#D1D9D5] text-[#25D366] hover:border-[#25D366]',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.116 1.523 5.845L.06 23.447a.75.75 0 00.914.914l5.602-1.463A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.946 0-3.768-.5-5.354-1.379l-.386-.217-3.995 1.044 1.044-3.995-.217-.386A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      ),
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodeURIComponent(`Join ${sweepstakeName} sweepstake`)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
      className: 'bg-white border-[#D1D9D5] text-mid hover:border-mid hover:text-pitch',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'SMS',
      href: `sms:?body=${encodeURIComponent(fullMessage)}`,
      className: 'bg-white border-[#D1D9D5] text-mid hover:border-mid hover:text-pitch',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1.5h12a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H4l-3 3V2a.5.5 0 01.5-.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  return (
    <div className="mt-3">
      <p className="text-xs text-mid mb-2 font-medium">Share via</p>
      <div className="flex flex-wrap gap-2">
        {buttons.map(btn =>
          'href' in btn ? (
            <a
              key={btn.label}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${btn.className}`}
            >
              {btn.icon}
              {btn.label}
            </a>
          ) : (
            <button
              key={btn.label}
              type="button"
              onClick={btn.onClick}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${btn.className}`}
            >
              {btn.icon}
              {btn.label}
            </button>
          )
        )}

        {/* Native share (iOS/Android — opens Instagram, Messenger etc.) */}
        {canShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#D1D9D5] bg-white text-mid hover:border-mid hover:text-pitch transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 9v2.5A1.5 1.5 0 003.5 13h7A1.5 1.5 0 0012 11.5V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            More…
          </button>
        )}
      </div>
    </div>
  )
}
