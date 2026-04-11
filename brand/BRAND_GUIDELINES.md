# playdrawr — Brand Guidelines

> Version 1.0 · April 2026  
> Questions? hello@playdrawr.co.uk

---

## 1. Who We Are

**playdrawr** is a free sweepstake tool for World Cup 2026 and Eurovision 2026. We make it effortless for offices, pubs, and group chats to run a fair draw, share one link, and let the leaderboard run itself.

**Brand personality:** Confident. Friendly. Slightly British. No faff.  
**We are not:** corporate, gambling-adjacent in tone, or overly serious.

---

## 2. The Name

Always written as: **playdrawr** (all lowercase, one word)

| ✅ Correct | ❌ Wrong |
|---|---|
| playdrawr | PlayDrawr |
| playdrawr.co.uk | Play Drawr |
| | Playdrawr |
| | PLAYDRAWR |

The only exception is the start of a sentence where standard grammar demands a capital — even then, prefer restructuring the sentence.

---

## 3. Logo

### 3.1 The Mark

The logomark is an abstract globe/pitch symbol — a circle with horizontal, vertical, and diagonal axis lines, and a rotated diamond at the centre. It references both a football and a world globe, intentionally ambiguous.

**Files:**
- `brand/logos/logomark.svg` — standard (dark green background)
- `brand/logos/logomark-white.svg` — for use on coloured backgrounds

### 3.2 The Wordmark

**"play"** in the primary text colour + **"drawr"** in Lime (light backgrounds) or Lime (dark backgrounds).

**Files:**
- `brand/logos/wordmark-light.svg` — white "play" + lime "drawr" · for dark backgrounds
- `brand/logos/wordmark-dark.svg` — pitch "play" + grass "drawr" · for light backgrounds

### 3.3 Clear Space

Maintain clear space of at least **½ the height of the logomark** on all sides. Never crowd it.

### 3.4 Minimum Size

- Logomark alone: **24px** minimum
- Full wordmark: **120px** wide minimum

### 3.5 Logo Don'ts

- ❌ Don't recolour the logomark
- ❌ Don't stretch or distort
- ❌ Don't add drop shadows or effects
- ❌ Don't place on busy photographic backgrounds without a solid colour block behind it
- ❌ Don't use the logomark on a white background without the green circle

---

## 4. Colour

### 4.1 Primary Palette

| Name | Hex | Usage |
|---|---|---|
| **Pitch** | `#0B3D2E` | Darkest green. Logo mark background. Hero sections on the homepage. |
| **Dark** | `#1A2E22` | Dark UI backgrounds, email headers, nav bars, card headers. |
| **Grass** | `#1A6B47` | Links, hover states, interactive elements on light backgrounds. |
| **Lime** | `#C8F046` | Primary CTA colour. Buttons, highlights, accent lines. Always on dark backgrounds. |
| **Mid** | `#4A7C62` | Muted/secondary text. Descriptive copy, labels. |
| **Light** | `#F4F7F2` | Page background. Near-white with a subtle green tint. |
| **Gold** | `#F0B429` | Alerts, warning states, special callouts. |
| **White** | `#FFFFFF` | Card backgrounds, text on dark surfaces. |

**Visual reference:** `brand/colors/color-palette.svg`

### 4.2 Lime Usage Rules

- Lime is **always used on dark backgrounds** (Pitch or Dark) — never on white or Light
- On light backgrounds, use **Grass** (`#1A6B47`) for links and accents
- Lime text on white fails WCAG contrast — don't do it
- Lime as a button background: text should be Pitch (`#0B3D2E`)

### 4.3 Eurovision Palette

When producing any asset specifically for Eurovision (not the general product):

| Name | Hex | Usage |
|---|---|---|
| **Eurovision Pink** | `#F10F59` | Primary CTA. Replaces Lime for all Eurovision UI. |
| **Eurovision Purple** | `#1B0744` | Deep background. Replaces Pitch/Dark for headers and footers. |
| **Eurovision Lavender** | `#EEE8FF` | Page/email background. Replaces Light. |
| **Eurovision Border** | `#CFC3F0` | Card borders and dividers. Replaces the green `#E5EDEA`. |

Eurovision buttons: Pink background (`#F10F59`) + white text.

---

## 5. Typography

### 5.1 Fonts

| Role | Font | Weight | Usage |
|---|---|---|---|
| **Heading** | Syne | 700–900 | All headlines, display text, number callouts |
| **Body** | DM Sans | 400–600 | All body copy, UI labels, descriptions |
| **Monospace** | System mono | 400 | Code snippets, URLs in emails |

Both fonts are loaded via Google Fonts. If unavailable, fall back to `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

### 5.2 Heading Scale

| Class | Size | Weight | Use case |
|---|---|---|---|
| Display | 64–80px | 900 | Homepage hero headline |
| H1 | 40–56px | 800–900 | Page titles, section heroes |
| H2 | 28–36px | 700–800 | Section headings |
| H3 | 20–24px | 700 | Card headings, feature titles |
| Label | 10–12px | 700 | Eyebrow pills, uppercase labels (letter-spacing: 0.15em) |

### 5.3 Letter Spacing

- Headlines: **-0.5px to -2px** (tight) — Syne looks best slightly condensed
- Body: **0** (default)
- Uppercase labels: **+0.15em to +0.3em** (wide)

### 5.4 Type Don'ts

- ❌ Don't set body copy in Syne — it's a display font only
- ❌ Don't use Lime for body text on white/light backgrounds
- ❌ Don't use font weights below 400 for DM Sans in UI

---

## 6. Voice & Tone

### 6.1 Personality

playdrawr is written the way a smart, friendly British person would talk to their mates before a big match or Eurovision night. Informal but not sloppy. Confident but not boastful.

### 6.2 Principles

**Direct.** Say the thing. No fluff. "Run a draw. Share a link. Watch it run itself." Not "Our innovative platform enables you to effortlessly orchestrate..."

**British English.** Organiser (not organizer). Sweepstake (not sweepstakes pool). Favour, colour, centre.

**Wry.** A single dry observation beats three exclamation points. "May your country serve up three minutes of pure drama." Not "Good luck!!!! 🎉🎉🎉"

**No gambling language.** We're entertainment only. Never use "bet", "odds", "stake" in the gambling sense, "punter". Say "entry fee", "prize pot", "sweepstake".

### 6.3 Tone by Context

| Context | Tone |
|---|---|
| Homepage hero | Bold, punchy, confidence |
| Email to participant | Warm, a bit playful, clear |
| Error messages | Calm, helpful, never blame the user |
| Legal / terms | Plain English — still us, just careful |
| Dashboard UI | Efficient, labelled clearly, no surprises |

### 6.4 Emoji

Use sparingly. When in doubt, don't. Preferred usage:

- ⚽ World Cup context
- 🎤 Eurovision context  
- 🎲 General sweepstake / draw
- 🏆 Winners, results
- ✓ Confirmed states (UI)

Never use 🎰 or anything gambling-adjacent.

---

## 7. Tournament-Specific Branding

### 7.1 World Cup 2026

- Accent: **Lime** (`#C8F046`)
- Emoji: ⚽
- Copy: "teams", "draw", "group stage", "knockout", "final whistle"
- Hosted: USA, Canada, Mexico · June–July 2026 · 48 teams

### 7.2 Eurovision 2026

- Accent: **Eurovision Pink** (`#F10F59`)
- Background: **Eurovision Purple** (`#1B0744`) replaces dark green in headers
- Emoji: 🎤 ⭐ ♥
- Copy: "countries", "assign countries", "semi-final", "Grand Final", "final vote"
- Hosted: Vienna, Austria · 13–17 May 2026 · 35 countries
- Scoring: qualify for Grand Final = 10pts, top 3 = +20pts, win = +50pts

**Rule:** Any asset that is for a specific tournament should use that tournament's accent colour. General product assets (account emails, help pages, homepage) should use the default green/lime palette.

---

## 8. Email Templates

All transactional emails are written in plain HTML with inline CSS. There are 9 templates:

| Template | Recipient | Tournament-aware |
|---|---|---|
| `welcome` | Organiser | No (generic) |
| `sweepstake-created` | Organiser | ✅ Yes |
| `participant-joined` | Organiser | ✅ Yes |
| `invite` | Participant | ✅ Yes |
| `draw-complete` | Participant | World Cup only |
| `draw-complete-eurovision` | Participant | Eurovision only |
| `payment-chase` | Participant | ✅ Yes |
| `waitlist-promoted` | Participant | ✅ Yes |
| `organiser-update` | Organiser | No (campaign) |

**Headers:**
- World Cup / general: dark green (`#1A2E22`) with playdrawr SVG wordmark
- Eurovision: deep purple gradient with ⭐ ♥ ⭐, "Eurovision Song Contest / Vienna 2026"

**Templates location:** `lib/email/templates/`  
**Supabase auth emails:** `supabase/email-templates/`  
**Preview all templates:** `/headcoachadmin` → Email templates section

---

## 9. UI Components

### 9.1 Buttons

| Variant | Background | Text | Usage |
|---|---|---|---|
| Primary (WC) | `#C8F046` Lime | `#0B3D2E` Pitch | Main CTAs on dark surfaces |
| Primary (EV) | `#F10F59` Pink | `#ffffff` White | Eurovision CTAs |
| Dark | `#1A2E22` Dark | `#ffffff` White | CTAs on light surfaces |
| Ghost | transparent | `#1A6B47` Grass | Secondary actions |

Border radius: **12px** (large buttons) · **8px** (small/inline)

### 9.2 Cards

- Background: `#ffffff`
- Border: `1px solid #E5EDEA` (World Cup) or `1px solid #CFC3F0` (Eurovision)
- Border radius: **16px** (large) · **12px** (medium) · **8px** (small)

### 9.3 Spacing

Base unit: **4px**. Most spacing is in multiples of 4 (8, 12, 16, 20, 24, 32, 40, 48).

---

## 10. Social Media

### 10.1 Assets

| Asset | Dimensions | File |
|---|---|---|
| Facebook cover photo | 820 × 312px | `brand/social/facebook-cover.svg` |
| OG / link preview image | 1200 × 630px | Generated via `/api/og/home` |

### 10.2 Profile Photo

Use the **logomark** (`brand/logos/logomark.svg`) as the profile photo on all social platforms. Facebook profile photo displays at 170×170px — the mark is designed to work at any size down to 24px.

### 10.3 Facebook Cover

The cover shows: "Sweepstakes / made simple." headline + tournament line + playdrawr.co.uk. No logo (that's the profile photo). Dark green background with abstract globe motif on the right.

**Important:** Facebook crops the cover differently on mobile (focuses the centre). Keep critical text in the left half.

---

## 11. File Structure

```
brand/
├── BRAND_GUIDELINES.md          ← this file
├── logos/
│   ├── logomark.svg             ← mark only, dark green bg
│   ├── logomark-white.svg       ← mark only, transparent bg (for coloured surfaces)
│   ├── wordmark-light.svg       ← full wordmark for dark backgrounds
│   └── wordmark-dark.svg        ← full wordmark for light backgrounds
├── colors/
│   └── color-palette.svg        ← visual colour reference sheet
├── social/
│   └── facebook-cover.svg       ← 820×312px Facebook cover
└── typography/
    └── (font reference — Syne + DM Sans via Google Fonts)
```

---

## 12. What Not To Do

- ❌ Don't use a white or light background behind the logomark without its green circle
- ❌ Don't use Lime on white — it fails accessibility contrast
- ❌ Don't mix tournament colours (green + pink in the same non-generic context)
- ❌ Don't use gambling terminology
- ❌ Don't write "Playdrawr", "PlayDrawr", or "PLAYDRAWR"
- ❌ Don't use more than one emoji per sentence in UI copy
- ❌ Don't add heavy drop shadows, gradients, or 3D effects to the logo

---

*Last updated: April 2026 · playdrawr · hello@playdrawr.co.uk*
