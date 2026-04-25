'use client'

import { useEffect, useState } from 'react'
import type { TimelineEvent } from '@/app/api/headcoachadmin/recent-events/route'

interface EventTimelineProps {
  initialEvents: TimelineEvent[]
}

function formatRelativeTime(date: string): string {
  const now = new Date()
  const eventDate = new Date(date)
  const seconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function EventItem({ event }: { event: TimelineEvent }) {
  const [relativeTime, setRelativeTime] = useState(() => formatRelativeTime(event.created_at))

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(event.created_at))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [event.created_at])

  const baseClasses = 'flex gap-3 py-3 px-3 border-b border-[#E5EDEA] last:border-b-0 hover:bg-light/50 transition-colors'

  if (event.type === 'organiser') {
    return (
      <div className={baseClasses}>
        <div className="shrink-0 text-lg">🏢</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-pitch truncate">{event.name}</p>
          <p className="text-xs text-mid truncate">{event.email}</p>
          <p className="text-xs text-[#C0CFC8] mt-1">Organiser joined</p>
        </div>
        <div className="text-xs text-mid shrink-0 whitespace-nowrap">{relativeTime}</div>
      </div>
    )
  }

  if (event.type === 'participant') {
    return (
      <div className={baseClasses}>
        <div className="shrink-0 text-lg">👤</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-pitch truncate">{event.participantName}</p>
          <p className="text-xs text-mid truncate">{event.sweepstakeName}</p>
          <p className="text-xs text-[#C0CFC8] mt-1">Joined sweepstake</p>
        </div>
        <div className="text-xs text-mid shrink-0 whitespace-nowrap">{relativeTime}</div>
      </div>
    )
  }

  if (event.type === 'draw') {
    return (
      <div className={baseClasses}>
        <div className="shrink-0 text-lg">🎯</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-pitch truncate">{event.sweepstakeName}</p>
          <p className="text-xs text-mid">{event.participantCount} participant{event.participantCount !== 1 ? 's' : ''}</p>
          <p className="text-xs text-[#C0CFC8] mt-1">Draw completed</p>
        </div>
        <div className="text-xs text-mid shrink-0 whitespace-nowrap">{relativeTime}</div>
      </div>
    )
  }

  return null
}

export function EventTimeline({ initialEvents }: EventTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/headcoachadmin/recent-events')
        if (!res.ok) return
        const data = await res.json()
        setEvents(data)
      } catch (error) {
        console.error('Failed to fetch events:', error)
      }
    }

    const interval = setInterval(fetchEvents, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-xl border border-[#E5EDEA] overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#E5EDEA] bg-light">
        <h3 className="text-xs font-semibold text-mid uppercase tracking-wide">Live activity</h3>
      </div>

      {events.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-sm text-mid">No recent activity</div>
      ) : (
        <div className="overflow-y-auto flex-1">
          {events.map(event => (
            <EventItem key={`${event.type}-${event.id}`} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
