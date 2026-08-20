"use client";

import { createContext, useContext } from "react";
import { useGetGrainCatalogueQuery } from "@/redux/api/grainsApi";
import { ALL_STATIC_PRODUCTS, STATIC_MENU } from "../lib/staticData";

const GrainsDataContext = createContext(null);

/** Read the shared, prefetched product data. */
export const useGrainsData = () => useContext(GrainsDataContext);

/** Shown until the API data arrives; unchanged from before. */
const STATIC_FALLBACK = {
  allProducts: ALL_STATIC_PRODUCTS,
  featuredProducts: ALL_STATIC_PRODUCTS.slice(0, 3), // Fallback featured
  categoryMenu: STATIC_MENU,
};

/**
 * Supplies the Grains catalogue to every page in the section.
 *
 * RTK Query now owns the server-data cache. The Context contract stays the same
 * so existing Grains components can continue to call useGrainsData().
 *
 * - Landing prefetch: SectionPrefetch warms getGrainCatalogue, and this hook
 *   reuses that cache entry when the user navigates to /grains.
 * - Direct /grains load: this hook starts the catalogue request and serves the
 *   static fallback until API data arrives.
 * - API failure/empty response: grainsApi resolves with null, so the static
 *   fallback remains available exactly as before.
 */
export default function DataProvider({ children }) {
  const { data: catalogue } = useGetGrainCatalogueQuery();
  const data = catalogue ?? STATIC_FALLBACK;

  return <GrainsDataContext.Provider value={data}>{children}</GrainsDataContext.Provider>;
}
