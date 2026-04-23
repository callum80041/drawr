'use client'

import Script from 'next/script'

export function BuyMeACoffee() {
  return (
    <>
      <Script
        src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
        data-name="bmc-button"
        data-slug="playdrawr"
        data-color="#FFDD00"
        data-emoji="☕"
        data-font="Bree"
        data-text="Buy us a coffee"
        data-outline-color="#000000"
        data-font-color="#000000"
        data-coffee-color="#ffffff"
        strategy="lazyOnload"
      />
    </>
  )
}
