// Never pre-render at build time — always render on demand, matching the
// cosmetics product route. Without this the build would try to prerender this
// page and call the catalogue API while the backend may be unreachable.
export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import { getGrainProduct } from "../../lib/data";
import { buildMetadata } from "@/lib/seo";

/* ---------- Metadata ---------- */

const pathForSlug = (slug) => `/grains/product/${slug}`;

/**
 * Title, description and keywords come from the `seo` block on the product's
 * MongoDB document — all 35 grains products already have one populated.
 *
 * The canonical is always emitted; it derives from the URL, not the database.
 *
 * getGrainProduct() is wrapped in React cache(), so this and the page component
 * below share ONE backend request.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  return buildMetadata({
    doc: await getGrainProduct(slug),
    path: pathForSlug(slug),
    pathForSlug,
  });
}

/* ---------- Page (async Server Component) ---------- */

export default async function ProductPage({ params }) {
  // In Next.js 15+, params is a Promise — must be awaited
  const { slug } = await params;

  const product = await getGrainProduct(slug);

  // 404 only on an explicit 404 from the API. getGrainProduct() returns
  // undefined when the request merely failed, and that case deliberately falls
  // through to render — the client still has lib/staticData.js to fall back on,
  // so a backend outage never 404s the catalogue.
  //
  // Checked against the live API: the only staticData slugs with no document
  // behind them are two stale spellings that SHOULD 404, so there is no
  // legitimate static-only page this rule can harm.
  if (product === null) notFound();

  return <ProductPageClient />;
}
