"use client";
/**
 * Shared, module-level cache for the Grains catalogue.
 *
 * The request logic below is UNCHANGED from DataProvider — it was hoisted out of
 * the component so it can be started early (from the Landing page, while it
 * idles) and reused later, instead of only starting when /grains mounts.
 *
 * Because the cache lives at module scope it survives component unmount/remount
 * across client-side navigation, so the catalogue is requested at most once per
 * page load:
 *   - concurrent callers share the same in-flight promise
 *   - callers arriving after it resolves get the cached value, no request at all
 *
 * Nothing here runs on the server: the only callers are effects in client
 * components, so `cached` is always null during SSR and the server keeps
 * rendering the static fallback exactly as before.
 */
import { fetchJson } from "./fetchJson";

const BASE_URL = process.env.NEXT_PUBLIC_PRODUC_URI;

/* ---------- helpers (moved verbatim from DataProvider) ---------- */
const list = (v) => (Array.isArray(v) ? v : []);
const getCategoryName = (c) => c?.name || c?.title || c?.categoryName || "";
const getCategorySlug = (c) => c?.slug || c?.categorySlug || c?.id || "";
const getProductName = (p) => p?.name || p?.title || p?.productName || "";
const matchProductCategory = (product, catSlug, catName) => {
  const val = (product?.category_slug || product?.categorySlug || product?.category || product?.categoryName || "").toLowerCase();
  return val === catSlug.toLowerCase() || val === catName.toLowerCase();
};

let inflight = null; // the single in-flight request, shared by every caller
let cached = null;   // resolved catalogue; null = not loaded / API unusable

/** The catalogue if it has already arrived, else null. Never starts a request. */
export const getCachedGrainsData = () => cached;

/**
 * Start — or join — the one catalogue request.
 *
 * Resolves with the catalogue, or with null when the API is unavailable or
 * returns nothing, in which case callers keep their static fallback exactly as
 * they did before. Never rejects.
 */
export function loadGrainsData() {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
  if (!BASE_URL) return Promise.resolve(null);

  inflight = (async () => {
    try {
      const [catsData, prodsData, featData] = await Promise.all([
        fetchJson(`${BASE_URL}/api/grains/categories`),
        fetchJson(`${BASE_URL}/api/grains/products`),
        fetchJson(`${BASE_URL}/api/grains/products/featured`),
      ]);

      const cats = list(catsData.data ?? catsData.categories ?? catsData);
      const prods = list(prodsData.data ?? prodsData.products ?? prodsData);
      const feat = list(featData.data ?? featData.products ?? featData);

      if (!cats.length && !prods.length) {
        console.log("Using static fallback data as API returned empty.");
        return null;
      }

      // Build the category → product dropdown menu.
      const menu = await Promise.all(
        cats.map(async (cat) => {
          const catName = getCategoryName(cat);
          const catSlug = getCategorySlug(cat);
          let products;
          try {
            const d = await fetchJson(`${BASE_URL}/api/grains/categories/${catSlug}/products`);
            products = list(d.data ?? d.products ?? d);
          } catch {
            products = prods.filter((pr) => matchProductCategory(pr, catSlug, catName));
          }
          return {
            title: catName,
            dropdownClass: catName.toLowerCase().includes("flour") ? "flour-dropdown" : undefined,
            links: products.map((pr) => ({ name: getProductName(pr), slug: pr?.slug || "" })).filter((l) => l.name),
          };
        })
      );

      cached = { allProducts: prods, featuredProducts: feat, categoryMenu: menu };
      return cached;
    } catch (err) {
      console.warn("Grains API unavailable - using fallback data:", err.message);
      return null;
    } finally {
      // Clearing this lets a failed attempt be retried later; on success the
      // `cached` short-circuit above means no further request is ever made.
      inflight = null;
    }
  })();

  return inflight;
}
