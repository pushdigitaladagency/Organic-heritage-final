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
import Script from "next/script";
import StoreProvider from "../redux/StoreProvider";
import { SITE_URL } from "../lib/seo";

// metadataBase belongs here, once, and must be the ORIGIN — not a path.
// The cosmetics and grains layouts each set it to
// "https://organicheritage.store/<section>". Next resolves relative metadata
// URLs against it using standard URL semantics, so a base carrying a path but
// no trailing slash silently drops that last segment.
//
// Each section layout keeps its own title/description/keywords — those are the
// section-level defaults every page below them inherits.
export const metadata = {
  metadataBase: new URL(SITE_URL),
};

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

const GOOGLE_TAG_MANAGER_ID = "GTM-K2L9379P";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable}`}
      data-scroll-behavior="smooth"
    >
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');
        `}
      </Script>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
