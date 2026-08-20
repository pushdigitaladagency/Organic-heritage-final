"use client"
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { asset } from "@/lib/asset";
import './Header.css';

const MAILER_URL = process.env.NEXT_PUBLIC_MAILER_API;
export default function Navbar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
     const [scrolled, setScrolled] = useState(false);
     const [activeSection, setActiveSection] = useState("home");
     const router = useRouter();
     const pathname = usePathname();

     // ── Enquiry Popup State ────────────────────────────────────────────────
     const [enquiryOpen, setEnquiryOpen]   = useState(false);
     const [enquiryVisible, setEnquiryVisible] = useState(false);
     const [enqData, setEnqData] = useState({ name: "", email: "", phone: "", message: "" });
     const [enqErrors, setEnqErrors] = useState({});
     const [enqSubmitting, setEnqSubmitting] = useState(false);
     const [enqSuccess, setEnqSuccess] = useState("");

     const openEnquiry = () => {
       setEnquiryOpen(true);
       requestAnimationFrame(() => requestAnimationFrame(() => setEnquiryVisible(true)));
       document.body.style.overflow = "hidden";
     };

     const closeEnquiry = () => {
       setEnquiryVisible(false);
       setTimeout(() => { setEnquiryOpen(false); document.body.style.overflow = ""; }, 350);
     };

     const handleEnqChange = (e) => {
       const { name, value } = e.target;
       setEnqData(prev => ({
         ...prev,
         [name]:
           name === "phone"
             ? value.replace(/\D/g, "")
             : name === "name"
             ? value.replace(/[^a-zA-Z\s]/g, "")
             : value,
       }));
     };

     const validateEnq = () => {
       const errs = {};
       if (!enqData.name.trim())    errs.name    = "Name is required";
       if (!enqData.email.trim())   errs.email   = "Email is required";
       else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(enqData.email))
         errs.email = "Invalid email address";
       if (!enqData.phone.trim())   errs.phone   = "Phone is required";
       else if (!/^[0-9]{10}$/.test(enqData.phone)) errs.phone = "Enter valid 10-digit number";
       if (!enqData.message.trim()) errs.message = "Message is required";
       setEnqErrors(errs);
       return Object.keys(errs).length === 0;
     };

     const submitEnquiry = async (e) => {
       e.preventDefault();
       if (!validateEnq()) return;
       setEnqSubmitting(true);
       try {
         const res = await fetch(MAILER_URL, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             name: enqData.name,
             email: enqData.email,
             phone: enqData.phone,
             message: enqData.message,
           }),
         });
         if (!res.ok) throw new Error("Failed");
         setEnqData({ name: "", email: "", phone: "", message: "" });
         setEnqErrors({});
         setEnqSuccess("Enquiry sent successfully ✅");
         setTimeout(() => { setEnqSuccess(""); closeEnquiry(); }, 2500);
       } catch {
         setEnqSuccess("Something went wrong. Please try again. ❌");
         setTimeout(() => setEnqSuccess(""), 3000);
       } finally {
         setEnqSubmitting(false);
       }
     };

     const isProductsPage = pathname === "/cosmetics/category" || pathname?.startsWith("/cosmetics/products");
     const isHomePage = pathname === "/cosmetics";

     const sectionIds = ["home", "about", "products", "philosophy", "contact"];

    useEffect(() => {
        const observerOptions = {
          root: null,
          threshold: 0.15,
          rootMargin: "0px 0px -20% 0px",
        };
    
        const handleIntersect = (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        };
    
        const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
        sectionIds.forEach((id) => {
          const el = document.getElementById(id);
          if (el) observer.observe(el);
        });
    
        // Fallback for reaching the bottom of the page (footer) and handle navbar background
        const handleScroll = () => {
          setScrolled(window.scrollY > 50);
          
          const scrollPosition = window.innerHeight + window.scrollY;
          const scrollHeight = document.documentElement.scrollHeight;
          if (scrollPosition >= scrollHeight - 50) {
            setActiveSection("contact");
          }
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () => {
          observer.disconnect();
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

      const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          // Not on home page — navigate without refresh
          router.push(`/cosmetics/#${id}`);
        }
        setIsMenuOpen(false);
      };


     const MenuIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const CloseIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 18L18 6M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
    return (
<>
<nav className={`navbar ${isMenuOpen ? "active" : ""} ${scrolled ? "scrolled" : ""}`}>
        <Link
    href="/"
    className="logo"
  >
    <img
      src={asset("/images/Organic_logo.svg")}
      alt="logo"
    />
  </Link>

        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <CloseIcon color="#5f7f4c" /> : <MenuIcon color="#5f7f4c" />}
        </button>

        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }} className={(activeSection === "home" && isHomePage) ? "nav-active" : ""}>Home</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }} className={(activeSection === "about" && isHomePage) ? "nav-active" : ""}>About</a>
          <a href="#products" onClick={(e) => { e.preventDefault(); scrollTo("products"); }} className={((activeSection === "products" && isHomePage) || isProductsPage) ? "nav-active" : ""}>Products</a>
          <a href="#philosophy" onClick={(e) => { e.preventDefault(); scrollTo("philosophy"); }} className={(activeSection === "philosophy" && isHomePage) ? "nav-active" : ""}>Philosophy</a>
          <a href="/cosmetics/contact" onClick={(e) => { e.preventDefault(); router.push("/cosmetics/contact"); setIsMenuOpen(false); }} className={(pathname === "/cosmetics/contact" || (activeSection === "contact" && isHomePage)) ? "nav-active" : ""}>Contact</a>
          <button className="order-btn" onClick={() => { openEnquiry(); setIsMenuOpen(false); }}>Enquiry Now
</button>
        </div>
      </nav>

      {/* ── Enquiry Popup Modal ────────────────────────────────────── */}
      {enquiryOpen && (
        <div
          className={`enq-overlay${enquiryVisible ? " enq-overlay--visible" : ""}`}
          onClick={(e) => { if (e.target === e.currentTarget) closeEnquiry(); }}
        >
          <div className={`enq-modal${enquiryVisible ? " enq-modal--visible" : ""}`}>

            {/* Header */}
            <div className="enq-modal-header">
              <div>
                <p className="enq-tag">ENQUIRY</p>
                <h2 className="enq-title">Get in <span>Touch</span></h2>
              </div>
              <button className="enq-close" onClick={closeEnquiry} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Form */}
            <form className="enq-form" onSubmit={submitEnquiry} noValidate>

              <div className="enq-row">
                <div className="enq-field">
                  <input
                    type="text"
                    placeholder="Your Name"
                    name="name"
                    value={enqData.name}
                    onChange={handleEnqChange}
                    className="enq-input"
                  />
                  {enqErrors.name && <span className="enq-error">{enqErrors.name}</span>}
                </div>

                <div className="enq-field">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    name="phone"
                    value={enqData.phone}
                    onChange={handleEnqChange}
                    className="enq-input"
                    maxLength={10}
                  />
                  {enqErrors.phone && <span className="enq-error">{enqErrors.phone}</span>}
                </div>
              </div>

              <div className="enq-field">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={enqData.email}
                  onChange={handleEnqChange}
                  className="enq-input"
                />
                {enqErrors.email && <span className="enq-error">{enqErrors.email}</span>}
              </div>

              <div className="enq-field">
                <textarea
                  placeholder="Your Message"
                  name="message"
                  value={enqData.message}
                  onChange={handleEnqChange}
                  className="enq-textarea"
                  rows={4}
                />
                {enqErrors.message && <span className="enq-error">{enqErrors.message}</span>}
              </div>

              <div className="enq-footer">
                <button type="submit" className="enq-submit" disabled={enqSubmitting}>
                  {enqSubmitting ? "Sending..." : "Submit Enquiry →"}
                </button>
                {enqSuccess && <p className="enq-success">{enqSuccess}</p>}
              </div>

            </form>
          </div>
        </div>
      )}
    </>
    )
}