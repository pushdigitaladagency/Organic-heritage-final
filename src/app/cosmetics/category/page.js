// Never pre-render at build time — always render on demand (avoids build-time API calls)
export const dynamic = 'force-dynamic';

import Header from "../Components/Header";
import Category from "../Components/Category";
import Footer from "../Components/Footer";
import { getCategories, getCategoryProducts, toSlug } from "../lib/data";
import { absoluteUrl } from "@/lib/seo";

// This hub renders the FIRST category's products, so its body overlaps
// /cosmetics/category/<first-slug>. Two things keep them from competing:
// copy written about the range as a whole rather than about whichever category
// happens to load first, and a self-canonical — the hub owns the category
// switcher and is the header's link target, so it earns its own listing.
//
// Static content with no MongoDB document behind it; edit the copy here.
export const metadata = {
  title: "Shop Natural Cosmetics by Category | Organic Heritage",
  description:
    "Browse every Organic Heritage cosmetics category — lip care, skin care, hair care and hygiene — and find the natural product that suits you.",
  keywords: [
    "natural cosmetics categories",
    "herbal skin care range",
    "organic hair care India",
    "natural lip care",
  ],
  alternates: { canonical: absoluteUrl("/cosmetics/category") },
};

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
