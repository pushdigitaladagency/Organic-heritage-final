"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_PATH } from "../lib/asset";
import Home from './Home';
import Navbar from "./Navbar";
import Footer from "./Footer";

// Lifted verbatim out of ../page.js so that file can be a server component and
// export metadata — Next.js does not allow metadata exports from a client
// component. Nothing here changed but the import paths.
export default function HomeClient() {
  const router = useRouter();
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  // Navigate to the product's own route, e.g. /grains/product/beetroot-multivitamin-malt
  const handleProductClick = (slug) => {
    if (slug) router.push(`${BASE_PATH}/product/${slug}`);
  };

  return (
    <div>
      <Navbar />
      <Home onProductClick={handleProductClick} onHeroVideoReady={() => setHeroVideoReady(true)} />
      <Footer />
    </div>
  );
}
