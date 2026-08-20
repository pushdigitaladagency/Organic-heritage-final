import { cache } from "react";

/**
 * Shared server-side data layer.
 *
 * Every fetch here opts into the Next.js Data Cache via `next: { revalidate }`,
 * so the SAME request made from different routes (home, /category, /products/*)
 * is fetched once and reused across navigations instead of hitting the backend
 * every time. The React `cache()` wrapper additionally de-dupes calls within a
 * single render pass.
 *
 * Normalisation / return shapes are kept identical to the previous inline
 * per-page helpers so component behaviour is unchanged.
 */

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

// Revalidate cached data hourly; tags allow on-demand invalidation later.
const REVALIDATE = 3600;

/** Convert a category name to URL slug: "Lip Care" → "lip-care" */
export const toSlug = (name = "") =>
  name.trim().toLowerCase().replace(/\s+/g, "-");

/* ---------- Categories ---------- */

export const getCategories = cache(async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, {
      next: { revalidate: REVALIDATE, tags: ["categories"] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? data?.categories ?? []);
  } catch {
    return [];
  }
});

/* ---------- Products in a category ---------- */

export const getCategoryProducts = cache(async (slug) => {
  if (!slug) return [];
  try {
    const res = await fetch(`${BASE_URL}/api/categories/${slug}/products`, {
      next: { revalidate: REVALIDATE, tags: ["products", `category:${slug}`] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? data?.products ?? []);
  } catch {
    return [];
  }
});

/* ---------- Single product ---------- */

export const getProduct = cache(async (slug) => {
  if (!slug) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
      next: { revalidate: REVALIDATE, tags: ["products", `product:${slug}`] },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data[0] : (data?.data ?? data);
  } catch {
    return null;
  }
});
