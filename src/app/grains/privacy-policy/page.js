"use client";

import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./privacy.css";

export default function PrivacyPolicyPage() {
  return (
    <div className="grains-privacy-wrapper">
      {/* ---- Grains Navbar ---- */}
      <Navbar />

      {/* ---- Grains Content ---- */}
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
            <a href="/grains" className="pp-back__link">
              ← Back to Organic Grains
            </a>
          </div>
        </article>
      </main>

      {/* ---- Grains Footer ---- */}
      <Footer />
    </div>
  );
}