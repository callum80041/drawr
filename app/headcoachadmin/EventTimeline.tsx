'use client'

import { useEffect, useState } from 'react'
import type { TimelineEvent } from '@/app/api/headcoachadmin/recent-events/route'

interface EventTimelineProps {
  initialEvents: TimelineEvent[]
}

function formatTimeGMT1(date: string): string {
  const eventDate = new Date(date)
  return eventDate.toLocaleString('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function EventItem({ event }: { event: TimelineEvent }) {
  const time = formatTimeGMT1(event.created_at)

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
        <div className="text-xs text-mid shrink-0 whitespace-nowrap">{time}</div>
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
        <div className="text-xs text-mid shrink-0 whitespace-nowrap">{time}</div>
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
        <div className="text-xs text-mid shrink-0 whitespace-nowrap">{time}</div>
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
