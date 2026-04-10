import sharp from 'sharp'
import { readFileSync } from 'fs'

const W = 1200
const H = 675

// Eurovision brand colours
const BG = '#040241'
const PINK = '#F10F59'
const PURPLE = '#5A22A9'
const WHITE = '#FFFFFF'
const LIME = '#C8F046'

// Read SVGs
const symbolSvg = readFileSync('./public/eurovision-symbol.svg', 'utf8')
const logoSvg = readFileSync('./public/eurovision-logo-white.svg', 'utf8')

// Scale symbol to ~300px wide for background watermark
const symbolBg = symbolSvg
  .replace(/<svg([^>]*)>/, `<svg$1 width="300" height="300">`)

// Scale logo to 260px wide
const logoScaled = logoSvg
  .replace(/<svg([^>]*)>/, (m, attrs) => {
    return `<svg${attrs} width="260" height="70">`
  })

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <!-- Dark navy background -->
    <radialGradient id="purpleGlow" cx="75%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${PURPLE}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="pinkGlow" cx="20%" cy="80%" r="45%">
      <stop offset="0%" stop-color="${PINK}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#purpleGlow)"/>
  <rect width="${W}" height="${H}" fill="url(#pinkGlow)"/>

  <!-- Watermark symbol (top-right, faint) -->
  <g opacity="0.07" transform="translate(${W - 360}, ${H / 2 - 200}) scale(2.6)">
    ${symbolBg.replace(/<\/?svg[^>]*>/g, '')}
  </g>

  <!-- Horizontal rule accent -->
  <line x1="80" y1="130" x2="200" y2="130" stroke="${PINK}" stroke-width="3" stroke-linecap="round"/>

  <!-- Eyebrow label -->
  <rect x="80" y="100" width="220" height="30" rx="15" fill="${PINK}" fill-opacity="0.15" stroke="${PINK}" stroke-opacity="0.5" stroke-width="1"/>
  <text x="190" y="120" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="${PINK}" text-anchor="middle" letter-spacing="2">COMING APRIL 2026</text>

  <!-- Eurovision logo (embedded SVG via foreignObject workaround — use image instead) -->
  <!-- Headline -->
  <text x="80" y="215" font-family="Georgia, serif" font-size="58" font-weight="900" fill="${WHITE}" letter-spacing="-1">Your Eurovision</text>
  <text x="80" y="285" font-family="Georgia, serif" font-size="58" font-weight="900" fill="${PINK}">sweepstake awaits.</text>

  <!-- Subtext -->
  <text x="80" y="345" font-family="Arial, sans-serif" font-size="22" fill="${WHITE}" fill-opacity="0.7">35 countries. One winner. Done in 3 minutes.</text>

  <!-- Divider -->
  <line x1="80" y1="385" x2="${W - 80}" y2="385" stroke="${WHITE}" stroke-opacity="0.1" stroke-width="1"/>

  <!-- CTA pill -->
  <rect x="80" y="415" width="320" height="60" rx="30" fill="${PINK}"/>
  <text x="240" y="452" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${WHITE}" text-anchor="middle">Sign up free →</text>

  <!-- URL -->
  <text x="430" y="452" font-family="Arial, sans-serif" font-size="18" fill="${WHITE}" fill-opacity="0.55">playdrawr.co.uk/eurovision</text>

  <!-- playdrawr wordmark bottom-right -->
  <text x="${W - 80}" y="${H - 40}" font-family="Arial, sans-serif" font-size="16" fill="${WHITE}" fill-opacity="0.35" text-anchor="end" letter-spacing="0.5">
    <tspan fill="${WHITE}" fill-opacity="0.35">play</tspan><tspan fill="${LIME}" fill-opacity="0.55">drawr</tspan>
  </text>

  <!-- Star dots decorative -->
  <circle cx="760" cy="200" r="2.5" fill="${PINK}" opacity="0.8"/>
  <circle cx="820" cy="160" r="1.5" fill="${WHITE}" opacity="0.5"/>
  <circle cx="900" cy="240" r="2" fill="${PURPLE}" opacity="0.9"/>
  <circle cx="780" cy="310" r="1.5" fill="${PINK}" opacity="0.5"/>
  <circle cx="1050" cy="180" r="2" fill="${WHITE}" opacity="0.4"/>
  <circle cx="1000" cy="290" r="3" fill="${PURPLE}" opacity="0.6"/>
  <circle cx="850" cy="350" r="1.5" fill="${PINK}" opacity="0.4"/>
</svg>
`

const buf = Buffer.from(svg)

await sharp(buf)
  .png()
  .toFile('./public/eurovision-x-cta.png')

console.log('✅  public/eurovision-x-cta.png  (1200×675)')
