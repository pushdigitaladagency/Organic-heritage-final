import "./Home.css";

import Link from "next/link";
import { asset } from "@/lib/asset";
import {
  ExploreIngredientsButton,
  FaqList,
  HomeRouteButton,
  PopularProductCards,
  ProductCategoryCards,
} from "./HomeClientBits";

export default function Home() {
  return (
    <div className="hero">

      {/* BACKGROUND IMAGE */}
      <img
        src={asset("/images/hero.jpeg")}
        alt="background"
        className="hero-bg"
        loading="eager"
        decoding="async"
      />



      {/* NAVBAR */}


      {/* HERO CONTENT */}
      <section className="hero-content" id="home">

        <div className="hero-left">

          <p className="tagline reveal-up">
            <img src={asset("/images/leaf33.png")} className="leaf" fetchPriority="high" decoding="async" />
            BOTANICAL · PURE · CRAFTED
          </p>

          <h1 className="reveal-up reveal-delay-1">
            Nature's Touch <br />
            <span>for Everyday</span> Beauty
          </h1>

          <p className="description reveal-up reveal-delay-2">
            Discover skincare and personal care products crafted with the
            goodness of natural ingredients, traditional wisdom, and gentle
            care.
          </p>

          <p className="small-text reveal-up reveal-delay-3">
            At Organic Heritage Cosmetics, we believe beauty begins with purity
            — formulations inspired by nature, designed for healthy, radiant
            living.
          </p>

          {/* BUTTONS */}
          <div className="hero-buttons reveal-up reveal-delay-4">
<a href="#products" className="shop-btn">
  Shop Products →
</a>

           <ExploreIngredientsButton />

          </div>

          {/* STATS */}
          <div className="stats reveal-up reveal-delay-5">

            <div>
              <h3>100%</h3>
              <p>NATURAL</p>
            </div>

            <div>
              <h3>20+</h3>
              <p>BOTANICALS</p>
            </div>

            <div>
              <h3>0</h3>
              <p>HARSH CHEMICALS</p>
            </div>

          </div>

        </div>

      </section>

      <section className="about-section" id="about">

        {/* LEFT IMAGE SIDE */}
        <div className="about-images reveal-left">

          <img
            src={asset("/images/about-main.png")}
            alt="about"
            className="about-main-img"
            loading="lazy"
            decoding="async"
          />

          <img
            src={asset("/images/about-small.png")}
            alt="products"
            className="about-small-img"
            loading="lazy"
            decoding="async"
          />

        </div>

        {/* RIGHT CONTENT SIDE */}
        <div className="about-content reveal-right">

          <p className="about-tag">
            ABOUT ORGANIC HERITAGE COSMETICS
          </p>

          <h2>
            Clean Beauty Rooted in <span>Nature </span>
          </h2>

          <p>
            Organic Heritage Cosmetics brings together herbal traditions and
            modern care to create products that are safe, effective, and
            naturally nourishing.
          </p>

          <p>
            Every product is thoughtfully made using carefully selected
            ingredients that support healthy skin and hair without relying on
            harsh chemicals.
          </p>

          <p>
            Whether it's daily skincare, hair care, or body care, our goal is
            simple — clean beauty rooted in nature
          </p>

        </div>

      </section>
      <section className="products-section" id="products">

        {/* TOP CONTENT */}
        <div className="products-top reveal-up">

          <div>
            <p className="products-tag">PRODUCTS</p>

            <h2>
              Crafted by Category
            </h2>
          </div>

          <p className="products-text">
            A curated edit of organic essentials — each made with
            intention, in small, attentive batches.
          </p>

        </div>
        {/* PRODUCT CARDS */}
        <ProductCategoryCards />

      </section >
      <section className="philosophy-section" id="philosophy">

        {/* TOP CONTENT */}
        <div className="philosophy-top reveal-up">

          <p className="philosophy-tag">
            PHILOSOPHY
          </p>

          <h2>
            Pure Ingredients. <span>Honest <br /> Formulations.</span>
          </h2>

          <p className="philosophy-text">
            We focus on ingredients inspired by nature and traditional
            wellness practices
          </p>

        </div>

        {/* CARDS */}
        <div className="philosophy-grid">

          {/* CARD 1 */}
          <div className="philosophy-card reveal-up reveal-delay-1">
            <div className="icon-circle" >
              <img src={asset("/images/L.png")} alt="icon" id="Li" loading="lazy" decoding="async" />
            </div>

            <h3>Herbal Extracts</h3>

            <p>
              Time-honoured plants, gently distilled.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="philosophy-card reveal-up reveal-delay-2">
            <div className="icon-circle">
              <img src={asset("/images/p.png")} alt="icon" loading="lazy" decoding="async" />
            </div>


            <h3>Plant-Based</h3>

            <p>
              Whole-plant goodness, nothing synthetic.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="philosophy-card reveal-up reveal-delay-3">
            <div className="icon-circle">
              <img src={asset("/images/B.png")} alt="icon" loading="lazy" decoding="async" />
            </div>

            <h3>No Harsh Chemicals</h3>

            <p>
              Free from parabens and sulphates.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="philosophy-card reveal-up reveal-delay-4">
            <div className="icon-circle">
              <img src={asset("/images/w.png")} alt="icon" loading="lazy" decoding="async" />
            </div>

            <h3>Gentle Formulations</h3>

            <p>
              Calibrated for everyday softness.
            </p>
          </div>

          {/* CARD 5 */}
          <div className="philosophy-card reveal-up reveal-delay-5">
            <div className="icon-circle">
              <img src={asset("/images/N.png")} alt="icon" loading="lazy" decoding="async" />
            </div>

            <h3>Natural Fragrance</h3>

            <p>
              Aromas drawn from real botanicals.
            </p>
          </div>

          {/* CARD 6 */}
          <div className="philosophy-card reveal-up reveal-delay-6">
            <div className="icon-circle">
              <img src={asset("/images/S.png")} alt="icon" loading="lazy" decoding="async" />
            </div>

            <h3>Tested with Care</h3>

            <p>
              Dermatologically friendly across types.
            </p>
          </div>

        </div>

      </section>

      <section className="choose-section">

        <h2>
          WHY CHOOSE ORGANIC COSMETICS
        </h2>

        <div className="choose-line"></div>

        <div className="choose-grid">

          {/* ITEM 1 */}
          <div className="choose-item">

            <div className="choose-icon">
              <img src={asset("/images/icon1.png")} alt="icon" loading="lazy" decoding="async" />

              <span>01</span>
            </div>

            <h3>Naturally Inspired</h3>

            <p>
              Products developed using nature-based ingredients.
            </p>

          </div>

          {/* ITEM 2 */}
          <div className="choose-item">

            <div className="choose-icon">
              <img src={asset("/images/icon2.png")} alt="icon" loading="lazy" decoding="async" />

              <span>02</span>
            </div>

            <h3>Safe Everyday Care</h3>

            <p>
              Gentle formulations suitable for daily wellness routines.
            </p>

          </div>

          {/* ITEM 3 */}
          <div className="choose-item">

            <div className="choose-icon">
              <img src={asset("/images/icon3.png")} alt="icon" loading="lazy" decoding="async" />

              <span>03</span>
            </div>

            <h3>Quality Focused</h3>

            <p>
              Every product is crafted with consistency,
              care, and attention.
            </p>

          </div>

          {/* ITEM 4 */}
          <div className="choose-item">

            <div className="choose-icon">
              <img src={asset("/images/icon4.png")} alt="icon" loading="lazy" decoding="async" />

              <span>04</span>
            </div>

            <h3>Sustainable Values</h3>

            <p>
              We support responsible sourcing and mindful
              production practices.
            </p>

          </div>

        </div>

      </section>
      <section className="pp">

        {/* TOP */}
        <div className="pp-top">

          <div>
            <p className="pp-tag">
              FEATURED
            </p>

            <h2>
              Popular products
            </h2>
          </div>

          <Link href="/cosmetics/category/lip-care" className="pp-link">
            View all products →
          </Link>

        </div>
        {/* GRID */}
        <PopularProductCards />

      </section>
      <section className="sc">

        {/* LEFT IMAGE */}
        <div className="sc-img reveal-left">

          <img
            src={asset("/images/self-care-model.png")}
            alt="self care"
            loading="lazy"
            decoding="async"
          />

        </div>

        {/* RIGHT CONTENT */}
        <div className="sc-content reveal-right">

          <p className="sc-tag">
            CUSTOMER EXPERIENCE SECTION
          </p>

          <h2>
            Self-Care <span>Inspired</span> by<br /> Nature
          </h2>

          <p className="sc-text">
            Organic Heritage Cosmetics is designed for people
            who value clean beauty, mindful living, and authentic
            wellness traditions.
          </p>

          <p className="sc-text">
            Experience products that help you feel naturally
            refreshed every day
          </p>

          {/* FEATURES */}
          <div className="sc-features">

            <div>
              <h3>Calm</h3>
              <p>RITUALS</p>
            </div>

            <div>
              <h3>Pure</h3>
              <p>INGREDIENTS</p>
            </div>

            <div>
              <h3>Soft</h3>
              <p>RESULTS</p>
            </div>

          </div>

        </div>

      </section>
      <section className="faq">

        {/* LEFT SIDE */}
        <div className="faq-left">

          <p className="faq-tag">
            FAQ SECTION
          </p>

          <h2>
            A Few Honest <span>Answers</span>
          </h2>

          <p className="faq-text">
            Curious about ingredients, rituals, or shipping?
            Start here.
          </p>

        </div>
        {/* RIGHT SIDE */}
        <FaqList />
      </section>
      <section className="bn">

        {/* LEFT CONTENT */}
        <div className="bn-left reveal-left">

          <img
            src={asset("/images/leaf-icon.png")}
            alt="leaf"
            className="bn-icon"
            loading="lazy"
            decoding="async"
          />

          <h2>
            Bring Nature into <br />
            Your <span>Daily Care</span> <br />
            Routine
          </h2>

          <p>
            Experience beauty and wellness inspired by
            traditional herbal goodness.
          </p>

          <div className="bn-btns">

           <HomeRouteButton className="bn-shop" href="/cosmetics/category">Shop Now →</HomeRouteButton>

            <HomeRouteButton className="bn-contact" href="/cosmetics/contact">Contact Us</HomeRouteButton>

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="bn-right reveal-right">

          <img
            src={asset("/images/daily-care.png")}
            alt="daily care"
            loading="lazy"
            decoding="async"
          />

        </div>

      </section>



    </div >
  );
}
