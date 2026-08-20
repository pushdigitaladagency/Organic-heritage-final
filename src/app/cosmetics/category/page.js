// Never pre-render at build time — always render on demand (avoids build-time API calls)
export const dynamic = 'force-dynamic';

import Header from "../Components/Header";
import Category from "../Components/Category";
import Footer from "../Components/Footer";
import { getCategories, getCategoryProducts, toSlug } from "../lib/data";

/* ---------- Page (async Server Component) ---------- */

export default async function CategoryPage() {
  const categories = await getCategories();

  // Determine the first category's slug to pre-load its products
  const firstCat = categories[0] ?? null;
  const firstSlug = firstCat
    ? (firstCat.slug || toSlug(firstCat.name))
    : null;

  const initialProducts = await getCategoryProducts(firstSlug);

  return (
    <>
      <Header />
      <Category
        initialCategories={categories}
        initialProducts={initialProducts}
        initialSlug={firstSlug}
      />
      <Footer />
    </>
  );
}
