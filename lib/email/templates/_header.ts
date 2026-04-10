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

/**
 * Eurovision-branded email header: deep purple gradient, stars, Vienna 2026.
 */
export const emailHeaderEurovision = `
  <tr>
    <td style="background:linear-gradient(160deg,#1B0744 0%,#3C1280 55%,#1B0744 100%);padding:32px;text-align:center;">
      <p style="margin:0 0 10px;font-size:22px;letter-spacing:0.15em;">⭐ ♥ ⭐</p>
      <p style="margin:0 0 6px;font-size:10px;font-weight:800;color:#F10F59;letter-spacing:0.3em;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Eurovision Song Contest</p>
      <p style="margin:0;font-size:30px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Vienna 2026</p>
      <p style="margin:10px 0 0;font-size:11px;color:rgba(255,255,255,0.38);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">13–17 May &middot; Sweepstake by <span style="color:rgba(255,255,255,0.65);font-weight:600;">playdrawr</span></p>
    </td>
  </tr>
`

/** Spotify playlist block for Eurovision emails */
export const spotifyBlock = `
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#121212;border-radius:12px;margin-bottom:20px;">
    <tr>
      <td style="padding:14px 18px;">
        <table cellpadding="0" cellspacing="0" style="width:100%;">
          <tr>
            <td style="vertical-align:middle;padding-right:12px;" width="36">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </td>
            <td style="vertical-align:middle;">
              <p style="margin:0 0 1px;font-size:10px;font-weight:700;color:#1DB954;text-transform:uppercase;letter-spacing:0.1em;">Spotify</p>
              <p style="margin:0;font-size:13px;font-weight:600;color:#ffffff;line-height:1.3;">Eurovision 2026 &mdash; Official Playlist</p>
            </td>
            <td style="vertical-align:middle;text-align:right;" width="70">
              <a href="https://open.spotify.com/user/eurovision" style="display:inline-block;background:#1DB954;color:#000000;font-weight:700;font-size:11px;text-decoration:none;padding:7px 13px;border-radius:20px;letter-spacing:0.02em;">Play &#9654;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`
