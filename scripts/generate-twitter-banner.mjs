import sharp from 'sharp'

// Twitter/X header banner: 1500x500
const W = 1500
const H = 500

const GREEN  = '#1A2E22'
const LIME   = '#C8F046'
const WHITE  = '#FFFFFF'
const DIMMED = 'rgba(255,255,255,0.45)'
const MID    = '#0B3D2E'

const logoMark = (cx, cy, r = 80) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${MID}"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.65}" stroke="${LIME}" stroke-width="${r * 0.04}" fill="none"/>
  <line x1="${cx}" y1="${cy - r * 0.65}" x2="${cx}" y2="${cy + r * 0.65}" stroke="${LIME}" stroke-width="${r * 0.04}"/>
  <line x1="${cx - r * 0.65}" y1="${cy}" x2="${cx + r * 0.65}" y2="${cy}" stroke="${LIME}" stroke-width="${r * 0.04}"/>
  <line x1="${cx - r * 0.47}" y1="${cy - r * 0.47}" x2="${cx + r * 0.47}" y2="${cy + r * 0.47}" stroke="${LIME}" stroke-width="${r * 0.025}" opacity="0.55"/>
  <line x1="${cx + r * 0.47}" y1="${cy - r * 0.47}" x2="${cx - r * 0.47}" y2="${cy + r * 0.47}" stroke="${LIME}" stroke-width="${r * 0.025}" opacity="0.55"/>
  <rect x="${cx - r * 0.1}" y="${cy - r * 0.1}" width="${r * 0.2}" height="${r * 0.2}" fill="${LIME}" transform="rotate(45 ${cx} ${cy})"/>
`

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${GREEN}"/>

  <!-- Subtle grid texture -->
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="0.4" opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- Large faded logo marks as background decoration -->
  ${logoMark(W - 200, H / 2, 260)}
  ${logoMark(W - 560, H * 0.15, 90)}
  ${logoMark(140, H * 0.82, 70)}

  <!-- Wordmark — left aligned, vertically centred -->
  ${logoMark(200, H / 2, 110)}
  <text font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="112" letter-spacing="-3">
    <tspan x="345" y="${H / 2 + 38}" fill="${WHITE}">play</tspan><tspan fill="${LIME}">drawr</tspan>
  </text>

  <!-- Divider -->
  <line x1="345" y1="${H / 2 + 68}" x2="900" y2="${H / 2 + 68}" stroke="white" stroke-width="1" opacity="0.15"/>

  <!-- Tagline -->
  <text x="345" y="${H / 2 + 110}" font-family="Arial,Helvetica,sans-serif" font-size="38" fill="${DIMMED}">World Cup 2026 Sweepstakes</text>

  <!-- CTA pill -->
  <rect x="345" y="${H / 2 + 136}" width="320" height="58" rx="29" fill="${LIME}"/>
  <text x="505" y="${H / 2 + 174}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="30" fill="${GREEN}">playdrawr.co.uk</text>
</svg>`

await sharp(Buffer.from(svg))
  .resize(W, H)
  .png()
  .toFile('/Users/callum/Documents/Drawr/public/twitter-banner.png')

console.log('✓ twitter-banner.png (1500x500)')
