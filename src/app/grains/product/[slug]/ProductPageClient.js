"use client";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import InnerPage from "../../Components/Product";
import { useGrainsData } from "../../Components/DataProvider";
import { BASE_PATH } from "../../lib/asset";

const PRODUCT_SLUG_ALIASES = {
  "mappillai-samba-health-mix": "mapilai-samba-health-mix",
  "thuyamalli-idiyappam-flour": "thooyamalli-idiyappam-flour",
};

// Lifted verbatim out of ./page.js so that file can be a server component and
// export generateMetadata — Next.js does not allow metadata exports from a
// client component.
//
// useParams() is kept rather than taking the slug as a prop: it reads the same
// value from the same place it always did, which keeps this a pure move with no
// behavioural difference to verify.
export default function ProductPageClient() {
  const router = useRouter();
  const { slug } = useParams();
  const resolvedSlug = PRODUCT_SLUG_ALIASES[slug] || slug;
  const prefetchedData = useGrainsData(); // shared, fetched once in the layout

  const handleBack = () => router.push(BASE_PATH || "/");

  return (
    <div>
      <Navbar onBack={handleBack} key={slug} />
      <InnerPage initialSlug={resolvedSlug} onBack={handleBack} prefetchedData={prefetchedData} />
      <Footer />
    </div>
  );
}
