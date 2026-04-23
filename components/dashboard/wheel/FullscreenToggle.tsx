'use client'

import { useState, useEffect, useId } from 'react'

export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const id = useId()

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleToggleFullscreen = async () => {
    const elem = document.getElementById(id)
    if (!elem) return

    try {
      if (!isFullscreen) {
        await elem.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err)
    }
  }

  return (
    <>
      <div id={id} className="hidden" />
      <button
        onClick={handleToggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        className="text-pitch hover:text-grass transition-colors p-2"
      >
        {isFullscreen ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16H3v5h5v-2H5v-3zm9-16h5v2h-3v3h-2V0zm3 14h3v2h-5v-5h2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        )}
      </button>
    </>
  )
}
