// The SINGLE root layout for the whole merged app.
//
// Why this file exists:
// each section (landing "/", "/cosmetics", "/grains") used to declare its own
// <html>/<body>, which made each of them a separate ROOT layout. Next.js does a
// full document load whenever a navigation crosses a root-layout boundary — that
// was the cause of the browser refresh on Landing <-> Cosmetics <-> Grains.
// With one root layout here, the three section layouts become ordinary nested
// layouts and every transition is a client-side route change.
//
// The font variables are the union of the three old layouts, declared once on
// <html> so every section keeps the exact custom properties its CSS expects.
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
