// Never pre-render at build time — always render on demand (avoids build-time API calls)
export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import Header from "../../Components/Header";
import ProductDetails from "../../Components/Product";
import Footer from "../../Components/Footer";
import { getProduct, getCategoryProducts } from "../../lib/data";
import { buildMetadata } from "@/lib/seo";

// Same mapping as Product.jsx for catcode → slug fallback
const CATCODE_TO_SLUG = {
  cat001: "lip-care",
  cat002: "skin-care",
  cat003: "hair-care",
  cat004: "hygiene",
};

/* ---------- Metadata ---------- */

const pathForSlug = (slug) => `/cosmetics/products/${slug}`;

/**
 * Title, description and keywords come from the `seo` block on the product's
 * MongoDB document. Until that block is populated the page inherits the
 * cosmetics section defaults from ../../layout.js, exactly as today.
 *
 * The canonical is always emitted — it derives from the URL, not the database.
 *
 * getProduct() is wrapped in React cache(), and the page component below calls
 * it with the same slug, so metadata and the page share ONE backend request.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  return buildMetadata({
    doc: await getProduct(slug),
    path: pathForSlug(slug),
    pathForSlug,
  });
}

/* ---------- Page (async Server Component) ---------- */

export default async function ProductPage({ params }) {
  // In Next.js 15+, params is a Promise — must be awaited
  const { slug } = await params;

  const product = await getProduct(slug);

  // Only an explicit 404 from the API proves the product is gone. getProduct()
  // returns undefined when the request failed, and 404ing on that would turn a
  // backend outage into a de-indexed catalogue.
  if (product === null) notFound();

  let relatedProducts = [];
  if (product) {
    // Prefer the curated `related_products` embedded in the product document.
    if (Array.isArray(product.related_products) && product.related_products.length > 0) {
      relatedProducts = product.related_products;
    } else {
      // Fallback: other products from the same category.
      const catSlug =
        product.category_slug ||
        CATCODE_TO_SLUG[product.catcode] ||
        product.catcode;

      const allCatProducts = await getCategoryProducts(catSlug);
      // Exclude the current product from the related list
      relatedProducts = allCatProducts.filter(
        (p) => p.slug !== slug && p.product_id !== slug
      );
    }
  }

  return (
    <>
      <Header />
      <ProductDetails
        initialProduct={product ?? null}
        initialRelatedProducts={relatedProducts}
      />
      <Footer />
    </>
  );
}
