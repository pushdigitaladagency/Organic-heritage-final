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

const mergeImages = (staticProduct, apiProduct) => {
  const seen = new Set();
  return [
    ...(apiProduct?.images || []),
    ...(staticProduct?.images || []),
  ].filter((image) => {
    if (!image || seen.has(image)) return false;
    seen.add(image);
    return true;
  });
};

const mergeProducts = (staticProducts, apiProducts = []) => {
  const bySlug = new Map(staticProducts.map((product) => [product.slug, product]));

  apiProducts.forEach((product) => {
    if (product?.slug) {
      const staticProduct = bySlug.get(product.slug);
      // If static data explicitly has empty images (img="" and all images are empty), preserve that and don't use API images
      const hasOnlyEmptyImages = staticProduct?.img === "" &&
        (!staticProduct?.images || staticProduct.images.every(img => !img));

      if (hasOnlyEmptyImages) {
        bySlug.set(product.slug, {
          ...staticProduct,
          ...product,
          img: "",
          images: staticProduct.images || [],
          image: "",
          imageUrl: "",
          thumbnail: "",
        });
      } else {
        const images = mergeImages(staticProduct, product);
        bySlug.set(product.slug, {
          ...staticProduct,
          ...product,
          ...(images.length ? { images } : {}),
        });
      }
    }
  });

  return Array.from(bySlug.values());
};

const mergeMenus = (staticMenu, apiMenu = []) => {
  if (!apiMenu.length) return staticMenu;

  const staticByTitle = new Map(staticMenu.map((menu) => [menu.title, menu]));

  return apiMenu.map((menu) => {
    const staticMatch = staticByTitle.get(menu.title);
    const linksBySlug = new Map((menu.links || []).map((link) => [link.slug, link]));

    (staticMatch?.links || []).forEach((link) => {
      if (link?.slug) linksBySlug.set(link.slug, link);
    });

    return {
      ...menu,
      links: Array.from(linksBySlug.values()),
    };
  });
};

const mergeCatalogue = (catalogue) => {
  if (!catalogue) return STATIC_FALLBACK;

  const allProducts = mergeProducts(STATIC_FALLBACK.allProducts, catalogue.allProducts);
  const featuredProducts = mergeProducts(STATIC_FALLBACK.featuredProducts, catalogue.featuredProducts);
  const categoryMenu = mergeMenus(STATIC_FALLBACK.categoryMenu, catalogue.categoryMenu);

  return { allProducts, featuredProducts, categoryMenu };
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
  const data = mergeCatalogue(catalogue);

  return <GrainsDataContext.Provider value={data}>{children}</GrainsDataContext.Provider>;
}
