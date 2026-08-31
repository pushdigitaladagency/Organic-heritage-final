"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/asset";
import { productImageSrc } from "../lib/productImages";

const productBenefits = {
  "Lip Care": [
    "Natural hydration",
    "Chemical-free",
    "Eco-friendly choice",
    "Rich in nutrients",
  ],
  "Skin Care": [
    "Natural hydration",
    "Chemical-free",
    "Eco-friendly choice",
    "Rich in nutrients",
  ],
  "Hair Care": [
    "Herbal hair oils",
    "Natural shampoos",
    "Hair masks",
    "Scalp care products",
  ],
  Hygiene: [
    "Comfortable",
    "Skin-friendly",
    "Leak prevention",
    "Odor control",
  ],
};

const faqData = [
  {
    question: "Are your products suitable for daily use?",
    answer: "Yes, our products are designed for regular personal care routines.",
  },
  {
    question: "Do you use natural ingredients?",
    answer:
      "We focus on herbal and naturally inspired ingredients wherever possible.",
  },
  {
    question: "Are the products suitable for all skin types?",
    answer:
      "Most products are formulated for general use, though individual sensitivities may vary.",
  },
  {
    question: "Are your products suitable for daily use?",
    answer: "Yes, our products are designed for regular personal care routines.",
  },
];

const productCards = [
  { name: "Lip Care", href: "/cosmetics/category/lip-care", image: "/images/svg/cat001.svg", className: "prd1" },
  { name: "Skin Care", href: "/cosmetics/category/skin-care", image: "/images/svg/cat002.svg", className: "prd2" },
  { name: "Hair Care", href: "/cosmetics/category/hair-care", image: "/images/svg/cat003.svg", className: "prd2" },
  { name: "Hygiene", href: "/cosmetics/category/hygiene", image: "/images/svg/cat004.svg", className: "prd2" },
];

const popularProducts = [
  {
    href: "/cosmetics/products/natural-lipstick",
    image: "natural-lipstick.webp",
    alt: "lipstick",
    title: "Natural lipstick",
    text: "NOURISHES LIPS WHILE ADDING SOFT COLOR",
  },
  {
    href: "/cosmetics/products/herbal-hair-oil-infused-with-moringa-leaves-and-rosemary-oil",
    image: "moringa-rosemary-hair-oil.webp",
    alt: "hair oil",
    title: "Natural Hair Oil",
    text: "NOURISHES HAIR NATURALLY",
  },
  {
    href: "/cosmetics/products/herbal-hair-mask-powder",
    image: "herbal-hair-mask.webp",
    alt: "face pack",
    title: "Hair Mask Powder",
    text: "ENHANCES NATURAL GLOW",
  },
  {
    href: "/cosmetics/products/strawberry-lip-balm",
    image: "strawberry-lip-balm.webp",
    alt: "Strawberry lip balm",
    title: "Strawberry lipbalm",
    text: "MOISTURISES LIPS WITH NATURAL CARE",
  },
  {
    href: "/cosmetics/products/sanitary-pads-made-with-tapioca-fiber-100-plant-based",
    image: "tapioca-sanitary-pads-XL.webp",
    alt: "sanitary pads",
    title: "Sanitary Pads",
    text: "COMFORTABLE PROTECTION",
  },
  {
    href: "/cosmetics/products/herbal-hair-dye-1",
    image: "herbal-hair-dye-1.webp",
    alt: "hair dye",
    title: "Herbal Hair Dye 1",
    text: "NATURAL COLOURING POWDER",
  },
];

const handleProductImageMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  const img = e.currentTarget.querySelector("img");
  if (img) {
    img.style.transformOrigin = `${x}% ${y}%`;
  }
};

const handleProductImageMouseLeave = (e) => {
  const img = e.currentTarget.querySelector("img");
  if (img) {
    img.style.transformOrigin = "center center";
  }
};

export function ExploreIngredientsButton() {
  return (
    <button
      className="explore-btn"
      onClick={() =>
        document.getElementById("philosophy").scrollIntoView({
          behavior: "smooth",
        })
      }
    >
      Explore Ingredients
    </button>
  );
}

export function ProductCategoryCards() {
  const [activeProduct, setActiveProduct] = useState(null);

  return (
    <div className="products-grid">
      {productCards.map((item) => (
        <Link
          href={item.href}
          style={{ textDecoration: "none", color: "inherit" }}
          key={item.name}
        >
          <div
            className={`products-card ${
              activeProduct === item.name ? "active" : ""
            }`}
          >
            <img
              className={item.className}
              src={asset(item.image)}
              alt={item.name}
              decoding="async"
            />

            <div className="product-overlay">
              <div className="benefits-content">
                <h3>Benefits</h3>
                <ul>
                  {productBenefits[item.name].map((benefit, i) => (
                    <li key={i}>{i + 1}.{benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="overlay-text">
                <h3>{item.name}</h3>
                <p
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (item.name === "Hygiene") {
                      setActiveProduct("Hygiene");
                      return;
                    }
                    setActiveProduct(
                      activeProduct === item.name ? null : item.name
                    );
                  }}
                >
                  {activeProduct === item.name ? " " : "Discover →"}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PopularProductCards() {
  return (
    <div className="pp-grid">
      {popularProducts.map((item) => (
        <Link
          href={item.href}
          style={{ textDecoration: "none", color: "inherit" }}
          key={item.title}
        >
          <div className="pp-card">
            <div
              className="pp-img"
              onMouseMove={handleProductImageMouseMove}
              onMouseLeave={handleProductImageMouseLeave}
            >
              <img
                src={productImageSrc(item.image)}
                alt={item.alt}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="pp-content">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function FaqList() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-right">
      {faqData.map((item, index) => (
        <div className="faq-item" key={index}>
          <div
            className="faq-question"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <p>{item.question}</p>

            <span>{openIndex === index ? "−" : "+"}</span>
          </div>

          {openIndex === index && (
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function HomeRouteButton({ className, href, children }) {
  const router = useRouter();

  return (
    <button className={className} onClick={() => router.push(href)}>
      {children}
    </button>
  );
}
