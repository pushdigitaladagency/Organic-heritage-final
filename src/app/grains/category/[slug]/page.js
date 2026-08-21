// Never pre-render at build time; category metadata depends on the live grains API.
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import HomeClient from "../../Components/HomeClient";
import { getGrainCategory } from "../../lib/data";
import { buildMetadata } from "@/lib/seo";

/* ---------- Metadata ---------- */

const pathForSlug = (slug) => `/grains/category/${slug}`;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return buildMetadata({
    doc: await getGrainCategory(slug),
    path: pathForSlug(slug),
    pathForSlug,
  });
}

/* ---------- Page (async Server Component) ---------- */

export default async function GrainCategoryPage({ params }) {
  const { slug } = await params;
  const category = await getGrainCategory(slug);

  if (category === null) notFound();

  return <HomeClient />;
}
