# AI Handover — playdrawr

Compact context for AI coding sessions. Read this before touching the codebase.

---

## 1. Project overview

**playdrawr** (`playdrawr.co.uk`) — a free sweepstake tool for tournament events. Organisers create a sweepstake, share a link, participants self-sign-up, a random draw assigns teams/countries, a live leaderboard auto-scores.

**Tournaments supported:**
- FIFA World Cup 2026 (`sweepstake_type = 'worldcup'`, 48 teams, `tournament_id = 1`)
- Eurovision Song Contest 2026 (`sweepstake_type = 'eurovision'`, 35 countries, `tournament_id = 2`)

**Tech stack:**
- Next.js 16 App Router (check `node_modules/next/dist/docs/` before writing — breaking changes from earlier versions)
- Supabase (Postgres + Auth + SSR via `@supabase/ssr`)
- Tailwind CSS
- Resend (transactional email)
- Vercel (hosting + cron jobs via `vercel.json`)
- TypeScript throughout

**Key env vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`, `ADMIN_PASSWORD`

---

## 2. Brand and writing rules

- **British English** everywhere — colour, organiser, favourite, recognised, etc.
- **Name:** always lowercase `playdrawr` (never `Playdrawr`, never `PlayDrawr`)
- **Tone:** confident, friendly, slightly British, direct, no faff, not corporate
- **No gambling-adjacent language** — no "bet", "odds", "wager", "stake" (as in gambling). "Entry fee" is fine.
- **Emoji use:** only where the existing codebase already uses them; don't add gratuitously
- **Colours (Tailwind custom tokens):** `pitch` (dark green), `grass` (mid green), `lime` (yellow-green CTA), `mid` (muted text), `light` (off-white bg)
- **Fonts:** Syne (`font-heading`) for headings, DM Sans (`font-body`) for body

---

## 3. Key app areas

### Public / marketing (`app/(marketing)/`)
- Homepage (`page.tsx`) — hero, tournament cards, `HeroDrawAnimation`, demo links
- `/worldcup` and `/eurovision` — tournament landing pages
- Blog posts at `/blog/[slug]/`
- Demo sweepstakes: `share_token = 'demo2026'` (WC) and `share_token = 'demoeurovision'`

### Organiser flow (`app/dashboard/`)
- `dashboard/new/` — sweepstake creation (`CreateForm.tsx`); redirects to `?created=1` on success
- `dashboard/[id]/` — overview page; shows "Get people in" banner when no participants yet
- `dashboard/[id]/participants/` — add manually or share self-signup link
- `dashboard/[id]/draw/` — run the random draw
- `dashboard/[id]/settings/` — edit sweepstake settings
- Auth: Supabase PKCE flow; session cookies must be written to the *outgoing* `NextResponse` (not just the internal cookie store) — see `app/(auth)/auth/callback/route.ts` for the correct pattern

### Participant flow
- Self-signup: `/join/[token]` — name + optional email, no account needed
- Leaderboard/scores: `/s/[token]`
- Email is optional at signup but required to receive draw results and qualify for the participant prize draw

### Admin (`app/headcoachadmin/`)
- Protected by `hc_admin` cookie matching `ADMIN_PASSWORD` env var
- `page.tsx` — server component; fetches all data, computes campaign audiences, passes as props
- `AdminDashboard.tsx` — client component; stats, bulk email, campaign section, template previews, organiser drill-down
- `CampaignSection.tsx` — World Cup campaign email previews (preview only, no send)
- Email preview API: `app/api/headcoachadmin/email-preview/route.ts` — serves raw HTML; supports `?template=X&variant=eurovision` and campaign params (`firstName`, `sweepName`, `sweepLink`, `count`)

### Email templates (`lib/email/templates/`)
| File | Purpose |
|------|---------|
| `_header.ts` | `emailHeader` (WC) and `emailHeaderEurovision` shared header blocks |
| `sweepstake-created.ts` | Organiser confirmation after creation |
| `participant-joined.ts` | Notifies organiser of new signup |
| `invite.ts` | Sent to participant when added manually |
| `draw-complete.ts` / `draw-complete-eurovision.ts` | Team/country assigned |
| `payment-chase.ts` | Entry fee reminder |
| `waitlist-promoted.ts` | Reserve list → confirmed |
| `welcome.ts` | New organiser welcome |
| `campaign-wc.ts` | **WC campaign emails** (no-sweepstake, low-participants, push-to-ten) |

All templates accept `isEurovision?: boolean` (defaults `false`) and return raw HTML strings.

### Supabase schema (key tables)
- `organisers` — `id, user_id, name, email, plan, created_at`
- `sweepstakes` — `id, organiser_id, name, sweepstake_type, tournament_id, share_token, status, entry_fee, assignment_mode, draw_completed_at`
- `participants` — `id, sweepstake_id, name, email (nullable), paid, created_at`
- `assignments` — `id, sweepstake_id, participant_id, team_id, team_name, team_flag`
- `teams` — `id, tournament_id, name, flag, group_name`
- `matches` — fixtures with scores
- `email_log` — sent email audit trail
- `waitlist` — reserve/overflow participants

Supabase clients: `createClient()` (user session, respects RLS), `createServiceClient()` (service role, bypasses RLS — use for admin operations and auth callbacks).

---

## 4. Current implementation context

**World Cup 2026** is the primary commercial focus right now. Eurovision is fully supported but WC is where the campaign activity is happening.

**Campaign email preview** (`headcoachadmin`) — built but not yet sent:
- Email 1: organisers with no WC sweepstake (currently ~16)
- Email 2: WC sweepstake with < 3 participants (currently ~6)
- Email 3: WC sweepstake with 3–9 participants (currently ~1)
- Audience counts computed from `organiserDetails` in `page.tsx` — no extra DB query
- Preview only. No send route, no background jobs, no send buttons exist anywhere.

**Home Assistant webhook** — deferred. Do not build until explicitly requested.

---

## 5. Known business rules

### Organiser lifecycle segments (mutually exclusive, uses best WC sweepstake)
| Segment | Condition |
|---------|-----------|
| No sweepstake | Organiser has no `worldcup` sweepstake |
| Low participants | Best WC sweepstake has 0–2 participants |
| Building | Best WC sweepstake has 3–9 participants |
| Qualified | Best WC sweepstake has 10+ participants |

### Prize draw competition rules
- **Organiser draw:** 1 winner, £50 Uber Eats voucher. Qualifies if WC sweepstake has 10+ participants by **11:59pm 30 April 2026**.
- **Participant draw:** 1 winner, £25 Uber Eats voucher. Qualifies by joining a sweepstake **with their email address**.
- Both winners selected at random.
- Vouchers sent **17 June 2026** (ahead of England v Croatia, England's first WC 2026 group game).
- WC sweepstakes only — Eurovision sweepstakes do not qualify.

### Participant email rule
Email is optional at signup. Without it: participant appears on leaderboard but receives no draw result email and is **not eligible** for the participant prize draw.

### Free plan cap
48 participants per sweepstake on the free plan (`FREE_PLAN_CAP = 48` in `ParticipantsClient.tsx`).

---

## 6. Working preferences

- **Production-ready code** — no TODOs, no console.logs, no placeholder logic left in
- **Reuse existing patterns** — check existing templates, components, and API routes before creating new ones
- **No duplication** — extend existing files rather than creating parallel systems
- **Types** — TypeScript everywhere; no `any` without a comment explaining why
- **Comments** — only where logic isn't self-evident; don't narrate obvious code
- **Error handling** — only at real system boundaries (user input, external APIs); don't add defensive guards for impossible cases
- **British English** in all copy, UI strings, and comments

**End of session:** summarise changed files and briefly explain what each does. No waffle.

---

## 7. How future AI sessions should work

1. **Read before writing** — inspect the relevant existing file(s) before making changes
2. **Follow existing patterns** — look at how similar things are already done (e.g. a new email template should match the structure of `sweepstake-created.ts`)
3. **Check `node_modules/next/dist/docs/`** before using any Next.js API — this version has breaking changes
4. **Scope tasks tightly** — implement what was asked, nothing more
5. **No send functionality** unless explicitly requested — the campaign email preview system is preview-only by design
6. **No gambling language** — flag it if copy from the user contains it
7. **Supabase auth pattern** — always build the `NextResponse` redirect *first*, then construct the Supabase client with `setAll()` writing cookies to *both* `request.cookies` and `response.cookies`. See `app/(auth)/auth/callback/route.ts`.
