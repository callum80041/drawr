'use client'

import Script from 'next/script'

export function BuyMeACoffee() {
  return (
    <>
      <Script
        src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
        data-name="bmc-button"
        data-slug="playdrawr"
        data-color="#000000"
        data-emoji=""
        data-font="Cookie"
        data-text="Buy me a coffee"
        data-outline-color="#ffffff"
        data-font-color="#ffffff"
        data-coffee-color="#FFDD00"
        strategy="lazyOnload"
      />
    </>
  )
}
