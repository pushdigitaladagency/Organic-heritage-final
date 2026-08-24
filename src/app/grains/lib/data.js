import { cache } from "react";

/**
 * Server-side data layer for the Grains section.
 *
 * Why it exists: Grains was client-only (RTK Query inside DataProvider), and
 * generateMetadata cannot read a client cache. Rendering per-product meta tags
 * needs the product document on the SERVER, which is what this provides.
 *
 * It mirrors src/app/cosmetics/lib/data.js — same React cache() render-pass
 * de-duping, with persistent fetch caching bypassed so newly authored MongoDB
 * SEO fields are visible immediately in <head>. RTK Query, DataProvider and
 * the static fallback are untouched: the client components keep working exactly
 * as before, and this runs alongside them purely so the server can write
 * metadata.
 */

const BASE_URL = process.env.NEXT_PUBLIC_PRODUC_URI;
const STORE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://organicheritage.store";

/**
 * Grains pages previously did NO server-side fetching — they rendered instantly
 * from static data and hydrated from the API in the browser. Introducing an
 * unbounded server await would turn a slow or dead backend into a slow or dead
 * page, a regression this SEO work has no business causing.
 *
 * So the fetch is bounded. On timeout the helper reports "unavailable", the
 * page still renders from static data exactly as it does today, and the
 * metadata falls back to the section defaults instead of hanging the request.
 */
const TIMEOUT_MS = 12000;

const list = (value) => (Array.isArray(value) ? value : []);

const toSlug = (value = "") =>
  String(value).trim().toLowerCase().replace(/\s+/g, "-");

const getCategorySlug = (category) =>
  category?.slug || category?.categorySlug || category?.id || "";

const getCategoryName = (category) =>
  category?.name || category?.title || category?.categoryName || "";

const request = async (path) => {
  if (!BASE_URL) return { ok: false, status: 0, data: null };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      cache: "no-store",
      headers: {
        Origin: STORE_ORIGIN,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return { ok: false, status: res.status, data: null };

    return { ok: true, status: res.status, data: await res.json() };
  } catch {
    // Network error, malformed JSON, or AbortError from the timeout above.
    return { ok: false, status: 0, data: null };
  }
};

/* ---------- Categories ---------- */

export const getGrainCategories = cache(async () => {
  const { ok, data } = await request("/api/grains/categories");

  if (!ok) return [];
  return list(Array.isArray(data) ? data : (data?.data ?? data?.categories));
});

/* ---------- Single category ---------- */

export const getGrainCategory = cache(async (slug) => {
  if (!slug) return null;

  const categories = await getGrainCategories();
  if (!categories.length) return undefined;

  return (
    categories.find((category) => {
      const categorySlug = getCategorySlug(category);
      const categoryName = getCategoryName(category);

      return categorySlug === slug || toSlug(categoryName) === slug;
    }) ?? null
  );
});

/* ---------- All products ---------- */

export const getGrainProducts = cache(async () => {
  const { ok, data } = await request("/api/grains/products");

  if (!ok) return [];
  return list(Array.isArray(data) ? data : (data?.data ?? data?.products));
});

/* ---------- Single product ---------- */

/**
 * One grains product document.
 *
 * Three distinct outcomes, matching the cosmetics layer:
 *
 *   document  – found
 *   null      – the API answered 404: this product genuinely does not exist
 *   undefined – the request failed or timed out: existence unknown
 *
 * Callers must only treat an explicit null as missing. The undefined case must
 * fall through and render, so a backend outage never 404s the catalogue.
 */
export const getGrainProduct = cache(async (slug) => {
  if (!slug) return null;

  const { ok, status, data } = await request(`/api/grains/products/${slug}`);

  if (!ok) return status === 404 ? null : undefined;

  // Same unwrapping the client uses in Components/Product.js.
  const doc = Array.isArray(data)
    ? data[0]
    : (data?.data ?? data?.product ?? data);

  return doc && Object.keys(doc).length > 0 ? doc : null;
});
