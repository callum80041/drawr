# playdrawr — Site Documentation

> Comprehensive guide for Claude Chat and future developers to understand the playdrawr codebase and product.

---

## 1. Project Overview

**playdrawr** (`playdrawr.co.uk`) is a free online sweepstake platform for tournament events. It lets organisers create sweepstakes, invite participants, run random draws, and track live leaderboards with auto-scoring.

**Primary focus:** World Cup 2026 (commercial priority). Eurovision 2026 fully supported.

**Key value prop:** Dead simple—no sign-up required for participants, random draws are provably fair, automatic scoring from live match data.

---

## 2. Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16 App Router, TypeScript, Tailwind CSS |
| **Backend** | Next.js API routes, TypeScript |
| **Database** | Supabase (PostgreSQL) with RLS policies |
| **Auth** | Supabase Auth (PKCE flow + session cookies) |
| **Email** | Resend (transactional) |
| **Hosting** | Vercel (auto-deploy on git push) |
| **Cron** | Vercel Cron Jobs (1/day limit on Hobby plan) |

**Important:** Check `node_modules/next/dist/docs/` before using Next.js APIs—this is v16 with breaking changes from earlier versions.

---

## 3. Brand & Writing Rules

- **Name:** Always lowercase `playdrawr` (never `Playdrawr`, `PlayDrawr`)
- **Language:** British English throughout (colour, organiser, favourite, recognised)
- **Tone:** Confident, friendly, direct, slightly British. No corporate waffle.
- **Forbidden words:** Never use "bet", "odds", "wager", "stake" (gambling terms). Use "entry fee" for payments.
- **Colours (Tailwind tokens):**
  - `pitch` — dark green (primary)
  - `grass` — mid green (accent)
  - `lime` — yellow-green (CTAs)
  - `mid` — muted text
  - `light` — off-white background
- **Fonts:** `font-heading` (Syne) for titles, `font-body` (DM Sans) for body text
- **Emoji:** Only where existing codebase already uses them; no gratuitous additions

---

## 4. Architecture & Structure

### Public Routes (`app/(marketing)/`)
- `/` — Homepage with hero, tournament cards, `HeroDrawAnimation` component
- `/worldcup`, `/eurovision` — Tournament landing pages
- `/blog/[slug]` — Blog posts
- Demo sweepstakes: `share_token = 'demo2026'` (WC) and `share_token = 'demoeurovision'` (Eurovision)

### Organiser Dashboard (`app/dashboard/`)
- `/dashboard/new` — Create sweepstake (`CreateForm.tsx`); redirects to `?created=1` on success
- `/dashboard/[id]` — Overview; shows "Get people in" banner when no participants
- `/dashboard/[id]/participants` — Add manually or share self-signup link
- `/dashboard/[id]/draw` — Run random draw
- `/dashboard/[id]/settings` — Edit sweepstake settings
- `/dashboard/[id]/results` — View scores and leaderboard after draw

### Participant Flow
- `/join/[token]` — Self-signup (name + optional email, no account needed)
- `/s/[token]` — Live leaderboard with scores
- `/final/[token]` — Final leaderboard after tournament ends

### Admin Dashboard (`app/headcoachadmin/`)
- **Layout:** Two-column (metrics left, live activity timeline sticky right)
- **Metrics:** Traffic, organisers, sweepstakes, participants, growth trends (30-day)
- **Live Activity:** Last 20 events (organisers, participants, draws) with GMT+1 timestamps, auto-refresh 10s
- **Sections:** Bulk email, campaign management, email templates, organiser drill-down
- **Auth:** Supabase PKCE session + `hc_admin` cookie matching `ADMIN_PASSWORD` env var

### Email Templates (`lib/email/templates/`)

| File | Purpose |
|------|---------|
| `_header.ts` | Shared header blocks for WC and Eurovision |
| `sweepstake-created.ts` | Organiser confirmation after creating sweepstake |
| `participant-joined.ts` | Notifies organiser when someone joins |
| `invite.ts` | Sent to participant when manually added |
| `draw-complete.ts` / `draw-complete-eurovision.ts` | Team/country assignment after draw |
| `payment-chase.ts` | Entry fee reminder |
| `waitlist-promoted.ts` | Reserve → confirmed |
| `welcome.ts` | New organiser welcome |
| `campaign-wc.ts` | World Cup campaign emails (3 versions) |

All templates accept `isEurovision?: boolean` (defaults false) and return raw HTML strings.

---

## 5. Database Schema

### Core Tables

**organisers**
- `id` (uuid, pk)
- `user_id` (uuid, fk to auth.users)
- `name` (text)
- `email` (text)
- `plan` (text) — 'free' or 'pro'
- `created_at` (timestamp)
- `last_login_at` (timestamp, nullable)

**sweepstakes**
- `id` (uuid, pk)
- `organiser_id` (uuid, fk)
- `name` (text)
- `sweepstake_type` (text) — 'worldcup' or 'eurovision'
- `tournament_id` (integer) — 1 (WC) or 2 (Eurovision)
- `share_token` (text, unique) — used in public links
- `status` (text) — 'setup', 'active', 'complete'
- `entry_fee` (numeric, nullable) — GBP
- `assignment_mode` (text) — 'random' or 'manual'
- `draw_completed_at` (timestamp, nullable)
- `created_at` (timestamp)

**participants**
- `id` (uuid, pk)
- `sweepstake_id` (uuid, fk)
- `name` (text)
- `email` (text, nullable) — required to receive draw result email + qualify for prize draw
- `paid` (boolean)
- `signup_method` (text) — 'name', 'email', 'google', 'twitter'
- `created_at` (timestamp)

**assignments**
- `id` (uuid, pk)
- `sweepstake_id` (uuid, fk)
- `participant_id` (uuid, fk)
- `team_id` (integer, fk to teams.id)
- `team_name` (text)
- `team_flag` (text)

**teams** (seeded)
- `id` (integer, pk)
- `tournament_id` (integer) — 1 or 2
- `name` (text) — "England", "France", etc.
- `flag` (text) — emoji or URL
- `group_name` (text, nullable) — "Group A", etc.

**matches** (seeded, auto-synced)
- `id` (uuid, pk)
- `tournament_id` (integer)
- `team_1_id`, `team_2_id` (integer, fk)
- `team_1_goals`, `team_2_goals` (integer, nullable)
- `status` (text) — 'scheduled', 'live', 'completed'
- `kick_off_at` (timestamp)

**email_log** (audit trail)
- `id` (uuid, pk)
- `to_email` (text)
- `subject` (text)
- `template` (text)
- `resend_id` (text)
- `created_at` (timestamp)

**waitlist** (overflow)
- `id` (uuid, pk)
- `sweepstake_id` (uuid, fk)
- Similar structure to participants

### RLS Policies
- Organisers can only view/edit their own sweepstakes
- Participants can view their own assignments + leaderboard (via share_token)
- Public access to leaderboards via share_token
- Service role (admin) bypasses RLS for cron jobs

---

## 6. Supabase Clients

```typescript
// User-scoped (respects RLS)
const supabase = createClient()  // in browser
const supabase = createClient()  // in server (SSR)

// Service role (bypasses RLS—admin only)
const supabase = await createServiceClient()  // in Node/API
```

**Auth callback pattern** (`app/(auth)/auth/callback/route.ts`):
1. Create `NextResponse` redirect *first*
2. Create Supabase client and call `setAll()` to write session cookies to **both** `request.cookies` and `response.cookies`
3. Return the response

---

## 7. Business Rules

### Organiser Segments (mutually exclusive, based on best WC sweepstake)

| Segment | Condition |
|---------|-----------|
| No sweepstake | Zero World Cup sweepstakes |
| Low participants | Best WC sweepstake has 0–2 participants |
| Building | Best WC sweepstake has 3–9 participants |
| Qualified | 10+ participants |

### Prize Draw Rules
- **Organiser draw:** 1 × £50 Uber Eats voucher. Qualifies if WC sweepstake has 10+ by **11:59pm 30 April 2026**
- **Participant draw:** 1 × £25 Uber Eats voucher. Qualifies by joining with email address
- **Selection:** Random
- **Distribution:** 17 June 2026 (ahead of England's first game)
- **Scope:** WC only (Eurovision excluded)

### Free Plan Cap
- Max **48 participants** per sweepstake
- Enforced in `ParticipantsClient.tsx` (`FREE_PLAN_CAP = 48`)

### Email Rules
- Email optional at signup → no draw result email, ineligible for participant prize draw
- Email required to receive result notifications and qualify for prizes

---

## 8. API Routes

### Public
- `GET /api/join` → Redirect to `/join/[token]` with prefilled data
- `POST /api/email/...` → Webhook endpoints for match sync, results notifications

### Authenticated (requires session)
- `POST /api/dashboard/create` → Create sweepstake
- `POST /api/dashboard/[id]/draw` → Execute random draw
- `POST /api/dashboard/[id]/participants/add` → Add participant manually

### Admin (requires `hc_admin` cookie)
- `GET /api/headcoachadmin/recent-events` → Last 20 events (organisers, participants, draws)
- `POST /api/headcoachadmin/bulk-email` → Preview/send campaign emails
- `POST /api/headcoachadmin/delete-organiser` → Delete organiser (cascades)
- `POST /api/headcoachadmin/reset-draw` → Reset draw assignments
- `GET /api/headcoachadmin/email-preview` → Preview email templates

### Cron (Vercel, restricted to 1/day on Hobby plan)
- `GET /api/cron/sync-daily` — 6 AM daily: sync match scores, auto-send notifications

---

## 9. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# App
NEXT_PUBLIC_APP_URL=https://playdrawr.co.uk
ADMIN_PASSWORD=... (32-char hash for admin login)

# Email
RESEND_API_KEY=... (transactional email)

# Analytics (optional)
NEXT_PUBLIC_GA4_ID=G-J33EV3HX98

# Vercel (optional, for analytics in admin dashboard)
VERCEL_TOKEN=...
VERCEL_PROJECT_ID=...
```

---

## 10. Key Features

### For Organisers
- Create sweepstakes in <1 minute (no code, drag-and-drop)
- Random draw with provable fairness (Supabase RLS as randomness seed)
- Auto-scoring from live match API
- Email notifications to participants (Resend)
- Bulk email campaigns (preview-only, no send)
- Participant management (add manually, self-signup, waitlist)
- Live leaderboard visible to all participants
- Entry fee option (Stripe integration in roadmap)

### For Participants
- Join without account (name + optional email)
- See live leaderboard with scores
- Receive draw result via email
- Optional: qualify for prize draw (£25 Uber Eats)

### For Admin
- **Head Coach dashboard:** Two-column layout
  - Left: Traffic, organiser stats, sweepstake stats, participant stats, 30-day growth chart
  - Right: Live Activity timeline (20 recent events, GMT+1 times, auto-refresh 10s)
- Bulk email campaigns (3 WC versions targeting different segments)
- Email template preview
- Organiser drill-down (view all sweepstakes, participants, draws)
- Delete organiser with cascading cleanup

---

## 11. Current Status & Roadmap

### Live & Production-Ready
✅ World Cup 2026 sweepstakes (core feature)
✅ Eurovision 2026 full support
✅ Organiser dashboard + participant self-signup
✅ Live leaderboard with auto-scoring
✅ Email notifications (Resend)
✅ Admin panel with bulk email campaigns
✅ Prize draw eligibility tracking

### Recent Additions
✅ WhatsApp chat button (global)
✅ 30-day growth trends chart
✅ Live Activity timeline with GMT+1 timestamps
✅ Sweepstake verification email flow
✅ Cleanup cron for unverified signups (disabled on Hobby plan)

### Roadmap
- [ ] Entry fee processing (Stripe)
- [ ] Pro plan features (unlimited participants, custom branding)
- [ ] Advanced reporting (CSV export, heatmaps)
- [ ] API for third-party integrations
- [ ] Mobile app (PWA or native)

---

## 12. Working Preferences

### Code Standards
- **Production-ready only** — no TODOs, console.logs, placeholder logic
- **Reuse patterns** — check existing templates, components, routes before creating new
- **No duplication** — extend existing files rather than parallel systems
- **TypeScript everywhere** — no `any` without comment explaining why
- **Comments minimal** — only when logic isn't self-evident; don't narrate obvious code
- **Error handling** — only at system boundaries (user input, external APIs), not internal
- **British English** — all copy, UI strings, code comments

### Git & Commits
- Prefer new commits over amends
- One feature per commit
- Commit messages: imperative, brief summary + optional details
- No `--no-verify`, no force pushes to main unless explicitly requested

### Testing & Verification
- Run `npm run build` before declaring done
- Test in browser preview if change is UI-observable
- Check for TypeScript errors (`npm run build` shows them)
- Run `/review` before opening PRs (security + code quality)

---

## 13. File Structure

```
.
├── app/
│   ├── (auth)/              # Auth routes
│   ├── (marketing)/         # Public pages (home, blog, etc.)
│   ├── dashboard/           # Organiser dashboard
│   │   ├── new/            # Create sweepstake
│   │   ├── [id]/           # Overview
│   │   ├── [id]/participants/
│   │   ├── [id]/draw/
│   │   └── [id]/settings/
│   ├── headcoachadmin/      # Admin panel (two-column with timeline)
│   ├── join/[token]/        # Participant self-signup
│   ├── s/[token]/           # Leaderboard
│   ├── api/                 # API routes (auth, email, cron, admin)
│   └── layout.tsx
├── lib/
│   ├── supabase/            # Client factories
│   ├── email/templates/     # Email templates (raw HTML)
│   └── utils/               # Helpers
├── public/                  # Static assets
├── supabase/
│   └── migrations/          # SQL migrations (numbered)
├── CLAUDE.md                # Project instructions (checked into repo)
├── SITE_DOCUMENTATION.md    # This file (shareable with Claude Chat)
├── vercel.json              # Cron job config (1/day Hobby limit)
├── tailwind.config.ts       # Tailwind custom tokens
└── package.json
```

---

## 14. How to Help

### Before Writing Code
1. Read relevant existing files (templates, components, routes)
2. Check `node_modules/next/dist/docs/` if using Next.js APIs
3. Verify no duplication—extend, don't parallel
4. Ask in comments if uncertain about approach

### When Implementing
- Follow existing patterns (same file structure, naming, component style)
- Use British English in all strings
- No gambling words (bet, odds, stake)
- TypeScript throughout
- Run `npm run build` before declaring done

### When Stuck
- Check git history (`git log`, `git blame`) for context
- Review related migrations in `supabase/migrations/`
- Look at similar features (e.g., WC email template vs Eurovision)
- Ask for clarification rather than guessing

---

## 15. Emergency Contacts & Resources

- **Production:** Vercel dashboard (`playdrawr.co.uk`)
- **Database:** Supabase console (RLS policies, real-time updates)
- **Email logs:** Resend dashboard
- **Cron status:** Vercel Cron Jobs tab (1/day limit on Hobby)
- **Git history:** `git log`, `git blame` for context

---

## 16. Quick Start for New Devs

1. Clone repo: `git clone https://github.com/callum80041/drawr.git`
2. Install: `npm install`
3. Copy `.env.local.example` → `.env.local` and fill in secrets
4. Dev server: `npm run dev`
5. Visit `http://localhost:3000`
6. Test admin panel: `/headcoachadmin` (password in `.env.local`)

Read `CLAUDE.md` for project philosophy and breaking changes in Next.js 16.

---

**Last updated:** 25 April 2026
**Maintainer:** callum80041 (Anthropic)
