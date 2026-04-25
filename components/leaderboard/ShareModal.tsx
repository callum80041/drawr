'use client'

import { useState } from 'react'

interface ShareModalProps {
  token: string
  sweepstakeName: string
  isOpen: boolean
  onClose: () => void
}

type Format = 'square' | 'story' | 'wide'

const FORMATS: Record<Format, { label: string; dimensions: string; description: string }> = {
  square: { label: 'Square (1080×1080)', dimensions: '1080×1080px', description: 'Instagram, general sharing' },
  story: { label: 'Story (1080×1920)', dimensions: '1080×1920px', description: 'Instagram Stories, WhatsApp' },
  wide: { label: 'Wide (1200×630)', dimensions: '1200×630px', description: 'Twitter/X, LinkedIn' },
}

export function ShareModal({ token, sweepstakeName, isOpen, onClose }: ShareModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<Format>('square')
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const imageUrl = `/api/leaderboard/image?token=${encodeURIComponent(token)}&format=${selectedFormat}`
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `${sweepstakeName}-leaderboard-${selectedFormat}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download image:', error)
    } finally {
      setDownloading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-[#E5EDEA]">
          <h2 className="font-heading font-bold text-pitch text-lg tracking-tight">Share the leaderboard</h2>
          <p className="text-sm text-mid mt-1">Download and share on social media.</p>
        </div>

        <div className="px-6 py-6 space-y-4">
          {(Object.entries(FORMATS) as [Format, (typeof FORMATS)['square']][]).map(([format, details]) => (
            <label key={format} className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-light transition">
              <input
                type="radio"
                name="format"
                value={format}
                checked={selectedFormat === format}
                onChange={() => setSelectedFormat(format)}
                className="mt-1 w-4 h-4 accent-pitch shrink-0 cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-medium text-pitch text-sm">{details.label}</p>
                <p className="text-xs text-mid mt-0.5">{details.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-[#E5EDEA] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#E5EDEA] text-pitch font-medium text-sm hover:bg-light transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-lime text-pitch font-medium text-sm hover:bg-[#b8e03d] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? 'Downloading…' : 'Download →'}
          </button>
        </div>
      </div>
    </div>
  )
}
