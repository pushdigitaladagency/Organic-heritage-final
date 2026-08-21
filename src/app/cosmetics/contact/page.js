import React from "react";
import Header from "../Components/Header";
import Contact from "../Components/Contact";
import Footer from "../Components/Footer";
import { absoluteUrl } from "@/lib/seo";

// This page had no metadata of its own, so it inherited the cosmetics section
// title — meaning the contact page competed with the shop page for the same
// search phrase. Its own copy lives here because it is static content with no
// MongoDB document behind it. Edit it directly.
export const metadata = {
  title: "Contact Organic Heritage | Natural Cosmetics Enquiries",
  description:
    "Get in touch with Organic Heritage for product enquiries, bulk orders and stockist details across our natural and herbal cosmetics range.",
  keywords: [
    "contact organic heritage",
    "natural cosmetics enquiry",
    "herbal cosmetics India contact",
  ],
  alternates: { canonical: absoluteUrl("/cosmetics/contact") },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <Contact />
      <Footer />
    </>
  );
}
