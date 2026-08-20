// Never pre-render at build time — always render on demand (avoids build-time API calls)
export const dynamic = 'force-dynamic';

import Header from "../../Components/Header";
import ProductDetails from "../../Components/Product";
import Footer from "../../Components/Footer";
import { getProduct, getCategoryProducts } from "../../lib/data";

// Same mapping as Product.jsx for catcode → slug fallback
const CATCODE_TO_SLUG = {
  cat001: "lip-care",
  cat002: "skin-care",
  cat003: "hair-care",
  cat004: "hygiene",
};

/* ---------- Page (async Server Component) ---------- */

export default async function ProductPage({ params }) {
  // In Next.js 15+, params is a Promise — must be awaited
  const { slug } = await params;

  const product = await getProduct(slug);

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
        initialProduct={product}
        initialRelatedProducts={relatedProducts}
      />
      <Footer />
    </>
  );
}
