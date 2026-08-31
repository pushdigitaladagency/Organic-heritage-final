// Revalidate catalogue data periodically so requests can use Next.js caching.
export const revalidate = 60;

import { notFound } from "next/navigation";
import Header from "../../Components/Header";
import Category from "../../Components/Category";
import Footer from "../../Components/Footer";
import { getCategories, getCategory, getCategoryProducts } from "../../lib/data";
import { buildMetadata } from "@/lib/seo";

/* ---------- Metadata ---------- */

const pathForSlug = (slug) => `/cosmetics/category/${slug}`;

/**
 * Title, description and keywords come from the `seo` block on the category's
 * MongoDB document. Until that block is populated the page inherits the
 * cosmetics section defaults from ../../layout.js, exactly as it does today —
 * nothing is auto-generated, so a populated category is visibly different from
 * one still waiting for copy.
 *
 * The canonical is always emitted; it derives from the URL, not the database.
 *
 * getCategory() reads the same cached category list the page below uses, so
 * this adds no request.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  return buildMetadata({
    doc: await getCategory(slug),
    path: pathForSlug(slug),
    pathForSlug,
  });
}

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

  // Only a category list that actually loaded can prove a slug is bogus.
  // getCategory() returns undefined when the list is unavailable, and 404ing on
  // that would turn a backend outage into a de-indexed catalogue.
  const category = await getCategory(slug);
  if (category === null) notFound();

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
