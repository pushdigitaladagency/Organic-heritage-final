// Single source of truth for page SEO across the merged app.
//
// Scope, deliberately narrow: meta title, meta description, keywords and
// canonical URL. Nothing else.
//
// Where the copy comes from:
//   • categories and products -> the `seo` object on their MongoDB document
//   • static pages            -> a plain `metadata` export in the page itself
//
// What happens when a document has no `seo` object yet:
//   title / description / keywords are OMITTED, so Next.js inherits whatever
//   the section layout declares — exactly today's behaviour. Only once a
//   document is populated does its page get its own copy. This is intentional:
//   it makes "populated" vs "not yet" visible in the rendered HTML instead of
//   masking it behind auto-generated text.
//
// The canonical is the exception — it is ALWAYS emitted, because it derives
// from the route's own URL and needs no database support.
//
// Everything here is pure (no fetching), so it imports cleanly into server
// components, client components and the sitemap alike.

export const SITE_URL = "https://organicheritage.store";
export const SITE_NAME = "Organic Heritage";

/* ────────────────────────────────────────────────────────────────────────────
 * Primitives
 * ──────────────────────────────────────────────────────────────────────────── */

const isFilled = (value) => typeof value === "string" && value.trim().length > 0;

/** Flatten a rich-text field to plain text fit for a <meta> attribute. */
export const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Normalise a keywords value for Next metadata.
 * MongoDB already stores the canonical shape as an array, so array entries are
 * passed through in their original order/content. A comma-separated string is
 * still accepted for older admin inputs.
 */
export const toKeywords = (value) => {
  if (Array.isArray(value)) {
    return value.filter(isFilled).map(String);
  }

  if (!isFilled(value)) return [];

  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

/**
 * Exactly one leading slash, no trailing slash, no query or hash.
 * next.config.mjs leaves `trailingSlash` at its default false, so this matches
 * the URL Google actually crawls — a canonical that disagrees with the real URL
 * is worse than none.
 */
export const normalisePath = (path = "/") => {
  const clean = String(path)
    .trim()
    .split(/[?#]/)[0]
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  return clean ? `/${clean}` : "/";
};

/**
 * Absolute URL for a route path. Already-absolute URLs pass through, so an
 * authored canonical_link can point anywhere.
 *
 * Canonicals are emitted absolute rather than relative on purpose: a relative
 * value depends on metadataBase resolving correctly, and a wrong metadataBase
 * produces a wrong canonical silently instead of failing loudly.
 */
export const absoluteUrl = (path = "/") => {
  const value = String(path).trim();
  if (/^https?:\/\//i.test(value)) return value;

  const normalised = normalisePath(value);
  return normalised === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalised}`;
};

/* ────────────────────────────────────────────────────────────────────────────
 * Reading the authored `seo` block off a document
 * ──────────────────────────────────────────────────────────────────────────── */

// Nested objects the SEO block might live under. `seo` is the documented one;
// the rest are accepted so a differently-named block still resolves rather
// than silently producing untagged pages.
const SEO_BLOCKS = ["seo", "meta", "metadata", "seo_meta", "seoMeta"];

const pickFrom = (source, names) => {
  if (!source || typeof source !== "object") return undefined;

  for (const name of names) {
    const value = source[name];
    const present = Array.isArray(value) ? value.length > 0 : isFilled(value);
    if (present) return value;
  }

  return undefined;
};

/**
 * Read one SEO field.
 *
 * Nested blocks are read with short names too, because inside an `seo` object
 * a key called `title` unambiguously means the meta title. The document ROOT is
 * read with explicit meta_* / seo_* names ONLY — otherwise a product's own
 * `title` and `description` (its on-page content) would be mistaken for
 * authored SEO, and every page would look populated when none of them are.
 */
const seoField = (doc, nestedNames, rootNames) => {
  if (!doc || typeof doc !== "object") return undefined;

  for (const block of SEO_BLOCKS) {
    const hit = pickFrom(doc[block], nestedNames);
    if (hit !== undefined) return hit;
  }

  return pickFrom(doc, rootNames);
};

export const seoTitle = (doc) =>
  seoField(
    doc,
    ["meta_title", "metaTitle", "title"],
    ["meta_title", "metaTitle", "seo_title", "seoTitle"],
  );

export const seoDescription = (doc) =>
  seoField(
    doc,
    ["meta_description", "metaDescription", "description"],
    ["meta_description", "metaDescription", "seo_description", "seoDescription"],
  );

export const seoKeywords = (doc) =>
  seoField(
    doc,
    ["meta_keywords", "metaKeywords", "keywords"],
    ["meta_keywords", "metaKeywords", "seo_keywords", "seoKeywords"],
  );

export const seoCanonical = (doc) =>
  seoField(
    doc,
    ["canonical_link", "canonicalLink", "canonical_url", "canonicalUrl", "canonical"],
    [
      "canonical_link",
      "canonicalLink",
      "canonical_url",
      "canonicalUrl",
      "seo_canonical",
      "seoCanonical",
    ],
  );

export const seoPrimarySlug = (doc) =>
  seoField(
    doc,
    ["primary_slug", "primarySlug", "canonical_slug", "canonicalSlug"],
    ["primary_slug", "primarySlug", "canonical_slug", "canonicalSlug"],
  );

/* ────────────────────────────────────────────────────────────────────────────
 * The resolver
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Canonical URL for a route, in precedence order:
 *   1. seo.canonical_link authored on the document
 *   2. seo.primary_slug authored on the document (mapped through pathForSlug)
 *   3. the route's own path, self-referencing
 */
const resolveCanonical = ({ doc, path, pathForSlug }) => {
  const authored = seoCanonical(doc);
  if (isFilled(authored)) return absoluteUrl(authored);

  const primary = seoPrimarySlug(doc);
  if (isFilled(primary) && typeof pathForSlug === "function") {
    return absoluteUrl(pathForSlug(primary.trim()));
  }

  return absoluteUrl(path);
};

/**
 * Build the Next.js Metadata object for one route.
 *
 * @param {object|null} doc           A MongoDB product or category document.
 *                                    Null is fine — and is the norm until the
 *                                    `seo` blocks are authored: the canonical
 *                                    is still emitted, and the page inherits
 *                                    its section layout's title/description.
 * @param {string}      path          This route's own path.
 * @param {function}    [pathForSlug] Maps a primary slug to its path, so an
 *                                    alias page can canonicalise onto it.
 *
 * Title, description and keywords are omitted entirely when not authored, so
 * Next.js falls back to the section layout. An empty meta tag would be worse
 * than an inherited one.
 */
export function buildMetadata({ doc = null, path = "/", pathForSlug } = {}) {
  const metadata = {
    alternates: { canonical: resolveCanonical({ doc, path, pathForSlug }) },
  };

  const title = seoTitle(doc);
  if (isFilled(title)) metadata.title = String(title);

  const description = seoDescription(doc);
  if (isFilled(description)) metadata.description = String(description);

  const keywords = toKeywords(seoKeywords(doc));
  if (keywords.length) metadata.keywords = keywords;

  return metadata;
}
