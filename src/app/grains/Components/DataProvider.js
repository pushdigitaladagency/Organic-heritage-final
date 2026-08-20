"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ALL_STATIC_PRODUCTS, STATIC_MENU } from "../lib/staticData";
import { getCachedGrainsData, loadGrainsData } from "../lib/grainsData";

const GrainsDataContext = createContext(null);

/** Read the shared, prefetched product data. */
export const useGrainsData = () => useContext(GrainsDataContext);

/** Shown until the API data arrives — unchanged from before. */
const STATIC_FALLBACK = {
  allProducts: ALL_STATIC_PRODUCTS,
  featuredProducts: ALL_STATIC_PRODUCTS.slice(0, 3), // Fallback featured
  categoryMenu: STATIC_MENU,
};

/**
 * Supplies the Grains catalogue to every page in the section.
 *
 * The request itself lives in lib/grainsData so it can be started ahead of time
 * by the Landing page and cached at module scope. That gives two paths:
 *
 *  - PRELOADED (arrived from Landing): the cache is already populated, so state
 *    is seeded with the real catalogue on the FIRST render — no static→API swap,
 *    no loading state, and no request at all.
 *  - COLD (opened /grains directly): behaves exactly as it always did — static
 *    fallback first, then the API data once the single shared request resolves.
 *
 * Either way the catalogue is requested at most once per page load, including
 * when this provider unmounts and remounts as the user moves between sections.
 */
export default function DataProvider({ children }) {
  const [data, setData] = useState(() => getCachedGrainsData() ?? STATIC_FALLBACK);

  useEffect(() => {
    if (getCachedGrainsData()) return; // already preloaded — nothing to request

    let alive = true;
    loadGrainsData().then((fresh) => {
      if (alive && fresh) setData(fresh);
    });
    return () => {
      alive = false;
    };
  }, []);

  return <GrainsDataContext.Provider value={data}>{children}</GrainsDataContext.Provider>;
}
