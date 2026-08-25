"use client";

import React, { useEffect, useState } from "react";
import "./Product.css";
import {
  ArrowLeft,
  Star,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { asset } from "@/lib/asset";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "";
const MAILER_URL = process.env.NEXT_PUBLIC_MAILER_API;

// Maps catcode → category slug for back-navigation.
// Update this if new categories are added in the backend.
const CATCODE_TO_SLUG = {
  cat001: "lip-care",
  cat002: "skin-care",
  cat003: "hair-care",
  cat004: "hygiene",
};

export default function ProductDetails({
  initialProduct          = null, // pre-fetched by page.js (server)
  initialRelatedProducts  = [],   // pre-fetched by page.js via /api/categories/:slug/products
}) {
  const params = useParams();
  const router = useRouter();

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
      img.classList.add("product-image--touch-zoom");
    }
  };

  const handleProductImageTouchEnd = (e) => {
    const img = e.currentTarget.querySelector("img");
    if (img) {
      img.classList.remove("product-image--touch-zoom");
      img.style.transformOrigin = "center center";
    }
  };

  const slug = params?.slug;
  const [catSlug, setCatSlug] = useState(null);
  // Seed product state from server props — no loading flash when props provided
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(initialProduct === null);   // false if pre-fetched
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [displayedQuantity, setDisplayedQuantity] = useState(null);
  const [isImageFading, setIsImageFading] = useState(false);
  const [imgLoaded, setImgLoaded]         = useState(false);  // skeleton tracker
  // Related products from the same category (fetched server-side)
  const [relatedProducts, setRelatedProducts] = useState(initialRelatedProducts);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    /* ── Helper: initialise variant / catSlug from a product object ──────── */
    const applyProductData = (productData) => {
      setCatSlug(
        productData.category_slug ||
        CATCODE_TO_SLUG[productData.catcode] ||
        productData.catcode
      );
      if (productData.variants && productData.variants.length > 0) {
        if (productData.variants.includes("Pink"))       setSelectedQuantity("Pink");
        else if (productData.variants.includes("pink")) setSelectedQuantity("pink");
        else                                             setSelectedQuantity(productData.variants[0]);
      } else if (productData.hero_section?.sizes?.length > 0) {
        const sizes = productData.hero_section.sizes;
        if (sizes.includes("XL"))       setSelectedQuantity("XL");
        else if (sizes.includes("xl")) setSelectedQuantity("xl");
        else                           setSelectedQuantity(sizes[0]);
      } else if (Array.isArray(productData.hero_section?.net_quantity) && productData.hero_section.net_quantity.length > 0) {
        const nq = productData.hero_section.net_quantity;
        setSelectedQuantity(nq.includes("100 ml") ? "100 ml" : nq[0]);
      } else {
        setSelectedQuantity(null);
      }
    };

    /* ── PATH A: product was pre-fetched by page.js ────────────────────── */
    if (initialProduct) {
      applyProductData(initialProduct);
      return; // skip client-side fetch entirely
    }

    /* ── PATH B: no server data – full client-side fetch ───────────────── */
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/products/${slug}`);
        if (!res.ok) throw new Error(`Failed to fetch product (${res.status})`);
        const data = await res.json();
        // Normalise — API may return array, single object, or { data: {} }
        const productData = Array.isArray(data) ? data[0] : data?.data ?? data;
        setProduct(productData);
        applyProductData(productData);
        if (Array.isArray(productData?.related_products)) {
          setRelatedProducts(productData.related_products);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  /* Sync scroll reveal with product render */
  useEffect(() => {
    // Only run once product data is loaded and in the DOM
    if (loading || !product) return;

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
  }, [product, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData({
        ...formData,
        [name]: value.replace(/\D/g, ""),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = "Enter valid 10 digit number";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const submitEnquiry = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(MAILER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          product: product.name,
        }),
      });

      if (!res.ok) throw new Error("Failed to send enquiry");

      setFormData({ name: "", email: "", phone: "", message: "" });
      setFormErrors({});
      setSuccessMessage("Enquiry submitted successfully ✅");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setSuccessMessage("Something went wrong. Please try again. ❌");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="product-loading" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p>Loading product…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-loading" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p>{error ?? "Product not found."}</p>
      </div>
    );
  }

  const hero = product.hero_section ?? {};
  const story = product.story_section ?? {};

 

  return (
    <div className="product-page">

      {/* ================= HEADER ================= */}


      {/* ================= BREADCRUMB ================= */}
      <div className="breadcrumb reveal-up">
        <Link href={`/cosmetics/category/${catSlug}`} style={{ textDecoration: "none", color: "inherit" }}>
          <ArrowLeft size={16} />
        </Link>

        <span>Products</span>
        <span>·</span>
        <span>{product.category_slug}</span>
        <span>·</span>
        <span>{product.name}</span>
      </div>

      {/* ================= PRODUCT SECTION ================= */}
      <section className="product-section">

        {/* LEFT IMAGE */}
        <div
          className="product-image-card reveal-left"
          onMouseMove={handleProductImageMouseMove}
          onMouseLeave={handleProductImageMouseLeave}
          onTouchMove={handleProductImageTouchMove}
          onTouchEnd={handleProductImageTouchEnd}
          onTouchCancel={handleProductImageTouchEnd}
        >
          {/* Shimmer skeleton — visible until image fires onLoad */}
          <div className={`product-img-skeleton${imgLoaded ? ' hidden' : ''}`} />

          <img
            src={asset(`/images/${selectedQuantity ? product.image.replace('.svg', `-${selectedQuantity.replace(/\s/g, '')}.svg`) : product.image}`)}
            alt={product.name}
            fetchPriority="high"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            style={{ opacity: imgLoaded ? 1 : 0 }}
            className={`product-image${isImageFading ? ' product-image--fading' : ''}`}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="product_content reveal-right">

          <div className="collection-badge">
            <img src={asset("/images/Icon2.svg")} alt="" loading="lazy" decoding="async" />{hero.collection?.toUpperCase()}
          </div>

          <h1 className="product-title">
            {hero.title}{" "}

            <>{selectedQuantity && `-${selectedQuantity}`}</>
          </h1>

          <p className="product-description">
            {hero.short_description}
          </p>

          {/* RATING */}
          <div className="rating-row">

            <div className="stars">
              <Star fill="#4F6D42" strokeWidth={0} />
              <Star fill="#4F6D42" strokeWidth={0} />
              <Star fill="#4F6D42" strokeWidth={0} />
              <Star fill="#4F6D42" strokeWidth={0} />
              
              {hero.rating}
            </div>

            <span className="rating-text">
               {hero.reviews}
            </span>

          </div>

          {/* VARIANT COLORS (Lipstick only) */}
 {product.variants && product.variants.length > 0 && (
  <>

    <div className="variant-row">
      {product.variants.map((variant, i) => (
        <button
          key={i}
          className={`variant-circle ${
            selectedQuantity === variant ? "active" : ""
          }`}
          style={{
            width: "44px",
            height: "44px",
            marginLeft: "10px",
            borderRadius: "50%",
            marginBottom: "14px",
            backgroundColor: {
              Pink: "#F4A7C1",
              Red: "#B31B1B",
              Brown: "#8B5A5A",
              Maroon: "#5C0A0A",
            }[variant] || "#ccc",
            cursor: "pointer",
          }}
          onClick={() => {
            if (variant === selectedQuantity) return;
            setImgLoaded(false);
            setIsImageFading(true);
            setTimeout(() => {
              setSelectedQuantity(variant);
              setDisplayedQuantity(variant);
              setIsImageFading(false);
            }, 320);
          }}
          title={variant}
        />
      ))}
    </div>
  </>
)}

          {/* BUTTON */}
          <button
            className="enquiry-btn"
            onClick={() => {
              const el = document.getElementById("enquiry");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <MessageCircle size={18} />
            Enquiry
          </button>

          {/* DIVIDER */}
          <div className="divider"></div>

          {/* PRODUCT INFO */}



          <div className="info-grid">

            {
              hero.sizes?.length === 3 ? (
                <div className="info-box">

                  <div className="size-options">
                    {hero.sizes.map((size, i) => (
                      <button
                        key={i}
                        className={`size-btn${selectedQuantity === size ? ' active' : ''}`}
                        onClick={() => {
                          if (size === selectedQuantity) return;
                          setImgLoaded(false);
                          setIsImageFading(true);
                          setTimeout(() => {
                            setSelectedQuantity(size);
                            setIsImageFading(false);
                          }, 320);
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>

                  <div className="info-box" id={Array.isArray(hero?.net_quantity) && hero.net_quantity.length > 1 ? "netedit" : " "} >
                    {Array.isArray(hero?.net_quantity) ? (

                      hero.net_quantity.map((item, idx) => (
                        <button
                          key={idx}
                          className={`quantity-btn${selectedQuantity === item ? ' active' : ''}`}
                          onClick={() => {
                            if (item === selectedQuantity) return;
                            setImgLoaded(false);
                            setIsImageFading(true);
                            setTimeout(() => {
                              setSelectedQuantity(item);
                              setIsImageFading(false);
                            }, 320);
                          }}
                        >
                          {item}
                        </button>
                      ))
                    ) : (
                      <h4>{hero?.net_quantity}</h4>
                    )}

                    {
                      !(Array.isArray(hero?.net_quantity) && hero.net_quantity.length > 1) && (
                        <p>Net Quantity</p>
                      )
                    }
                  </div>

                  <div className="info-box">
                    <h4>Hero Ingredients</h4>

                    {hero.hero_ingredients?.map((ingredient, i) => (
                      <p key={i}>{ingredient}</p>
                    ))}
                  </div>

                  <div className="info-box">
                    <h4>{hero.suitability}</h4>
                    <p>Suitability</p>
                  </div>



                </>
              )
            }



          </div>
        </div>
      </section>

      <section className="ritual-section">
        <div className="ritual-left reveal-left">
          <p className="ritual-label">THE STORY</p>

          <h2 className="ritual-title">
            {story.heading?.split(",")[0]},{" "}
            <span>{story.heading?.split(",")[1]?.trim().split(" ")[0]}</span>
            <br />
            {story.heading?.split(",")[1]?.trim().split(" ").slice(1).join(" ")}
          </h2>

          <p className="ritual-desc">
            {story.description}
          </p>

          <h4 className="ritual-claim">
            {story.claim}
          </h4>
        </div>

        <div className="ritual-right reveal-right">
          <div className="ritual-card">
            <h3>Main Benefits</h3>

            <ol>
              {story.main_benefits?.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ol>

            <h4>Suitability</h4>

            <ol>
              {story.suitability?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="ritual-card">
            <h3>Benefits List</h3>


            {story.benefits_list?.map((benefit, i) => (
              <span key={i}>
                <img src={asset("/images/Icon3.svg")} alt="" loading="lazy" decoding="async" /> {benefit} <br />
              </span>
            ))}

          </div>

          <div className="ritual-card">
            <h3>Safety Warnings</h3>

            {story.safety_warnings?.map((warning, i) => (
              <p key={i}>{warning}</p>
            ))}

            <h4>Storage Instructions</h4>

            {story.storage_instructions?.map((instruction, i) => (
              <p key={i}>{instruction}</p>
            ))}
          </div>

          <div className="ritual-card">

            {
              hero.sizes?.length === 3 ? (
                <>
                  <h3>Net Quantity</h3>

                  {story.net_quantity?.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </>
              ) : (
                <>
                  <h3>How to Use</h3>

                  {story.how_to_use?.map((tip, i) => (
                    <p key={i}>{tip}</p>
                  ))}
                </>
              )
            }




          </div>
        </div>
      </section>

      <section className="contact-section" id="enquiry" >
        <div className="contact-heading reveal-up" >
          <p className="contact-subtitle">
            SPEAK WITH US
          </p>

          <h2>
            Have a <span>question?</span>
          </h2>

          <p className="contact-description">
            Tell us a little and we'll be in touch within 24 hours.
          </p>
        </div>

        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={submitEnquiry}>
            <div className="contact-grid">
              <div className="contact-input-wrapper">
                <input
                  type="text"
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {formErrors.name && (
                  <span className="contact-error-text">{formErrors.name}</span>
                )}
              </div>

              <div className="contact-input-wrapper">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && (
                  <span className="contact-error-text">{formErrors.email}</span>
                )}
              </div>

              <div className="contact-input-wrapper">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                />
                {formErrors.phone && (
                  <span className="contact-error-text">{formErrors.phone}</span>
                )}
              </div>

              <div className="select-box">
                <label>Product</label>

                <select>
                  <option>{product.name}</option>
                </select>
              </div>
            </div>

            <div className="contact-input-wrapper" style={{ marginBottom: "30px" }}>
              <textarea
                placeholder="Your Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                style={{ marginBottom: "0px" }}
              ></textarea>
              {formErrors.message && (
                <span className="contact-error-text" style={{ marginTop: "6px" }}>{formErrors.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              <span>
                <img src={asset("/images/Icon1.svg")} alt="" loading="lazy" decoding="async" />
              </span>

              {isSubmitting ? "Sending..." : "Submit Enquiry"}
            </button>

            {successMessage && (
              <p className="success-message">
                {successMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="related-section">
        <div className="related-top reveal-up">
          <div>
            <p className="related-subtitle">YOU MAY ALSO LOVE</p>

            <h2 className="related-title">
              Related <span>products</span>
            </h2>
          </div>

          <Link href={`/cosmetics/category/${product.category_slug}`} className="view-all">
            View all <span>→</span>
          </Link>
        </div>

        <div className="related-grid">
          {relatedProducts.length > 0
            ? relatedProducts.map((rp, i) => (
                <Link
                  href={`/cosmetics/products/${rp.slug }`}
                  key={rp.slug || rp.product_id || i}
                  style={{ textDecoration: "none" }}
                >
                  <div className="related-card">
                    <div className="related-image shimmer-wrap">
                      <img src={asset(`/images/${rp.image}`)} alt={rp.name} loading="lazy" decoding="async" className="shimmer-img" onLoad={e => e.currentTarget.classList.add('img-loaded')} />
                    </div>
                    <h4>{rp.name}</h4>
                  </div>
                </Link>
              ))
            : null
          }
        </div>
      </section>
    </div>
  );
}
