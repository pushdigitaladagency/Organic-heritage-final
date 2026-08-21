// Nested layout for the Cosmetics section ("/cosmetics").
// <html>/<body> and the font variables now live in the single root layout
// (src/app/layout.js) so that Landing <-> Cosmetics <-> Grains navigate
// client-side instead of doing a full document load.
import "./globals.css";
import Script from "next/script";
import ScrollRevealInit from "./Components/ScrollRevealInit";
import { asset } from "@/lib/asset";

// metadataBase now lives once in the root layout — it was set to a PATH here,
// which breaks relative URL resolution. Everything else is the cosmetics
// section's default metadata: every route below inherits these unless it
// supplies its own (products and categories do, from MongoDB).
export const metadata = {
  title: "Natural & Herbal Cosmetics Online | Organic Heritage",
  description: "Natural and Organic Cosmetic Products",
  keywords: ["natural cosmetics India"],
  icons: {
    icon: asset("/images/Organic_logo.svg"),
  },
};

export default function CosmeticsLayout({ children }) {
  return (
    <>
      {/* Scopes globals.css + the Components CSS to this section (see those
          files). display:contents means this wrapper generates no box, so the
          layout tree under <body> is exactly what it was before. */}
      <div data-oh="cosmetics" style={{ display: "contents" }}>
        <ScrollRevealInit />
        {children}
      </div>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-9QY0DJYFMY"
        strategy="afterInteractive"
      />
      <Script id="google-analytics-cosmetics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9QY0DJYFMY');
        `}
      </Script>
    </>
  );
}
