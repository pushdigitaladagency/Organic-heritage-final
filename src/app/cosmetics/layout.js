// Nested layout for the Cosmetics section ("/cosmetics").
// <html>/<body> and the font variables now live in the single root layout
// (src/app/layout.js) so that Landing <-> Cosmetics <-> Grains navigate
// client-side instead of doing a full document load.
import "./globals.css";
import Script from "next/script";
import ScrollRevealInit from "./Components/ScrollRevealInit";
import { asset } from "@/lib/asset";

export const metadata = {
  title: "Organic Cosmetics",
  description: "Natural and Organic Cosmetic Products",
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
