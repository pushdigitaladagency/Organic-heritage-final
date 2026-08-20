// Never pre-render at build time — always render on demand (avoids build-time API calls)
export const dynamic = 'force-dynamic';

import Header from "../../Components/Header";
import Category from "../../Components/Category";
import Footer from "../../Components/Footer";
import { getCategories, getCategoryProducts } from "../../lib/data";

/* ---------- Page (async Server Component) ---------- */

export default async function CategoryPage({ params }) {
  // In Next.js 15+, params is a Promise — must be awaited
  const { slug } = await params;

  // Fetch both in parallel — one round-trip before any client JS runs.
  // Both reads hit the shared Data Cache, so categories are reused across routes.
  const [categories, initialProducts] = await Promise.all([
    getCategories(),
    getCategoryProducts(slug),
  ]);

  return (
    <>
      <Header />
      <Category
        initialCategories={categories}
        initialProducts={initialProducts}
        initialSlug={slug}
      />
      <Footer />
    </>
  );
}
