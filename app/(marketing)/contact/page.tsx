'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const SUBJECTS = [
  'General question',
  'Something\'s broken',
  'Feature suggestion',
  'I want to say thanks',
  'Other',
]

export default function ContactPage() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">⚽</div>
          <h2 className="font-heading text-2xl font-bold text-pitch tracking-tight">Message received!</h2>
          <p className="text-mid leading-relaxed">
            We&apos;ll get back to you soon. Unless you&apos;re complaining about your team draw,
            in which case we refer you back to the very large <strong className="text-pitch">RANDOM</strong> disclaimer
            on the page you just came from.
          </p>
          <button
            onClick={() => { setStatus('idle'); setName(''); setEmail(''); setMessage(''); setSubject(SUBJECTS[0]) }}
            className="text-sm text-grass font-medium hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-16 md:py-24">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-medium text-grass uppercase tracking-widest mb-3">Get in touch</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-pitch tracking-tight leading-tight mb-4">
          Say hello. 👋
        </h1>
        <p className="text-lg text-mid leading-relaxed">
          Questions, feedback, broken things — we&apos;re all ears. Drop us a message and we&apos;ll get back to you.
        </p>
      </div>

      {/* Ground rules card */}
      <div className="bg-pitch rounded-xl p-5 mb-8 flex gap-4 items-start">
        <span className="text-2xl shrink-0">🎲</span>
        <div>
          <p className="font-heading font-bold text-white text-sm mb-1">One ground rule</p>
          <p className="text-white/60 text-sm leading-relaxed">
            No whinging about team selections. The draw is completely random — we promise we didn&apos;t
            give Brazil to someone on purpose. If you got San Marino, we&apos;re sorry. Kind of.
            The algorithm has no favourites, no grudges, and no idea who you support.
            That&apos;s literally the whole point.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-pitch mb-1.5">Your name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Callum"
              className="w-full px-4 py-3 rounded-xl border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pitch mb-1.5">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pitch mb-1.5">Subject</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#D1D9D5] text-pitch focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm bg-white"
          >
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-pitch mb-1.5">Message</label>
          <textarea
            required
            rows={6}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="What's on your mind? (Team draw complaints will be politely ignored.)"
            className="w-full px-4 py-3 rounded-xl border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm resize-none"
          />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
            Something went wrong. Please try again or email us directly at headcoach@playdrawr.co.uk
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-lime text-pitch font-heading font-bold text-base py-3.5 rounded-xl hover:bg-[#b8e03d] transition-colors tracking-tight disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message →'}
        </button>

        <p className="text-xs text-mid text-center">
          We&apos;ll reply to your email address. No spam, ever.
        </p>
      </form>
    </div>
  )
}
