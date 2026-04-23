'use client'

export function createSoundManager() {
  const AudioContextClass = typeof window !== 'undefined' ? (window.AudioContext || (window as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) : null
  const audioContext = AudioContextClass ? new AudioContextClass() : null

  return {
    playSpin: () => {
      if (!audioContext) return
      const now = audioContext.currentTime
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.connect(gain)
      gain.connect(audioContext.destination)

      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

      osc.start(now)
      osc.stop(now + 0.1)
    },

    playLand: () => {
      if (!audioContext) return
      const now = audioContext.currentTime
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.connect(gain)
      gain.connect(audioContext.destination)

      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.2)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

      osc.start(now)
      osc.stop(now + 0.2)
    },
  }
}
