# playdrawr — Pro Plan Feature Specification

> This document defines every Pro feature for playdrawr. It is the source of truth for implementation. Read alongside `SITE_DOCUMENTATION.md` and `CLAUDE.md` before writing any code.

---

## Overview

The Pro plan unlocks enhanced features for sweepstake organisers. Pro status lives on the **sweepstake** (not the organiser account) — an organiser can have a mix of free and Pro sweepstakes.

**Pro entitlement is determined by `isSweepstakePro()` in `lib/utils/pro.ts`.**

All existing sweepstakes have been backfilled as Pro via migration. New sweepstakes default to free.

---

## Pro vs Free at a Glance

| Feature | Free | Pro |
|---|---|---|
| Participants | Up to 48 | Up to 200 |
| "Powered by playdrawr" badge | Shown | Hidden |
| CSV export | No | Yes |
| Custom leaderboard URL | No | Yes |
| Logo upload | No | Yes |
| TV mode leaderboard | No | Yes |
| Email notifications | No | Yes |
| Leaderboard image export | Watermarked | Clean / branded |
| Leaderboard widget (iframe) | No | Yes |

---

## Feature 1 — Participant Cap

### What it does
Free sweepstakes are capped at 48 participants. Pro sweepstakes are capped at 200.

### Where it is enforced
- **Client-side:** `ParticipantsClient.tsx` — disables the add participant UI and shows a cap warning when the limit is reached.
- **Server-side:** `app/api/dashboard/[id]/participants/add/route.ts` — returns `429` if the cap would be exceeded. This is the authoritative check.

### Implementation detail
```typescript
const FREE_PLAN_CAP = 48
const PRO_PLAN_CAP = 200
const participantCap = isSweepstakePro(sweepstake) ? PRO_PLAN_CAP : FREE_PLAN_CAP
```

### UI behaviour
- When the cap is reached on a **free** sweepstake, show an upgrade prompt inline: "You've reached the 48-participant limit. Upgrade to Pro for up to 200 participants."
- When the cap is reached on a **Pro** sweepstake, show: "You've reached the 200-participant limit."
- Do not show a cap warning until the organiser is within 5 of the limit.

---

## Feature 2 — "Powered by playdrawr" Branding Removal

### What it does
Free sweepstakes show a subtle footer badge on the participant leaderboard (`/s/[token]`). Pro sweepstakes hide it.

### Where the badge appears
- `/s/[token]` — live leaderboard footer
- `/final/[token]` — final leaderboard footer
- `/join/[token]` — self-signup page footer
- Draw result emails (below the team assignment)

### Implementation detail
Pass `isPro` as a prop to the relevant layout/component. Conditionally render the badge:

```tsx
{!isPro && (
  <footer className="text-center py-4">
    <a href="https://playdrawr.co.uk" className="text-mid text-xs font-body">
      Powered by playdrawr
    </a>
  </footer>
)}
```

### Email detail
In draw result email templates, include the badge as a small linked image/text block at the bottom only when `isPro` is false. Pass `isPro` into the template function alongside the existing `isEurovision` flag.

---

## Feature 3 — CSV Export

### What it does
Allows the organiser to download a CSV of all participants in their sweepstake, including their assigned team and paid status.

### Where it lives
`/dashboard/[id]/participants` — a "Download CSV" button, visible only on Pro sweepstakes, positioned top-right of the participants table.

### CSV columns
```
Name, Email, Paid, Team, Flag, Signed Up At
```

- Email is blank if the participant did not provide one.
- Paid is `Yes` or `No`.
- Flag is the emoji or URL from `assignments.team_flag`.
- Signed Up At is formatted as `DD/MM/YYYY HH:mm` (British format, GMT).
- If no draw has been run yet, Team and Flag columns are blank.

### API route
`GET /api/dashboard/[id]/export/participants`

- Requires authenticated session.
- Verifies the organiser owns the sweepstake.
- Verifies `is_pro` on the sweepstake.
- Returns `Content-Type: text/csv` with `Content-Disposition: attachment; filename="[sweepstake-name]-participants.csv"`.
- Uses service client to join participants with assignments.

### Error states
- Non-Pro sweepstake attempting export: `403` with message "CSV export is a Pro feature."
- No participants yet: return CSV with headers only (empty body), not an error.

---

## Feature 4 — Custom Leaderboard URLs

### What it does
Pro organisers can set a human-readable slug for their sweepstake. This replaces the opaque share token in the leaderboard URL.

**Example:** `/s/my-office-wc-2026` instead of `/s/a8f3k2`

The original token URL continues to work — the slug is an alias, not a replacement.

### Where it is configured
`/dashboard/[id]/settings` — a new "Custom URL" field under the sharing section.

### Database change
```sql
ALTER TABLE sweepstakes ADD COLUMN IF NOT EXISTS custom_slug text UNIQUE NULL;
```

### Slug rules
- 3–40 characters
- Lowercase letters, numbers, and hyphens only
- Cannot start or end with a hyphen
- Must be globally unique across all sweepstakes
- Regex: `^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$`
- Reserved words that cannot be used as slugs: `demo`, `demo2026`, `demoeurovision`, `admin`, `api`, `join`, `final`, `blog`, `dashboard`, `tv`

### Routing
`app/s/[token]/page.tsx` currently resolves by `share_token`. Update the lookup to check `custom_slug` first, then fall back to `share_token`:

```typescript
const sweepstake = await supabase
  .from('sweepstakes')
  .select('*')
  .or(`share_token.eq.${token},custom_slug.eq.${token}`)
  .single()
```

Apply the same dual-lookup to `/final/[token]` and `/tv/[token]`.

### UI behaviour
- Show the field only on Pro sweepstakes. Free organisers see: "Custom URLs are a Pro feature."
- Validate slug format client-side before saving.
- Check availability via `GET /api/dashboard/[id]/slug/check?slug=my-office-wc` — returns `{ available: boolean }`.
- On save, show the full URL preview: `playdrawr.co.uk/s/my-office-wc`
- If the slug is taken, show: "That URL is already in use — try something different."

---

## Feature 5 — Logo Upload

### What it does
Pro organisers can upload a logo that appears at the top of the participant leaderboard and in the draw result email.

### Where it is configured
`/dashboard/[id]/settings` — a "Leaderboard logo" upload section.

### Storage
Use Supabase Storage. Bucket: `sweepstake-logos` (public read, authenticated write).

File path: `{sweepstake_id}/logo.{ext}`

### Database change
```sql
ALTER TABLE sweepstakes ADD COLUMN IF NOT EXISTS logo_url text NULL;
```

### Upload constraints
- Accepted formats: PNG, JPG, WebP
- Max file size: 2MB
- Displayed at max 200px wide, auto height, on the leaderboard
- Stored as-is (no server-side resizing in MVP — advise organiser of size in UI)

### Where the logo appears
- `/s/[token]` — top of leaderboard, above the sweepstake name
- `/final/[token]` — same position
- `/tv/[token]` — top of TV mode view
- Draw result emails — above the team assignment block (inline base64 or hosted URL)

### UI behaviour
- Show a preview of the uploaded logo immediately after upload.
- Include a "Remove logo" option that clears `logo_url` and deletes from storage.
- If no logo is uploaded, render nothing (do not show a placeholder).

---

## Feature 6 — Email Notifications

### What it does
Participants with an email address receive automated notifications for key moments during the tournament.

### Notification types

| Trigger | Subject | Recipient |
|---|---|---|
| Score update (their team scores) | "⚽ [Team] just scored!" | Participant |
| Their team is playing today | "🏟️ [Team] kick off at [time] today" | Participant |
| Someone takes the lead on the leaderboard | "👀 [Name] has taken the lead" | All participants with email |
| Tournament complete | "🏆 Final standings are in" | All participants with email |

### How it is triggered
The existing daily cron (`/api/cron/sync-daily`) runs at 6 AM. Extend it to:

1. Check for matches kicking off that day — send "team is playing" notifications for affected participants.
2. After syncing scores, check for score changes — send "team scored" notifications.
3. After score update, recalculate leaderboard — if the leader has changed, send leaderboard change notifications.

### Opt-in behaviour
- Notifications are **opt-in per sweepstake**, not global.
- When a participant joins via `/join/[token]`, show a checkbox: "Notify me by email during the tournament" (checked by default if they provide an email).
- Store preference in `participants.notify_enabled` (boolean, default true if email provided).

### Database change
```sql
ALTER TABLE participants ADD COLUMN IF NOT EXISTS notify_enabled boolean NOT NULL DEFAULT true;
```

### Unsubscribe
Every notification email includes an unsubscribe link: `/unsubscribe?pid=[participant_id]&token=[hmac]`

The HMAC is `HMAC-SHA256(participant_id, RESEND_API_KEY)` — no new secret required.

`/api/unsubscribe` sets `notify_enabled = false` for that participant.

### Pro enforcement
Only send notifications for sweepstakes where `is_pro = true`. Free sweepstakes do not trigger any notification emails.

### Email templates
Create in `lib/email/templates/`:
- `notification-team-playing.ts`
- `notification-score-update.ts`
- `notification-leaderboard-change.ts`
- `notification-tournament-complete.ts`

All accept `isEurovision?: boolean` and follow the same HTML structure as existing templates.

---

## Feature 7 — TV Mode Leaderboard

### What it does
A full-screen, auto-refreshing leaderboard view optimised for a 16:9 display — no navigation, no clutter. Designed to be opened on a break room TV or presentation screen.

### URL
`/tv/[token]` — works with both `share_token` and `custom_slug`.

### Access control
- Pro sweepstakes only.
- No authentication required (public like `/s/[token]`).
- If accessed on a free sweepstake, show a simple full-screen message: "TV mode is available on Pro sweepstakes."

### Layout
- Full-screen, dark background (`#0a0f0a` or `pitch` token)
- No header, no footer, no navigation
- Sweepstake name and logo (if set) at the top, centred
- Leaderboard table fills the viewport — rows scale to fill available height
- Columns: Rank, Name, Team + Flag, Points, +/- since last refresh
- Auto-refreshes every 30 seconds (client-side `setInterval` with a `router.refresh()` or SWR revalidation)
- A subtle "Live" indicator with a pulsing dot, top-right corner
- Last updated timestamp, bottom-right, small text

### Animations
- When scores update between refreshes, rows that move up animate upward (CSS transition on `order` or absolute positioning with `top` interpolation).
- Point changes flash briefly in `lime` (positive) or red (negative).
- Keep animations subtle — this runs continuously on a TV, not a phone.

### Typography
- Use `font-heading` (Syne) for ranks and points — large, bold, readable from distance
- Use `font-body` (DM Sans) for names and teams
- Minimum font size: 1.2rem for any text on screen
- Row height should be generous — aim for max 16 rows visible at once; scroll if more

### Dashboard link
In `/dashboard/[id]`, add a "TV Mode" button alongside the existing leaderboard link. Only show it on Pro sweepstakes. Opens in a new tab.

---

## Feature 8 — Leaderboard Image Export

### What it does
Generates a static PNG snapshot of the current leaderboard standings, sized and formatted for social sharing.

### Output sizes
| Format | Dimensions | Use case |
|---|---|---|
| Square | 1080×1080px | Instagram, general sharing |
| Story | 1080×1920px | Instagram Stories, WhatsApp Status |
| Wide | 1200×630px | Twitter/X, LinkedIn |

### Access
- **Free sweepstakes:** Image includes a "playdrawr.co.uk" watermark in the bottom-right corner.
- **Pro sweepstakes:** Clean image. If a logo is uploaded, it appears top-left.

### Where it lives
`/s/[token]` — a "Share" button below the leaderboard opens a modal with format options and a download button.

### Technical approach
Use Vercel's `@vercel/og` (Satori) to generate the image server-side as a PNG.

API route: `GET /api/leaderboard/image?token=[token]&format=square|story|wide`

- Fetches current leaderboard data
- Renders a fixed template using Satori (JSX → PNG)
- Returns `image/png` with appropriate `Content-Disposition`

### Template design
- Dark background (`#0a0f0a`)
- playdrawr logo top-right (or organiser logo top-left on Pro)
- Sweepstake name as heading
- Top 10 participants listed with rank, name, flag, points
- "More at playdrawr.co.uk/s/[token]" footer line (free) or custom slug (Pro)
- Watermark for free: semi-transparent "playdrawr.co.uk" diagonal text overlay

### Constraints
- Satori does not support all CSS — use only supported properties (flexbox, basic typography, backgrounds, borders). No CSS grid, no `overflow: scroll`.
- Fonts must be loaded as ArrayBuffer and passed to Satori explicitly. Use Syne and DM Sans.
- Keep the template simple — Satori is strict about unsupported features.

---

## Feature 9 — Leaderboard Widget (iframe Embed)

### What it does
Provides an embeddable iframe snippet so organisers can drop the live leaderboard into a Notion page, company intranet, or internal site.

### URL
`/s/[token]?embed=true` — the `embed` query param strips all navigation, header, and footer, rendering just the leaderboard table.

### Access
Pro sweepstakes only. Free sweepstakes render a prompt: "Upgrade to Pro to embed this leaderboard."

### Implementation
In `/s/[token]/page.tsx`, read the `embed` search param. When true:
- Remove the site header and footer
- Remove the "Powered by playdrawr" badge (embed implies Pro)
- Remove the share/export buttons
- Add `X-Frame-Options: SAMEORIGIN` header — **remove this** for the embed route so iframes work cross-origin. Use `Content-Security-Policy: frame-ancestors *` instead.

### Snippet shown to organiser
In `/dashboard/[id]`, a "Embed leaderboard" section shows the copy-ready snippet:

```html
<iframe
  src="https://playdrawr.co.uk/s/[token]?embed=true"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 8px;"
></iframe>
```

### Behaviour
- Auto-refreshes every 60 seconds inside the iframe (same SWR revalidation as the main leaderboard).
- Responsive — fills the width of whatever container it's placed in.
- Dark background matches the leaderboard design so it embeds cleanly on dark intranets.

---

## Database Migration Summary

All changes required across all features:

```sql
-- Feature 1+2: Pro flag (already in foundation migration)
ALTER TABLE sweepstakes ADD COLUMN IF NOT EXISTS is_pro boolean NOT NULL DEFAULT false;
ALTER TABLE sweepstakes ADD COLUMN IF NOT EXISTS pro_expires_at timestamptz NULL;
UPDATE sweepstakes SET is_pro = true; -- backfill existing

-- Feature 4: Custom slug
ALTER TABLE sweepstakes ADD COLUMN IF NOT EXISTS custom_slug text UNIQUE NULL;

-- Feature 5: Logo
ALTER TABLE sweepstakes ADD COLUMN IF NOT EXISTS logo_url text NULL;

-- Feature 6: Notification opt-in
ALTER TABLE participants ADD COLUMN IF NOT EXISTS notify_enabled boolean NOT NULL DEFAULT true;
```

Run as separate numbered migrations in `supabase/migrations/`.

---

## TypeScript Type Updates

Extend the existing `Sweepstake` type (do not duplicate):

```typescript
type Sweepstake = {
  // ... existing fields ...
  is_pro: boolean
  pro_expires_at: string | null
  custom_slug: string | null
  logo_url: string | null
}
```

Extend the existing `Participant` type:

```typescript
type Participant = {
  // ... existing fields ...
  notify_enabled: boolean
}
```

---

## Pro Utility Helper

`lib/utils/pro.ts` — single source of truth for Pro entitlement:

```typescript
export function isSweepstakePro(sweepstake: {
  is_pro: boolean
  pro_expires_at: string | null
}): boolean {
  if (!sweepstake.is_pro) return false
  if (!sweepstake.pro_expires_at) return true
  return new Date(sweepstake.pro_expires_at) > new Date()
}
```

Import this everywhere Pro status is checked. Never query `is_pro` directly in components.

---

## Build & Implementation Order

Implement features in this sequence. Each builds on the previous.

| Phase | Feature | Rationale |
|---|---|---|
| 1 | Pro flag + `isSweepstakePro()` | Everything depends on this |
| 2 | Participant cap (200) | Unblocks Pro signups immediately |
| 3 | Branding removal | Visible Pro benefit, trivial to ship |
| 4 | CSV export | High organiser demand, one afternoon |
| 5 | Custom URLs | Low effort, feels premium |
| 6 | Logo upload | Before group stage |
| 7 | TV mode | Weekend project, high viral potential |
| 8 | Email notifications | During tournament when scores are live |
| 9 | Image export | Mid-tournament |
| 10 | Widget embed | Mid-tournament |

---

## Code Standards (Reminders)

- British English in all strings, comments, and UI copy
- No gambling words: bet, odds, stake, wager — use "entry fee" for payments
- TypeScript throughout — no `any` without an explanatory comment
- Extend existing types and components — no parallel systems
- Production-ready only — no TODOs, console.logs, placeholder logic
- Run `npm run build` before declaring any feature done
- One commit per feature with an imperative commit message

---

*Last updated: 25 April 2026*
*Maintainer: callum80041*
