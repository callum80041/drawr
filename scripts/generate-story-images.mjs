import sharp from 'sharp'
import { writeFileSync } from 'fs'

// 1080x1920 — Instagram story dimensions
const W = 1080
const H = 1920

const GREEN  = '#1A2E22'
const LIME   = '#C8F046'
const WHITE  = '#FFFFFF'
const DIMMED = 'rgba(255,255,255,0.55)'
const MID    = '#0B3D2E'

// ── Shared pieces ──────────────────────────────────────────────────────────

const logoMark = (cx, cy, r = 80) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${MID}"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.65}" stroke="${LIME}" stroke-width="3" fill="none"/>
  <line x1="${cx}" y1="${cy - r * 0.65}" x2="${cx}" y2="${cy + r * 0.65}" stroke="${LIME}" stroke-width="3"/>
  <line x1="${cx - r * 0.65}" y1="${cy}" x2="${cx + r * 0.65}" y2="${cy}" stroke="${LIME}" stroke-width="3"/>
  <line x1="${cx - r * 0.47}" y1="${cy - r * 0.47}" x2="${cx + r * 0.47}" y2="${cy + r * 0.47}" stroke="${LIME}" stroke-width="2" opacity="0.55"/>
  <line x1="${cx + r * 0.47}" y1="${cy - r * 0.47}" x2="${cx - r * 0.47}" y2="${cy + r * 0.47}" stroke="${LIME}" stroke-width="2" opacity="0.55"/>
  <rect x="${cx - 8}" y="${cy - 8}" width="16" height="16" fill="${LIME}" transform="rotate(45 ${cx} ${cy})"/>
`

const wordmark = (x, y, size = 52) => `
  ${logoMark(x - size * 1.1, y - size * 0.35, size * 0.62)}
  <text font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="${size}" letter-spacing="-1">
    <tspan x="${x}" y="${y}" fill="${WHITE}">play</tspan><tspan fill="${LIME}">drawr</tspan>
  </text>
`

const footer = (y = H - 90) => `
  <text x="${W/2}" y="${y}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="32" fill="${DIMMED}">playdrawr.co.uk</text>
`

// subtle grid pattern overlay for texture
const gridOverlay = () => `
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="0.4" opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
`

// ── Slide 1: Hook ──────────────────────────────────────────────────────────
const slide1 = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${GREEN}"/>
  ${gridOverlay()}

  <!-- Big background football mark -->
  ${logoMark(W / 2, H * 0.38, 340)}

  <!-- Wordmark top -->
  ${wordmark(W / 2 - 120, 110, 48)}

  <!-- Slide number -->
  <text x="${W - 60}" y="100" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="28" fill="${DIMMED}">1 / 4</text>

  <!-- Main headline -->
  <text x="${W / 2}" y="${H * 0.64}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="112" fill="${WHITE}" letter-spacing="-4">WORLD</text>
  <text x="${W / 2}" y="${H * 0.64 + 118}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="112" fill="${LIME}" letter-spacing="-4">CUP</text>
  <text x="${W / 2}" y="${H * 0.64 + 236}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="112" fill="${WHITE}" letter-spacing="-4">2026</text>

  <!-- Date pill -->
  <rect x="${W/2 - 200}" y="${H * 0.64 + 270}" width="400" height="68" rx="34" fill="${LIME}"/>
  <text x="${W/2}" y="${H * 0.64 + 314}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="32" fill="${GREEN}">11 June — 19 July 2026</text>

  <!-- Sub -->
  <text x="${W / 2}" y="${H * 0.64 + 390}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="40" fill="${DIMMED}">48 teams. 104 matches. One winner.</text>

  ${footer()}
</svg>`

// ── Slide 2: Problem / Tension ─────────────────────────────────────────────
const slide2 = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${GREEN}"/>
  ${gridOverlay()}

  <!-- Wordmark top -->
  ${wordmark(W / 2 - 120, 110, 48)}

  <!-- Slide number -->
  <text x="${W - 60}" y="100" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="28" fill="${DIMMED}">2 / 4</text>

  <!-- Accent line -->
  <rect x="80" y="260" width="100" height="6" rx="3" fill="${LIME}"/>

  <!-- Headline -->
  <text x="80" y="360" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="96" fill="${WHITE}" letter-spacing="-3">Watching</text>
  <text x="80" y="468" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="96" fill="${WHITE}" letter-spacing="-3">football</text>
  <text x="80" y="576" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="96" fill="${LIME}" letter-spacing="-3">is better</text>
  <text x="80" y="684" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="96" fill="${WHITE}" letter-spacing="-3">with skin</text>
  <text x="80" y="792" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="96" fill="${WHITE}" letter-spacing="-3">in the game.</text>

  <!-- Divider -->
  <line x1="80" y1="860" x2="${W - 80}" y2="860" stroke="white" stroke-width="1" opacity="0.15"/>

  <!-- Supporting copy -->
  <text x="80" y="930" font-family="Arial,Helvetica,sans-serif" font-size="44" fill="${DIMMED}">A sweepstake turns every</text>
  <text x="80" y="988" font-family="Arial,Helvetica,sans-serif" font-size="44" fill="${DIMMED}">match into must-watch TV.</text>
  <text x="80" y="1086" font-family="Arial,Helvetica,sans-serif" font-size="44" fill="${DIMMED}">Even if your team goes out</text>
  <text x="80" y="1144" font-family="Arial,Helvetica,sans-serif" font-size="44" fill="${DIMMED}">in the group stage.</text>

  <!-- Big emoji accent -->
  <text x="${W - 140}" y="${H * 0.78}" font-size="180" text-anchor="middle">👀</text>

  ${footer()}
</svg>`

// ── Slide 3: How it works ──────────────────────────────────────────────────
const step = (num, y, title, sub) => `
  <!-- Step ${num} -->
  <circle cx="110" cy="${y}" r="44" fill="${LIME}"/>
  <text x="110" y="${y + 16}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="48" fill="${GREEN}">${num}</text>
  <text x="180" y="${y - 10}" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="46" fill="${WHITE}">${title}</text>
  <text x="180" y="${y + 46}" font-family="Arial,Helvetica,sans-serif" font-size="36" fill="${DIMMED}">${sub}</text>
`

const slide3 = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${GREEN}"/>
  ${gridOverlay()}

  <!-- Wordmark top -->
  ${wordmark(W / 2 - 120, 110, 48)}

  <!-- Slide number -->
  <text x="${W - 60}" y="100" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="28" fill="${DIMMED}">3 / 4</text>

  <!-- Headline -->
  <text x="80" y="290" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="80" fill="${WHITE}" letter-spacing="-2">Up and running</text>
  <text x="80" y="378" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="80" fill="${LIME}" letter-spacing="-2">in 3 minutes.</text>

  <!-- Steps -->
  ${step(1, 560, 'Create', 'Name it, set an entry fee')}
  ${step(2, 720, 'Invite', 'Share a link — they sign up')}
  ${step(3, 880, 'Draw', 'Teams assigned randomly')}
  ${step(4, 1040, 'Watch', 'Live leaderboard updates itself')}

  <!-- Bottom highlight box -->
  <rect x="60" y="1160" width="${W - 120}" height="160" rx="24" fill="${LIME}"/>
  <text x="${W/2}" y="1228" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="48" fill="${GREEN}">Free for up to 48 participants.</text>
  <text x="${W/2}" y="1290" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="38" fill="${MID}">No card required to start.</text>

  ${footer()}
</svg>`

// ── Slide 4: CTA ───────────────────────────────────────────────────────────
const slide4 = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${GREEN}"/>
  ${gridOverlay()}

  <!-- Big background logo -->
  ${logoMark(W / 2, H * 0.42, 380)}

  <!-- Wordmark top -->
  ${wordmark(W / 2 - 120, 110, 48)}

  <!-- Slide number -->
  <text x="${W - 60}" y="100" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="28" fill="${DIMMED}">4 / 4</text>

  <!-- Main CTA -->
  <text x="${W/2}" y="${H * 0.72}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="88" fill="${WHITE}" letter-spacing="-3">Don't miss</text>
  <text x="${W/2}" y="${H * 0.72 + 96}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="88" fill="${WHITE}" letter-spacing="-3">the kick-off.</text>

  <text x="${W/2}" y="${H * 0.72 + 190}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="42" fill="${DIMMED}">Set up your sweepstake today.</text>

  <!-- Big CTA button -->
  <rect x="100" y="${H * 0.84}" width="${W - 200}" height="120" rx="28" fill="${LIME}"/>
  <text x="${W/2}" y="${H * 0.84 + 72}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="52" fill="${GREEN}">playdrawr.co.uk →</text>

  <!-- Urgency nudge -->
  <text x="${W/2}" y="${H * 0.84 + 160}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="34" fill="${DIMMED}">World Cup starts 11 June 2026</text>
</svg>`

// ── Render all ─────────────────────────────────────────────────────────────
const slides = [
  { name: 'story-1-hook.png',     svg: slide1 },
  { name: 'story-2-tension.png',  svg: slide2 },
  { name: 'story-3-howto.png',    svg: slide3 },
  { name: 'story-4-cta.png',      svg: slide4 },
]

for (const { name, svg } of slides) {
  const outPath = `/Users/callum/Documents/Drawr/public/${name}`
  await sharp(Buffer.from(svg))
    .resize(W, H)
    .png()
    .toFile(outPath)
  console.log(`✓ ${name}`)
}
