"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_PATH } from "./lib/asset";
import Home from './Components/Home';
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

export default function Page() {
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
