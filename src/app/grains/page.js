import HomeClient from "./Components/HomeClient";
import { absoluteUrl } from "@/lib/seo";

// Server component purely so this route can export metadata — a client
// component cannot. All the interactive logic moved to Components/HomeClient.js
// unchanged; this file adds nothing to the rendered output.
//
// Title, description and keywords are inherited from ./layout.js, which already
// describes this page. Only the canonical is declared here: a canonical in the
// layout would be claimed by every grains route beneath it, including all 37
// product pages.
export const metadata = {
  alternates: { canonical: absoluteUrl("/grains") },
};

export default function Page() {
  return <HomeClient />;
}
