"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { grainsApi } from "@/redux/api/grainsApi";

/**
 * Warms the Cosmetics and Grains sections while the Landing page sits idle.
 *
 * Two things get warmed, both strictly in the background:
 *
 * 1. Routes: router.prefetch() pulls each section's RSC payload into the Next.js
 *    client Router Cache so section navigation stays client-side.
 *
 * 2. Grains catalogue: RTK Query prefetch starts getGrainCatalogue before the
 *    Grains layout mounts. DataProvider reads the same cache entry through
 *    useGetGrainCatalogueQuery(), so Landing -> Grains can reuse the warmed
 *    data and avoids a duplicate catalogue request.
 *
 * This remains best-effort and non-blocking: it runs during idle time, nothing
 * is awaited, and API failure is handled by DataProvider's static fallback.
 */
const SECTIONS = ["/cosmetics", "/grains"];

export default function SectionPrefetch() {
  const router = useRouter();
  const prefetchGrainCatalogue = grainsApi.usePrefetch("getGrainCatalogue");

  useEffect(() => {
    let cancelled = false;

    const warmSections = () => {
      if (cancelled) return;

      SECTIONS.forEach((href) => router.prefetch(href));
      prefetchGrainCatalogue(undefined, { ifOlderThan: 60 });
    };

    // Wait for idle so the Landing page's own work always wins the main thread.
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(warmSections, { timeout: 3000 })
        : window.setTimeout(warmSections, 1500);

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function" && typeof idle === "number") {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
    };
  }, [router, prefetchGrainCatalogue]);

  return null;
}
