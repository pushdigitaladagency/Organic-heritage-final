// Nested layout for the Landing section ("/").
// <html>/<body> and the font variables now live in the single root layout
// (src/app/layout.js) so that Landing <-> Cosmetics <-> Grains navigate
// client-side instead of doing a full document load.
import Script from "next/script";
import "./globals.css";

// metadataBase now lives once in the root layout. Everything else here is the
// landing section's default metadata, inherited by "/" unless the page
// overrides it.
export const metadata = {
  title: "Organic Foods & Natural Personal Care | Organic Heritage",
  description: "Organic Heritage - Rooted in nature, crafted for everyday living",
  keywords: ["organic products India"],
  verification: {
    google: "DD7a5DLx33Gy-GMal4zTpYerTUI5pt3KUBY9H8wHXeg",
  },
  icons: {
    icon: '/images/Logo.svg',
  },
};

export default function LandingLayout({ children }) {
  return (
    <>
      {/* Scopes globals.css + Home.css to this section (see those files).
          display:contents means this wrapper generates no box, so the layout
          tree under <body> is exactly what it was before. */}
      <div data-oh="landing" style={{ display: "contents" }}>
        {children}
      </div>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-WRSR4BEKPH"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WRSR4BEKPH');
        `}
      </Script>
    </>
  );
}
