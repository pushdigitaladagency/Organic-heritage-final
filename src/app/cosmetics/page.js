import React from 'react'
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import Home from './Components/Home'

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
