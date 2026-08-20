// Nested layout for the Grains section ("/grains").
// <html>/<body> and the font variables now live in the single root layout
// (src/app/layout.js) so that Landing <-> Cosmetics <-> Grains navigate
// client-side instead of doing a full document load.
import Script from "next/script";
import { BASE_PATH } from "./lib/asset";
import DataProvider from "./Components/DataProvider";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://organicheritage.store/grains"),
  title: "Organic Grains",
  description: "Organic Grains - Premium Quality Grains",
  icons: {
    icon: `${BASE_PATH}/logo11.png`,
  },
};

export default function GrainsLayout({ children }) {
  return (
    <>
      {/* Scopes globals.css + the Components CSS to this section (see those
          files). display:contents means this wrapper generates no box, so the
          layout tree under <body> is exactly what it was before. */}
      <div data-oh="grains" style={{ display: "contents" }}>
        <DataProvider>{children}</DataProvider>
      </div>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-9QY0DJYFMY"
        strategy="afterInteractive"
      />
      <Script id="google-analytics-grains" strategy="afterInteractive">
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
