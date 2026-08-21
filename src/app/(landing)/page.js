import React from 'react'
import Home from './Components/Home'
import SectionPrefetch from './Components/SectionPrefetch'
import { absoluteUrl } from '@/lib/seo'

// Title, description and keywords are inherited from (landing)/layout.js.
// Only the canonical is declared here — a canonical must never sit in a layout,
// or every route beneath it would claim the same URL.
export const metadata = {
  alternates: { canonical: absoluteUrl('/') },
}

function page() {
  return (
    <div>
      <Home />
      <SectionPrefetch />
    </div>
  )
}

export default page
