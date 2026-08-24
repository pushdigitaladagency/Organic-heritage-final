"use client";

import "./Category.css";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { asset } from "@/lib/asset";
import { useGetCategoryProductsQuery } from "@/redux/api/cosmeticsApi";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "";

/* ---------------- Helpers ---------------- */

/** Convert a category name to URL slug: "Lip Care" → "lip-care" */
const toSlug = (name = "") =>
  name.trim().toLowerCase().replace(/\s+/g, "-");

/* ---------------- Main Component ---------------- */

export default function Category({
  initialCategories = [],   // pre-fetched by page.js (server)
  initialProducts   = [],   // pre-fetched by page.js for the initial slug
  initialSlug       = null, // the slug page.js was rendered with
}) {
  const params = useParams();
  const router = useRouter();
  const slugFromURL = params?.slug ?? null;   // e.g. "lip-care" or null

  // ── State – seeded from server props so no loading flash ──────────────
  const [categories, setCategories]           = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts]               = useState(initialProducts);
  // Start with no loading spinner if the server already provided data
  const [loadingCategories, setLoadingCategories] = useState(initialCategories.length === 0);
  const [loadingProducts, setLoadingProducts]     = useState(initialProducts.length === 0 && Boolean(initialSlug));
  const [productsError, setProductsError]         = useState(null);
  const [activeProduct, setActiveProduct]         = useState(null);
  const [viewproduct, setViewProduct]             = useState(null);
  // Track which slug the currently-rendered products belong to
  const [currentProductsSlug, setCurrentProductsSlug] = useState(
    initialProducts.length > 0 ? initialSlug : null
  );
  const [requestedProductsSlug, setRequestedProductsSlug] = useState(null);

  const productsQuery = useGetCategoryProductsQuery(requestedProductsSlug, {
    skip: !requestedProductsSlug || requestedProductsSlug === currentProductsSlug,
  });

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

  const handleProductImageTouchMove = (e) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    const img = e.currentTarget.querySelector("img");
    if (img) {
      img.style.transformOrigin = `${x}% ${y}%`;
      img.classList.add("product-image-wrapper--touch-zoom");
    }
  };

  const handleProductImageTouchEnd = (e) => {
    const img = e.currentTarget.querySelector("img");
    if (img) {
      img.classList.remove("product-image-wrapper--touch-zoom");
      img.style.transformOrigin = "center center";
    }
  };

  const productBenefits = {
    "Lip Care": [
      "Natural hydration",
      "Chemical-free",
      "Eco-friendly choice",
      "Rich in nutrients"
    ],
    "Skin Care": [
      "Natural hydration",
      "Chemical-free",
      "Eco-friendly choice",
      "Rich in nutrients"
    ],
    "Hair Care": [
      "Herbal hair oils",
      "Natural shampoos",
      "Hair masks",
      "Scalp care products"
    ],
    "Hygiene": [
      "Comfortable",
      "Skin-friendly",
      "Leak prevention",
      "Odor control"
    ]
  };

  /* ---- Request products for a category slug through RTK Query ---- */
  const fetchProducts = (slug) => {
    if (!slug) return;
    if (slug === currentProductsSlug) return;
    setLoadingProducts(true);
    setProductsError(null);
    setRequestedProductsSlug(slug);
  };

  /* ── Fetch all categories on mount / when URL slug changes ─────────────
   *
   *  PATH A – Server already provided data via props (initialCategories):
   *    • Skip the /api/categories call entirely.
   *    • Only call fetchProducts when the user navigates to a different slug.
   *
   *  PATH B – No server data (component used standalone):
   *    • Full client-side fetch as before.
   * ───────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const slug = slugFromURL;

    /* ── PATH A ───────────────────────────────────────────────────── */
    if (initialCategories.length > 0) {
      // Sync the highlighted category card with the current URL slug
      if (slug) {
        const matched = categories.find(
          (c) => c.slug === slug || toSlug(c.name) === slug
        );
        setSelectedCategory(matched ?? null);
        setViewProduct(matched?.name ?? null);
      } else if (categories.length > 0) {
        setSelectedCategory(categories[0]);
        setViewProduct(categories[0].name);
      }

      // Only hit the API when the slug has actually changed
      const targetSlug = slug || (categories[0] ? (categories[0].slug || toSlug(categories[0].name)) : null);
      if (targetSlug && targetSlug !== currentProductsSlug) {
        fetchProducts(targetSlug);
      }
      return; // skip PATH B
    }

    /* ── PATH B: full client-side fetch ──────────────────────────── */
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get(`${BASE_URL}/api/categories`);

        // Normalise categories response
        const catList = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? res.data?.categories ?? [];
        setCategories(catList);

        if (slug) {
          const matched = catList.find(
            (c) => c.slug === slug || toSlug(c.name) === slug
          );
          setSelectedCategory(matched ?? null);
          setViewProduct(matched?.name ?? null);
          fetchProducts(slug);
        } else if (catList.length > 0) {
          const firstCat = catList[0];
          setSelectedCategory(firstCat);
          setViewProduct(firstCat.name);
          fetchProducts(firstCat.slug || toSlug(firstCat.name));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugFromURL]);

  useEffect(() => {
    if (!requestedProductsSlug || requestedProductsSlug === currentProductsSlug) {
      return;
    }

    if (productsQuery.isLoading || productsQuery.isFetching) {
      setLoadingProducts(true);
      setProductsError(null);
      return;
    }

    if (productsQuery.isError) {
      console.error("Failed to fetch products:", productsQuery.error);
      setProductsError("Could not load products. Please try again.");
      setProducts([]);
      setLoadingProducts(false);
      return;
    }

    if (productsQuery.isSuccess) {
      setProducts(productsQuery.data ?? []);
      setCurrentProductsSlug(requestedProductsSlug);
      setProductsError(null);
      setLoadingProducts(false);
    }
  }, [
    requestedProductsSlug,
    currentProductsSlug,
    productsQuery.data,
    productsQuery.error,
    productsQuery.isError,
    productsQuery.isFetching,
    productsQuery.isLoading,
    productsQuery.isSuccess,
  ]);

  /* ---- Scroll-reveal animation whenever products list changes ---- */
  useEffect(() => {
    if (products.length === 0) return;

    const frame = requestAnimationFrame(() => {
      const els = document.querySelectorAll(
        ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-img"
      );
      if (!els.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
      );

      els.forEach((el) => {
        el.classList.remove("is-visible");
        observer.observe(el);
      });

      return () => observer.disconnect();
    });

    return () => cancelAnimationFrame(frame);
  }, [products]);

  /* ---- Handle category card click ---- */
  const handleCategoryClick = (category) => {
    // Derive slug from backend field or from name
    const slug = category.slug || toSlug(category.name);
    setSelectedCategory(category);
    setViewProduct(category.name);
    fetchProducts(slug);

    // Update the URL so the page is bookmarkable / shareable
    router.push(`/cosmetics/category/${slug}`, { scroll: false });

    // Scroll to the featured products section
    setTimeout(() => {
      const target = document.getElementById("featured-products");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  /* ---- Determine active-card highlight slug ---- */
  const getItemSlug = (item) => item.slug || toSlug(item.name);
  const selectedSlug = selectedCategory
    ? getItemSlug(selectedCategory)
    : null;

  return (
    <div className="Category-page">
      {/* ---------------- Category Section ---------------- */}

      <section className="category-section">
        <div className="category-header reveal-up">
          <p className="category-subtitle">PRODUCTS</p>
          <h2 className="category-title">Crafted by Category</h2>
        </div>

        {loadingCategories ? (
          <div className="category-loading">
            <p>Loading categories…</p>
          </div>
        ) : (
          <div className="category-grid">
            {categories.map((item) => {
              const itemSlug = getItemSlug(item);
              return (
                <div
                  className={`category-card ${
                    activeProduct === item.name ? "active" : ""
                  }${
                    selectedSlug === itemSlug
                      ? " category-card--active"
                      : ""
                  } ${viewproduct === item.name ? "category-card--view" : ""}`}
                  key={item._id || itemSlug}
                  onClick={() => handleCategoryClick(item)}
                  onMouseLeave={() => setActiveProduct(null)}
                >
                  <img
                    className="category-card-bg shimmer-img"
                    src={asset(`/images/${item.catcode || itemSlug}.svg`)}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    onLoad={e => e.currentTarget.classList.add('img-loaded')}
                  />

                  <div className="product-overlay">
                    <div className="benefits-content">
                      <h3>Benefits</h3>
                      <ul>
                        {Object.keys(productBenefits).find(
                          (k) => k.toLowerCase() === item.name.toLowerCase()
                        ) ? (
                          productBenefits[
                            Object.keys(productBenefits).find(
                              (k) => k.toLowerCase() === item.name.toLowerCase()
                            )
                          ].map((benefit, i) => (
                            <li key={i}>{i + 1}.{benefit}</li>
                          ))
                        ) : (
                          <>
                            <li>1. Natural hydration</li>
                            <li>2. Chemical-free</li>
                            <li>3. Eco-friendly choice</li>
                            <li>4. Rich in nutrients</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="overlay-text">
                      <h3>{item.name}</h3>
                      <p onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveProduct(activeProduct === item.name ? null : item.name);
                      }}>
                        {activeProduct === item.name ? "Close X" : "Discover →"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------- Featured Products Section ---------------- */}

      <section className="featured-section" id="featured-products">
        <div className="featured-header reveal-up">
          <p className="featured-subtitle">FEATURED</p>
          <h2 className="featured-title">
            {selectedCategory ? selectedCategory.name : "Products"}
          </h2>
        </div>

        {loadingProducts ? (
          <div className="category-loading">
            <p>Loading products…</p>
          </div>
        ) : productsError ? (
          <div className="category-loading">
            <p style={{ color: "#b00" }}>{productsError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="category-loading">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="featured-grid">
            {products.map((item) => {
              const productSlug = item.slug || toSlug(item.name);
              return (
                <Link
                  href={`/cosmetics/products/${productSlug}`}
                  key={productSlug}
                  style={{ textDecoration: "none" }}
                >
                  <div className="product-card">
                    <div
                      className="product-image-wrapper"
                      onMouseMove={handleProductImageMouseMove}
                      onMouseLeave={handleProductImageMouseLeave}
                      onTouchMove={handleProductImageTouchMove}
                      onTouchEnd={handleProductImageTouchEnd}
                      onTouchCancel={handleProductImageTouchEnd}
                    >
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : asset(item.image?.startsWith("/images/") ? item.image : `/images/${item.image}`)
                        }
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="shimmer-img"
                        onLoad={e => e.currentTarget.classList.add('img-loaded')}
                      />
                    </div>

                    <div className="product-content">
                      <div>
                        <h3>{item.name}</h3>

                        {item.subtitle && (
                          <p className="product-subtitle">{item.subtitle}</p>
                        )}
                      </div>

                      <button className="arrow-btn">
                        <ArrowRight size={22} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
