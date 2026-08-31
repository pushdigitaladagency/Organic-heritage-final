import { cache } from "react";

/**
 * Shared server-side data layer.
 *
 * Fetches use a short persistent Next.js Data Cache revalidation window so
 * catalogue pages do not block on MongoDB for every request. The React `cache()`
 * wrapper still de-dupes calls within a single render pass.
 *
 * Normalisation / return shapes are kept identical to the previous inline
 * per-page helpers so component behaviour is unchanged.
 */

const BACKEND_ORIGIN = (
  process.env.BACKEND_API_ORIGIN ||
  process.env.PRODUC_URI ||
  process.env.NEXT_PUBLIC_BACKEND_API ||
  ""
).replace(/\/+$/, "");
const STORE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://organicheritage.store";
export const COSMETICS_REVALIDATE_SECONDS = 60;

const apiUrl = (path) => `${BACKEND_ORIGIN}${path}`;

/** Convert a category name to URL slug: "Lip Care" → "lip-care" */
export const toSlug = (name = "") =>
  name.trim().toLowerCase().replace(/\s+/g, "-");

/* ---------- Categories ---------- */

export const getCategories = cache(async () => {
  try {
    const res = await fetch(apiUrl("/api/categories"), {
      next: { revalidate: COSMETICS_REVALIDATE_SECONDS },
      headers: {
        Origin: STORE_ORIGIN,
      },
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
    const res = await fetch(apiUrl(`/api/categories/${slug}/products`), {
      next: { revalidate: COSMETICS_REVALIDATE_SECONDS },
      headers: {
        Origin: STORE_ORIGIN,
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? data?.products ?? []);
  } catch {
    return [];
  }
});

/* ---------- Single category ---------- */

/**
 * One category document, needed by the category page to read its `seo` block.
 *
 * Resolved out of the category list rather than its own request: the API has
 * no /api/categories/:slug route, and getCategories() is still React-cached
 * within the current render, so the lookup is free for that request.
 *
 * Matching mirrors Category.jsx — an explicit `slug`, or the name slugified.
 *
 * Returns undefined when the list itself is unavailable, so callers can tell
 * "no such category" from "backend is down". See getProduct for why.
 */
export const getCategory = cache(async (slug) => {
  if (!slug) return null;

  const categories = await getCategories();
  if (!categories.length) return undefined;

  return (
    categories.find((c) => c.slug === slug || toSlug(c.name) === slug) ?? null
  );
});

/* ---------- Single product ---------- */

/**
 * One product document.
 *
 * Three distinct outcomes, because the page calls notFound() on a missing
 * product and getting that wrong is expensive:
 *
 *   document  – found
 *   null      – the API answered 404: this product genuinely does not exist
 *   undefined – the request failed (network, timeout, 5xx): existence unknown
 *
 * Collapsing the last two into one value would mean a backend outage serves a
 * real 404 for every product page, and Google de-indexes the whole catalogue as
 * it recrawls. Callers must only notFound() on an explicit null.
 */
export const getProduct = cache(async (slug) => {
  if (!slug) return null;
  try {
    const res = await fetch(apiUrl(`/api/products/${slug}`), {
      next: { revalidate: COSMETICS_REVALIDATE_SECONDS },
      headers: {
        Origin: STORE_ORIGIN,
      },
    });

    if (res.status === 404) return null;
    if (!res.ok) return undefined;

    const data = await res.json();
    const doc = Array.isArray(data) ? data[0] : (data?.data ?? data);

    // An empty body or empty object is the backend's other way of saying "no".
    return doc && Object.keys(doc).length > 0 ? doc : null;
  } catch {
    return undefined;
  }
});
