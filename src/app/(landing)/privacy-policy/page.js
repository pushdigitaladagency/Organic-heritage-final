"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../Components/Home.css";
import "./privacy.css";

/* ------------------------------------------------------------------ */
/*  Inline SVG icon set (matching Home.js)                            */
/* ------------------------------------------------------------------ */

const ArrowRight = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LocationIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" stroke="#FAF7EE" strokeWidth="1.4" />
    <circle cx="12" cy="9.5" r="2.5" stroke="#FAF7EE" strokeWidth="1.4" />
  </svg>
);

const PhoneIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 4.5C5 3.7 5.7 3 6.5 3h2.4c.6 0 1.2.4 1.4 1l1 3.5c.2.6 0 1.3-.5 1.6L9.2 10.4a12 12 0 005.4 5.4l1.3-1.6c.4-.4 1-.6 1.6-.5l3.5 1c.6.2 1 .7 1 1.4v2.4c0 .8-.7 1.5-1.5 1.5C10.7 20 4 13.3 4 6.5 4 5.7 4.7 5 5.5 5z" stroke="#FAF7EE" strokeWidth="1.3" />
  </svg>
);

const MailIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#FAF7EE" strokeWidth="1.3" />
    <path d="M3 7l9 6 9-6" stroke="#FAF7EE" strokeWidth="1.3" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 8h2V5h-2.5C11.6 5 10 6.6 10 8.5V11H8v3h2v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1z" fill="#FAF7EE" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="#FAF7EE" strokeWidth="1.4" />
    <circle cx="12" cy="12" r="4" stroke="#FAF7EE" strokeWidth="1.4" />
    <circle cx="17.5" cy="6.5" r="1" fill="#FAF7EE" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M21 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C15.2 5 12 5 12 5h0s-3.2 0-6.1.1c-.4 0-1.3.1-2.1.9C3.2 6.6 3 8 3 8S3 9.6 3 11.2v1.6C3 14.4 3 16 3 16s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.7.2 5.8.1 5.8.1s3.2 0 6.1-.1c.4 0 1.3-.1 2.1-.9.6-.6.8-2 .8-2s0-1.6 0-3.2v-1.6C21 9.6 21 8 21 8Z"
      stroke="#FAF7EE"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M10 9.5v5l5-2.5-5-2.5Z" fill="#FAF7EE" />
  </svg>
);

const MenuIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 18L18 6M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function PrivacyPolicyPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`oh-privacy-policy-wrapper oh-page oh-reveal-ready ${menuOpen ? "menu-is-open" : ""}`}>
      {/* ---- Header ---- */}
      <header className={`oh-header ${isScrolled ? "oh-header--scrolled" : ""}`}>
        <Link href="/#home" className="oh-header__logo" aria-label="Organic Heritage">
          <img src="/images/Logo.svg" alt="Organic Heritage" className="oh-header__logoMark" />
        </Link>

        <button
          className="oh-header__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          {menuOpen ? <CloseIcon color="#FAF7EE" /> : <MenuIcon color="#FAF7EE" />}
        </button>

        <nav className={`oh-header__nav ${menuOpen ? "oh-header__nav--open" : ""}`} aria-label="Primary">
          <div className="oh-nav__mobile-header">
            <img src="/images/Logo.svg" alt="Organic Heritage" className="oh-header__logoMark" />
          </div>
          <Link href="/#home" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/#grains" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>
            Grains
          </Link>
          <Link href="/#cosmetics" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>
            Cosmetics
          </Link>
          <div className="dropdown">
            <span className="oh-header__navLink">
              Products <span className="dropdown-icon">&#9662;</span>
            </span>

            <div className="dropdown-menu" style={{ minWidth: "130px", width: "130px", backgroundColor: "#DCC9A3" }}>
              <Link href="/grains">Grains</Link>
              <Link href="/cosmetics">Cosmetics</Link>
            </div>
          </div>
          <Link href="/#story" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>
            Our Story
          </Link>
          <Link href="/#sustain" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>
            Sustainability
          </Link>
          <Link href="/#contact" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <Link href="/#grains" className="oh-nav__mobile-cta" onClick={() => setMenuOpen(false)}>
            Shop Now
          </Link>
        </nav>

        <Link href="/#grains" className="oh-header__cta">
          Shop Now
        </Link>
      </header>

      {/* ---- Content ---- */}
      <main className="pp-page">
        <div className="pp-hero">
          <div className="pp-hero__inner">
            <p className="pp-hero__tag">Legal</p>
            <h1 className="pp-hero__title">Privacy Policy</h1>
            <p className="pp-hero__sub">
              Last updated: <time dateTime="2026-08-31">August 31, 2026</time>
            </p>
          </div>
        </div>

        <article className="pp-body">
          <section className="pp-section pp-section--intro">
            <p>
              Organic Heritage operates the website <strong>organicheritage.store</strong> and related online services, including information, content, features, tools, products and services made available through the website (collectively, the "Services"). Where the Services are hosted or supported by Shopify, Shopify may process personal information as described in its applicable privacy documentation. This Privacy Policy explains how Organic Heritage collects, uses, discloses and protects personal information when you visit, use, purchase from, or otherwise communicate with us through the Services.
            </p>
            <p>
              Please read this Privacy Policy carefully. By using or accessing the Services, you acknowledge that you have read and understood this Privacy Policy and the ways in which your information may be collected, used and disclosed as described below.
            </p>
          </section>

          <section className="pp-section">
            <h2>Personal Information We Collect or Process</h2>
            <p>
              When we use the term "personal information," we mean information that identifies you or can reasonably be linked to you. Depending on how you interact with the Services and as permitted by applicable law, we may collect or process the following categories of information:
            </p>
            <ul>
              <li>
                Contact details, including your name, billing address, shipping address, phone number and email address.
              </li>
              <li>
                Payment and transaction information, including payment method, transaction details and payment confirmation. Payment card information may be processed by payment service providers and may not be stored directly by Organic Heritage.
              </li>
              <li>
                Account information, where applicable, such as your login details, preferences and settings.
              </li>
              <li>
                Transaction and shopping information, including products you view, add to your cart, purchase, return, exchange or cancel, and relevant purchase history.
              </li>
              <li>
                Communications with us, including information you provide when contacting customer support or making an enquiry.
              </li>
              <li>
                Device information, including information about your device, browser, network connection, IP address and related technical identifiers.
              </li>
              <li>
                Usage information concerning how and when you interact with or navigate the Services.
              </li>
            </ul>
          </section>

          <section className="pp-section">
            <h2>Sources of Personal Information</h2>
            <p>We may collect personal information from the following sources:</p>
            <ul>
              <li>
                Directly from you, when you create an account, place an order, contact us, subscribe to communications or otherwise provide information.
              </li>
              <li>
                Automatically through the Services, including through cookies and similar technologies when you use the website.
              </li>
              <li>
                From service providers that help us operate the website, process payments, provide analytics, support customers, or fulfill and ship orders.
              </li>
              <li>
                From partners or other third parties where permitted by applicable law.
              </li>
            </ul>
          </section>

          <section className="pp-section">
            <h2>How We Use Your Personal Information</h2>
            <p>Depending on how you interact with Organic Heritage, we may use personal information to:</p>
            <ul>
              <li>Provide, operate, maintain and improve the Services.</li>
              <li>Process and fulfill orders, payments, deliveries, returns and exchanges.</li>
              <li>Remember preferences and items of interest and provide a more useful shopping experience.</li>
              <li>Communicate with you about your account, orders, enquiries, products, services and customer support.</li>
              <li>Send marketing or promotional communications where permitted by law and where applicable. You may opt out of promotional communications at any time.</li>
              <li>Maintain website and account security and help detect, investigate and prevent fraudulent, illegal or harmful activity.</li>
              <li>Comply with applicable laws, regulations, legal processes and lawful requests from government or law-enforcement authorities.</li>
              <li>Establish, exercise or defend legal rights and enforce applicable terms and policies.</li>
            </ul>
          </section>

          <section className="pp-section">
            <h2>How We Disclose Personal Information</h2>
            <p>We may disclose personal information to third parties where reasonably necessary to operate our business and provide the Services, subject to applicable law. This may include:</p>
            <ul>
              <li>Shopify and other technology or service providers that support website hosting, payment processing, analytics, customer support, cloud services, order fulfillment and shipping.</li>
              <li>Delivery and logistics providers when necessary to deliver products you order.</li>
              <li>Payment providers and financial service providers involved in processing transactions.</li>
              <li>Marketing or advertising service providers where applicable and permitted by law.</li>
              <li>Third parties when you direct us to disclose information, request a service that requires disclosure, or otherwise provide consent.</li>
              <li>Professional advisers, authorities, courts, or other parties when disclosure is required or permitted by law.</li>
              <li>A buyer, successor or other relevant party in connection with a merger, acquisition, restructuring, sale of assets, bankruptcy or similar business transaction.</li>
            </ul>
          </section>

          <section className="pp-section">
            <h2>Shopify</h2>
            <p>
              If the Services are hosted or powered by Shopify, Shopify may collect and process information about your access to and use of the Services in order to provide and improve its services. Information submitted through the store may be transmitted to and processed by Shopify and its service providers, including in countries other than your country of residence. Shopify's own privacy terms may apply to information it processes. You can review Shopify's consumer privacy information at privacy.shopify.com.
            </p>
          </section>

          <section className="pp-section">
            <h2>Cookies and Similar Technologies</h2>
            <p>
              The website may use cookies and similar technologies to operate the store, remember preferences, understand website usage, maintain security, and improve the shopping experience. Some cookies may be provided by Shopify or third-party service providers. Depending on your browser or applicable law, you may be able to manage or disable cookies through your browser settings. Disabling certain cookies may affect website functionality.
            </p>
          </section>

          <section className="pp-section">
            <h2>Third-Party Websites and Links</h2>
            <p>
              The Services may contain links to websites or online platforms operated by third parties. If you follow a link to a site that we do not control, you should review that site's privacy and security policies. Organic Heritage is not responsible for the privacy, security, accuracy or practices of third-party websites or platforms.
            </p>
          </section>

          <section className="pp-section">
            <h2>Children's Data</h2>
            <p>
              The Services are not intended for children who are not legally permitted to use online shopping services in their jurisdiction. We do not knowingly collect personal information from children where prohibited by applicable law. If you believe that a child has provided us with personal information, please contact us using the details below so that we can review the matter and take appropriate action.
            </p>
          </section>

          <section className="pp-section">
            <h2>Security and Retention of Your Information</h2>
            <p>
              We take reasonable measures designed to protect personal information from unauthorized access, loss, misuse or disclosure. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
            <p>
              We retain personal information for as long as reasonably necessary for the purposes described in this Privacy Policy, including to provide Services, maintain transaction records, comply with legal obligations, resolve disputes and enforce agreements and policies.
            </p>
          </section>

          <section className="pp-section">
            <h2>Your Rights and Choices</h2>
            <p>
              Depending on where you live and subject to applicable law, you may have rights regarding your personal information, which may include:
            </p>
            <ul>
              <li>Accessing personal information we hold about you.</li>
              <li>Requesting correction of inaccurate or incomplete personal information.</li>
              <li>Requesting deletion of personal information in appropriate circumstances.</li>
              <li>Requesting a copy of certain personal information or, where applicable, portability of that information.</li>
              <li>Opting out of promotional communications by using the unsubscribe option in marketing emails.</li>
            </ul>
            <p>
              To exercise an applicable right, please contact us using the contact details below. We may need to verify your identity before processing a request and may retain information where required or permitted by law.
            </p>
          </section>

          <section className="pp-section">
            <h2>Complaints</h2>
            <p>
              If you have a concern or complaint about how we handle your personal information, please contact Organic Heritage using the contact details below. We will review and respond to your concern in accordance with applicable law.
            </p>
          </section>

          <section className="pp-section">
            <h2>International Transfers</h2>
            <p>
              Depending on the service providers used to operate the website, personal information may be transferred to, stored in, or processed in countries outside India. Where applicable, we will take reasonable steps to ensure such processing is carried out in accordance with applicable data protection requirements and appropriate safeguards.
            </p>
          </section>

          <section className="pp-section">
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our business practices, Services, technology, or legal and regulatory requirements. When we make changes, we will update the "Last updated" date on this page and provide any additional notice required by applicable law.
            </p>
          </section>

          <section className="pp-section">
            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, our privacy practices, or your personal information, please contact Organic Heritage:
            </p>
            <address className="pp-address">
              <strong>Organic Heritage</strong>
              <br />
              Website: organicheritage.store
              <br />
              Email: thirugailifestylecenter@gmail.com
              <br />
              Email: vaiyamnaturals@gmail.com
              <br />
              Phone: +91 8939665002
              <br />
              Phone: +91 9940399388
              <br />
              Business Address: Vaiyam Naturals, Chengalpattu – 603001, Tamil Nadu, India
              <br />
              Additional Business Address: Thirugai Lifestyle Center, Thirukarugavur, Thanjavur – 614302, Tamil Nadu, India
            </address>
          </section>

          <div className="pp-back">
            <Link href="/" className="pp-back__link">
              ← Back to Organic Heritage
            </Link>
          </div>
        </article>
      </main>

      {/* ---- Footer ---- */}
      <footer className="oh-foot" id="contact">
        <img src="/images/branch.png" alt="Organic" className="branch2" />

        <div className="oh-foot__container">
          {/* Brand & newsletter */}
          <div className="oh-foot__brand">
            <div className="oh-foot__logo">
              <div className="oh-header__logoMark oh-header__logoMark--dark">
                <img src="/images/Logo.svg" alt="Organic Heritage" className="logo" />
              </div>
            </div>

            <p className="oh-foot__tag">
              Bringing back the goodness of traditional organic heritage that nourished generations.
            </p>

            <form className="oh-foot__form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" className="oh-foot__input" aria-label="Email" />
              <button type="submit" className="oh-foot__subscribe">
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick links */}
          <div className="oh-foot__col">
            <h4 className="oh-foot__heading inter-font">Quick links</h4>
            <ul className="oh-foot__list">
              <li>
                <Link href="/#grains">About Us</Link>
              </li>
              <li>
                <Link href="/#cosmetics">Grains</Link>
              </li>
              <li>
                <Link href="/#apothecary">Cosmetics</Link>
              </li>
              <li>
                <Link href="/#gifts">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Get in touch */}
          <div className="oh-foot__col">
            <h4 className="oh-foot__heading inter-font">Get in touch</h4>
            <ul className="oh-foot__list oh-foot__list--touch">
              <li className="icon">
                <LocationIcon />
                <span>
                  #333/97, Lakshmanaswamy Salai,
                  <br />
                  kk Nagar, Chennai- 600 078,
                  <br />
                  Tamil Nadu, INDIA.
                </span>
              </li>
              <li>
                <PhoneIcon />
                <span>
                  Landline :+91 98765 43210
                  <br />
                  Mobile :+91 98765 43211
                </span>
              </li>
              <li>
                <MailIcon />
                <span>enquiry@push.digital</span>
              </li>
            </ul>
          </div>

          {/* Last column */}
          <div className="oh-foot__col">
            <h4 className="oh-foot__heading1 inter-font">Follow us</h4>
            <div className="oh-foot__social">
              <a href="#" aria-label="Facebook" className="oh-foot__socialBtn">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="oh-foot__socialBtn">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Youtube" className="oh-foot__socialBtn">
                <YoutubeIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="oh-foot__bottom">
          <span>© 2026 Organic Heritage. All rights reserved.</span>
          <Link href="/privacy-policy" className="oh-foot__privacyLink">
            Privacy Policy
          </Link>
          <span className="oh-foot__bottomBrand">ORGANIC HERITAGE — NOURISHING LIFE NATURALLY</span>
        </div>
      </footer>
    </div>
  );
}
