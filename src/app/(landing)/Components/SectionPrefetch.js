"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadGrainsData } from "@/app/grains/lib/grainsData";

/**
 * Warms the Cosmetics and Grains sections while the Landing page sits idle.
 *
 * Two things get warmed, both strictly in the background:
 *
 *  1. ROUTES — router.prefetch() pulls each section's RSC payload into the
 *     Next.js client Router Cache. Landing <-> Cosmetics <-> Grains are now
 *     client-side transitions (one shared root layout), so that payload is
 *     exactly what the router renders on click: no document load, no server
 *     round-trip, nothing to wait for.
 *
 *  2. GRAINS CATALOGUE — Grains fetches its products from a client component
 *     (DataProvider), so prefetching the route alone would still leave it
 *     requesting on arrival. loadGrainsData() starts that one request here and
 *     caches it at module scope; DataProvider then seeds its state from the
 *     cache and issues no request of its own.
 *     Cosmetics needs no equivalent — its data is read server-side through
 *     lib/data.js (Next.js Data Cache), and /cosmetics itself renders no API
 *     data at all, so the route prefetch above is the whole story for it.
 *
 * Deliberately non-blocking and best-effort:
 *  - runs only after the Landing page is interactive, during idle time
 *  - nothing here is awaited and nothing can throw into React, so Landing
 *    renders normally regardless, and Cosmetics/Grains keep working as before
 *  - creates no duplicate work: the catalogue request is the same one Grains
 *    would have made, shared rather than repeated
 */
const SECTIONS = ["/cosmetics", "/grains"];

export default function SectionPrefetch() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const prefetch = () => {
      if (cancelled) return;

      SECTIONS.forEach((href) => router.prefetch(href));

      // Fire-and-forget: the promise is cached inside the module and already
      // handles its own failures by falling back to the static catalogue.
      loadGrainsData();
    };

    // Wait for idle so the Landing page's own work always wins the main thread.
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(prefetch, { timeout: 3000 })
        : window.setTimeout(prefetch, 1500);

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function" && typeof idle === "number") {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
      // Anything already fetched is intentionally left cached — discarding it
      // would throw away the warm start this component exists to create.
    };
  }, [router]);

  return null;
}
