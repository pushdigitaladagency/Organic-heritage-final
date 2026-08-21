import React from 'react'
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import Home from './Components/Home'
import { absoluteUrl } from '@/lib/seo'

// Title, description and keywords are inherited from cosmetics/layout.js —
// they already describe this page, since it IS the cosmetics landing page.
// Only the canonical is declared here; a canonical in the layout would be
// claimed by every cosmetics route beneath it.
export const metadata = {
  alternates: { canonical: absoluteUrl('/cosmetics') },
}

// Home is a pure static page — all data is fetched client-side
// or on-demand inside the category/products pages.
// No server-side data fetching here to keep the build fast.

export default function page() {
  return (
    <>
      <Header/>
      <Home/>
      <Footer/>
    </>
  )
}
