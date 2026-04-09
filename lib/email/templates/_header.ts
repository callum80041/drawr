/**
 * Shared email header with the playdrawr wordmark (SVG logo + play/drawr text).
 * Drop-in replacement for the old plain "Drawr 🎲" text header.
 */
export const emailHeader = `
  <tr>
    <td style="background:#1A2E22;padding:24px 32px;">
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;padding-right:10px;">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#0B3D2E"/>
              <circle cx="20" cy="20" r="13" stroke="#C8F046" stroke-width="1.5" fill="none"/>
              <line x1="20" y1="7" x2="20" y2="33" stroke="#C8F046" stroke-width="1.5"/>
              <line x1="7" y1="20" x2="33" y2="20" stroke="#C8F046" stroke-width="1.5"/>
              <line x1="10.5" y1="10.5" x2="29.5" y2="29.5" stroke="#C8F046" stroke-width="1" stroke-opacity="0.6"/>
              <line x1="29.5" y1="10.5" x2="10.5" y2="29.5" stroke="#C8F046" stroke-width="1" stroke-opacity="0.6"/>
              <rect x="18.5" y="18.5" width="3" height="3" fill="#C8F046" transform="rotate(45 20 20)"/>
            </svg>
          </td>
          <td style="vertical-align:middle;">
            <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.5px;line-height:1;"><span style="color:#ffffff;">play</span><span style="color:#C8F046;">drawr</span></span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`
