'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AssignmentModeSelector } from '@/components/dashboard/AssignmentModeSelector'
import { PrizesSection, type PrizeRow } from './PrizesSection'

type Mode = 'random' | 'auto' | 'manual'
type TeamsPerParticipant = 'one' | 'all'

interface Props {
  sweepstakeId: string
  initialName: string
  initialEntryFee: number
  initialMode: Mode
  initialImageUrl: string | null
  initialTeamsPerParticipant: TeamsPerParticipant
  initialPrizes: PrizeRow[]
  drawDone: boolean
  status: string
}

export function SettingsClient({
  sweepstakeId,
  initialName,
  initialEntryFee,
  initialMode,
  initialImageUrl,
  initialTeamsPerParticipant,
  initialPrizes,
  drawDone,
  status,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  // ── Photo ────────────────────────────────────────────────────────────────
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { setUploadError('Please upload a JPEG, PNG, or WebP image.'); return }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image must be under 5 MB.'); return }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${sweepstakeId}/${Date.now()}.${ext}`

    if (imageUrl) {
      const oldPath = imageUrl.split('/sweepstake-images/')[1]
      if (oldPath) await supabase.storage.from('sweepstake-images').remove([oldPath])
    }

    const { error: uploadErr } = await supabase.storage.from('sweepstake-images').upload(path, file, { upsert: false })
    if (uploadErr) { setUploadError(uploadErr.message); setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from('sweepstake-images').getPublicUrl(path)
    await supabase.from('sweepstakes').update({ image_url: publicUrl }).eq('id', sweepstakeId)
    setImageUrl(publicUrl)
    setUploading(false)
    router.refresh()
  }

  async function handleRemovePhoto() {
    if (!imageUrl) return
    const oldPath = imageUrl.split('/sweepstake-images/')[1]
    if (oldPath) await supabase.storage.from('sweepstake-images').remove([oldPath])
    await supabase.from('sweepstakes').update({ image_url: null }).eq('id', sweepstakeId)
    setImageUrl(null)
    router.refresh()
  }

  // ── Basic settings ───────────────────────────────────────────────────────
  const [name, setName] = useState(initialName)
  const [entryFee, setEntryFee] = useState(initialEntryFee > 0 ? String(initialEntryFee) : '')
  const [savingBasic, setSavingBasic] = useState(false)
  const [savedBasic, setSavedBasic] = useState(false)
  const [saveErrorBasic, setSaveErrorBasic] = useState('')

  async function handleSaveBasic(e: React.FormEvent) {
    e.preventDefault()
    setSavingBasic(true)
    setSavedBasic(false)
    setSaveErrorBasic('')
    const fee = entryFee.trim() === '' ? 0 : parseFloat(entryFee)
    const { error } = await supabase
      .from('sweepstakes')
      .update({ name: name.trim(), entry_fee: isNaN(fee) || fee < 0 ? 0 : fee })
      .eq('id', sweepstakeId)
    setSavingBasic(false)
    if (error) { setSaveErrorBasic(error.message) } else {
      setSavedBasic(true); router.refresh(); setTimeout(() => setSavedBasic(false), 3000)
    }
  }

  // ── Draw settings ────────────────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>(initialMode)
  const [teamsPerParticipant, setTeamsPerParticipant] = useState<TeamsPerParticipant>(initialTeamsPerParticipant)
  const [savingDraw, setSavingDraw] = useState(false)
  const [savedDraw, setSavedDraw] = useState(false)
  const [saveErrorDraw, setSaveErrorDraw] = useState('')

  async function handleSaveDraw(e: React.FormEvent) {
    e.preventDefault()
    setSavingDraw(true)
    setSavedDraw(false)
    setSaveErrorDraw('')
    const { error } = await supabase
      .from('sweepstakes')
      .update({ assignment_mode: mode, teams_per_participant: teamsPerParticipant })
      .eq('id', sweepstakeId)
    setSavingDraw(false)
    if (error) { setSaveErrorDraw(error.message) } else {
      setSavedDraw(true); router.refresh(); setTimeout(() => setSavedDraw(false), 3000)
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteError, setDeleteError] = useState('')

  async function handleDelete() {
    if (deleteConfirm !== name.trim()) { setDeleteError('Name doesn\'t match — type it exactly to confirm.'); return }
    setDeleting(true)
    setDeleteError('')
    const { error } = await supabase.from('sweepstakes').delete().eq('id', sweepstakeId)
    if (error) { setDeleteError(error.message); setDeleting(false) } else { router.push('/dashboard') }
  }

  return (
    <div className="max-w-2xl space-y-8">

      {/* ── Basic settings ── */}
      <form onSubmit={handleSaveBasic} className="bg-white rounded-xl border border-[#E5EDEA] divide-y divide-[#E5EDEA]">

        {/* Cover photo */}
        <div className="p-6">
          <p className="text-sm font-medium text-pitch mb-1">Cover photo <span className="text-mid font-normal">(optional)</span></p>
          <p className="text-xs text-mid mb-4">Shown as a banner on your public leaderboard. JPEG, PNG or WebP, max 5 MB.</p>
          {imageUrl ? (
            <div className="space-y-3">
              <img src={imageUrl} alt="Cover" className="w-full h-40 object-cover rounded-xl border border-[#E5EDEA]" />
              <div className="flex gap-3">
                <label className="cursor-pointer text-xs font-medium text-grass hover:underline">
                  Change photo
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                </label>
                <button type="button" onClick={handleRemovePhoto} className="text-xs text-mid hover:text-red-500 transition-colors">Remove</button>
              </div>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#D1D9D5] rounded-xl px-6 py-10 cursor-pointer hover:border-grass hover:bg-grass/5 transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-mid">
                <path d="M6 22l6-8 5 6 3-4 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="2" y="4" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="21" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <p className="text-sm text-mid">{uploading ? 'Uploading…' : 'Click to upload a photo'}</p>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          )}
          {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
        </div>

        {/* Name */}
        <div className="p-6">
          <label htmlFor="s-name" className="block text-sm font-medium text-pitch mb-1.5">Sweepstake name</label>
          <input
            id="s-name"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
          />
        </div>

        {/* Entry fee */}
        <div className="p-6">
          <label htmlFor="s-fee" className="block text-sm font-medium text-pitch mb-1">
            Entry fee per participant <span className="text-mid font-normal">(optional)</span>
          </label>
          <p className="text-xs text-mid mb-3">How much each person pays to enter. You collect payments — we track who&apos;s paid.</p>
          <div className="relative max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mid text-sm">£</span>
            <input
              id="s-fee"
              type="number"
              min="0"
              step="0.50"
              value={entryFee}
              onChange={e => setEntryFee(e.target.value)}
              placeholder="0.00"
              className="w-full pl-7 pr-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-grass focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Save basic */}
        <div className="p-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={savingBasic || !name.trim()}
            className="bg-lime text-pitch font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingBasic ? 'Saving…' : 'Save changes'}
          </button>
          {savedBasic && <span className="text-sm text-grass font-medium">✓ Saved</span>}
          {saveErrorBasic && <span className="text-sm text-red-500">{saveErrorBasic}</span>}
        </div>
      </form>

      {/* ── Prizes ── */}
      <PrizesSection sweepstakeId={sweepstakeId} initialPrizes={initialPrizes} />

      {/* ── Draw settings ── */}
      <form onSubmit={handleSaveDraw} className="bg-white rounded-xl border border-[#E5EDEA] divide-y divide-[#E5EDEA]">

        {/* Teams per participant */}
        <div className="p-6">
          <label className="block text-sm font-medium text-pitch mb-1">
            Teams per participant
            {drawDone && <span className="ml-2 text-xs font-normal text-mid bg-light px-2 py-0.5 rounded-full">Locked — draw completed</span>}
          </label>
          {!drawDone && <p className="text-xs text-mid mb-3">Can only be changed before the draw is run.</p>}
          <div className={drawDone ? 'opacity-50 pointer-events-none mt-3' : 'mt-3'}>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'one', icon: '1️⃣', label: 'One team each', desc: 'Each participant gets 1 team.' },
                { value: 'all', icon: '📊', label: 'Distribute all', desc: 'Spread all teams across participants.' },
              ] as { value: TeamsPerParticipant; icon: string; label: string; desc: string }[]).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTeamsPerParticipant(opt.value)}
                  disabled={drawDone}
                  className={`text-left p-4 rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${teamsPerParticipant === opt.value ? 'border-grass bg-grass/5' : 'border-[#D1D9D5] bg-white hover:border-mid'}`}
                >
                  <span className="text-2xl mb-2 block">{opt.icon}</span>
                  <p className="text-sm font-medium text-pitch mb-1">{opt.label}</p>
                  <p className="text-xs text-mid">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assignment mode */}
        <div className="p-6">
          <label className="block text-sm font-medium text-pitch mb-1">
            Team assignment mode
            {drawDone && <span className="ml-2 text-xs font-normal text-mid bg-light px-2 py-0.5 rounded-full">Locked — draw completed</span>}
          </label>
          {!drawDone && <p className="text-xs text-mid mb-3">Can only be changed before the draw is run.</p>}
          <div className={drawDone ? 'opacity-50 pointer-events-none mt-3' : 'mt-3'}>
            <AssignmentModeSelector value={mode} onChange={setMode} />
          </div>
        </div>

        {/* Save draw */}
        <div className="p-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={savingDraw || drawDone}
            className="bg-lime text-pitch font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#b8e03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingDraw ? 'Saving…' : 'Save draw settings'}
          </button>
          {savedDraw && <span className="text-sm text-grass font-medium">✓ Saved</span>}
          {saveErrorDraw && <span className="text-sm text-red-500">{saveErrorDraw}</span>}
        </div>
      </form>

      {/* ── Danger zone ── */}
      {status !== 'complete' && (
        <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-100 bg-red-50">
            <h2 className="font-semibold text-red-700 text-sm">Danger zone</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-pitch mb-1">Delete this sweepstake</p>
              <p className="text-xs text-mid mb-4">Permanently deletes the sweepstake, all participants, and all assignments. This cannot be undone.</p>
              <label className="block text-xs font-medium text-pitch mb-1.5">
                Type <span className="font-mono bg-light px-1.5 py-0.5 rounded">{name}</span> to confirm
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={e => { setDeleteConfirm(e.target.value); setDeleteError('') }}
                  placeholder="Type sweepstake name"
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#D1D9D5] text-pitch placeholder:text-mid focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                />
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting || deleteConfirm !== name.trim()}
                  className="shrink-0 bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
              {deleteError && <p className="text-xs text-red-500 mt-1.5">{deleteError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
