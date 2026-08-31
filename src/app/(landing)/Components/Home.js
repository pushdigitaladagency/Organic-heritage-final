'use client';

import React from 'react';
import './Home.css';
import Link from "next/link";
import { useRef, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Inline SVG icon set (replaces external icons so build is portable) */
/* ------------------------------------------------------------------ */


const ArrowRight = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LeafTag = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M12.5 1.5C8 1.5 2.5 3 2.5 8.5c0 1.5.5 3 1.5 4 0-3 1.5-5.5 5-7.5-2 2-3 4.5-3 7.5 4.5 0 7-3 7-9.5z" fill={color} />
  </svg>
);

const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="#1F3D2E" strokeWidth="1.2" />
    <path d="M4.5 8.2L7 10.7l4.5-5" stroke="#1F3D2E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

const BowlIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <path d="M4 13h22a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#1F3D2E" />
    <path d="M2 13h26" stroke="#1F3D2E" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M11 9c0-1.5 1-2.5 2-3M15 9c0-2 1-3 2-4M19 9c0-1.5 1-2.5 2-3" stroke="#1F3D2E" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M6 17l1 4h16l1-4" stroke="#1F3D2E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SeedIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <path d="M15 4c-5 4-7 9-7 13a7 7 0 0014 0c0-4-2-9-7-13z" stroke="#1F3D2E" strokeWidth="1.4" />
    <path d="M15 10v12M11 14l4 2M19 14l-4 2" stroke="#1F3D2E" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const HandIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <path d="M9 14V7a2 2 0 014 0v6M13 13V6a2 2 0 014 0v7M17 13V8a2 2 0 014 0v9c0 5-3 8-7 8s-7-3-7-8v-3a2 2 0 014 0v2" stroke="#1F3D2E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TickRingIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <circle cx="15" cy="15" r="13" stroke="#1F3D2E" strokeWidth="1.4" />
    <path d="M9 15.2l4 4 8-9" stroke="#1F3D2E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
    <path
      d="M10 9.5v5l5-2.5-5-2.5Z"
      fill="#FAF7EE"
    />
  </svg>
);
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

/* ========================================================== */
/*  HOME PAGE                                                          */
/* ========================================================== */
function Home() {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(null);
    const videoRef = useRef(null);

  useEffect(() => {
    let timer;
    setIsLoading(true);
    timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    if (videoRef.current) {
      // Set speed to 0.5x for a slow-motion background effect
      videoRef.current.playbackRate = 1;
    }

    const handleScroll = () => {
      const grainsSection = document.getElementById('grains');
      if (grainsSection) {
        const rect = grainsSection.getBoundingClientRect();
        if (rect.top <= 100) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };

    const revealItems = Array.from(document.querySelectorAll('.oh-reveal'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let revealObserver;

    if (prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add('oh-reveal--visible'));
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('oh-reveal--visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -12% 0px',
          threshold: 0.15,
        }
      );

      revealItems.forEach((item) => revealObserver.observe(item));
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) {
        clearTimeout(timer);
      }
      revealObserver?.disconnect();
    };
  }, []);

  return (
    <div className={`oh-page oh-reveal-ready ${menuOpen ? 'menu-is-open' : ''} ${isLoading === false ? 'oh-page--loaded' : ''}`}>
      {isLoading && (
        <div className="oh-preloader">
          <div className="oh-preloader-content">
            <img src="/images/Logo.svg" alt="Organic Heritage Logo" className="oh-preloader-logo" />
            <h2 className="oh-preloader-text">Organic Heritage</h2>
            <div className="oh-preloader-spinner"></div>
          </div>
        </div>
      )}
      {/* ---- Header ---- */}
      <header className={`oh-header ${isScrolled ? 'oh-header--scrolled' : ''}`}>
        <a href="#home" className="oh-header__logo" aria-label="Organic Heritage">
          <img src="/images/Logo.svg" alt="Organic Heritage" className="oh-header__logoMark" />
        </a>

        <button 
          className="oh-header__toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          {menuOpen ? <CloseIcon color="#FAF7EE" /> : <MenuIcon color="#FAF7EE" />}
        </button>

        <nav className={`oh-header__nav ${menuOpen ? 'oh-header__nav--open' : ''}`} aria-label="Primary">
          <div className="oh-nav__mobile-header">
             <img src="/images/Logo.svg" alt="Organic Heritage" className="oh-header__logoMark" />
          </div>
          <a href="#home" className="oh-header__navLink"  onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#grains" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>Grains</a>
         <a href="#cosmetics" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>Cosmetics</a>
         <div className="dropdown">
  <span className="oh-header__navLink">
   Products <span className="dropdown-icon">&#9662;</span>
  </span>

  <div className="dropdown-menu" style={{ minWidth: '130px', width: '130px', backgroundColor:"#DCC9A3" }}>
    <Link href="/grains">Grains</Link>
    <Link href="/cosmetics">Cosmetics</Link>
     </div>
</div>
          <a href="#story" className="oh-header__navLink"onClick={() => setMenuOpen(false)}>Our Story</a>
          <a href="#sustain" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>Sustainability</a>
          <a href="#contact" className="oh-header__navLink" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="#grains" className="oh-nav__mobile-cta" onClick={() => setMenuOpen(false)}>Shop Now</a>
        </nav>

        <a href="#grains" className="oh-header__cta">Shop Now</a>
      </header>

      {/* ============ HERO SECTION ============ */}
      <section className="oh-hero" id="home">
        <video ref={videoRef} src="/images/hero_bg11.mp4" autoPlay muted loop className='oh-hero__bg'></video>


        {/* ---- Hero copy ---- */}
        <div className="oh-hero__inner">
          <span className="oh-pill oh-hero__reveal oh-hero__reveal--1">
            <LeafTag size={14} color="#FAF7EE" />
          ROOTED IN NATURE CRAFTED FOR EVERYDAY LIVING
          </span>

          <h1 className="oh-hero__title oh-hero__reveal oh-hero__reveal--2" >
            Welcome To<br />
            Organic <span style={{color:"#DCC9A3"}} className="oh-heritage-text">Heritage</span>
          </h1>

          <p className="oh-hero__sub oh-hero__reveal oh-hero__reveal--3">
            From wholesome grains to natural self-care, we bring you products
            that are pure,authentic, and crafted with care.
          </p>

          <div className="oh-hero__ctas oh-hero__reveal oh-hero__reveal--4">
            <a href="#grains" className="oh-btn oh-btn--solid">
              Explore Grains
              <ArrowRight size={16} color="#FAF7EE" />
            </a>
            <a href="#cosmetics" className="oh-btn oh-btn--ghost">Explore Cosmetics</a>

          </div>
        </div>
      </section>

      {/* ============ GRAINS SECTION (image left, content right) ============ */}
      <section className="oh-split oh-split--grains" id="grains">
        <div className="oh-split__container">
          <div className="oh-split__media oh-split__media--left oh-reveal oh-reveal--from-left"id='left'>
            <div className="oh-split__mediaInner oh-split__mediaInner--grains" />
          </div>

          <div className="oh-split__content oh-reveal oh-reveal--from-right">
            <div className="oh-eyebrow">
              <span className="oh-eyebrow__rule" />
              <span className="oh-eyebrow__text">two worlds, one heritage</span>
            </div>

            <h2 className="oh-h2" id='org-h2'>Organic Heritage Grains</h2>

            <p className="oh-split__lede">
              Discover the richness of ancient nutrition. Our grains are sourced from 
              heritage farms that prioritize biodiversity and traditional cultivation 
              methods, ensuring every meal is a bridge to our roots.
            </p>

            <ul className="oh-split__list">
              <li style={{color:"#66442C"}}> Traditional Rice Varieties</li>
              <li style={{color:"#66442C"}}> Millets & Pulses</li>
              <li style={{color:"#66442C"}}>Chemical - Free Processing</li>
              <li style={{color:"#66442C"}}> Farm-To-Table Quality</li>
            </ul>

            <Link href="/grains" className="oh-btn oh-btn--solid oh-btn--wide" style={{ color: 'white' }}>
              Visit Grains Collection
              <ArrowRight size={16} color="white" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ COSMETICS SECTION (content left, image right) ============ */}
      <section className="oh-split oh-split--cosmetics" id="cosmetics">
        <div className="oh-split__container">
          <div className="oh-split__content oh-split__content--left oh-reveal oh-reveal--from-left">
            <h2 className="oh-h2" id='h2-margin' > Organic Heritage  Cosmetics</h2>

            <p className="oh-split__lede" id='oh-pading'>
              Elevate your self-care ritual with formulations inspired by time-honored 
              beauty secrets. We blend pure botanical extracts with modern science 
              to create skincare that honors both your skin and the Earth.
            </p>

            <ul className="oh-split__list">
              <li style={{color:"#66442C"}}>Herbal ingredients</li>
              <li style={{color:"#66442C"}}> Gentle on skin</li>
              <li style={{color:"#66442C"}}>Free from harsh chemicals</li>
              <li style={{color:"#66442C"}}> Inspired by Traditional Care</li>
            </ul>

            <Link href="/cosmetics" className="oh-btn oh-btn--solid oh-btn--wide" style={{ color: 'white' }}>
              Visit Cosmetics Collection
              <ArrowRight size={16} color="#FAF7EE" />
            </Link>
          </div>

          <div className="oh-split__media oh-split__media--right oh-reveal oh-reveal--from-right"id='right'>
            <div className="oh-split__mediaInner oh-split__mediaInner--cosmetics" />
          </div>
        </div>
      </section>

      {/* ============ PHILOSOPHY ============ */}
      <section className="oh-philo" id="story">
        <div className="oh-philo__container">
          <div className="oh-philo__media oh-reveal oh-reveal--from-left">
            <div className="oh-philo__mediaInner" />
          </div>

          <div className="oh-philo__content oh-reveal oh-reveal--from-right">
            <div className="oh-eyebrow">
              <span className="oh-eyebrow__rule2" />
              <span className="oh-eyebrow__text2">Our Philosophy</span>
            </div>

            <h2 className="oh-h2 oh-philo__title">
              Healthy living begins<br />with pure choices
            </h2>

            <p className="oh-philo__lede">
              Organic heritage was created to review traditional goodness in
              modern lifestyles. whether it&rsquo;s the food you eat or the
              products you use on your skin, we believe purity matters.
            </p>

            <div className="oh-philo__cards">
              <article className="oh-philo__card oh-reveal oh-reveal--stagger-1">
                <h3>Natural</h3>
                <p>Made with pure and naturally sourced ingredients.</p>
              </article>
              <article className="oh-philo__card oh-reveal oh-reveal--stagger-2">
                <h3>Ethical</h3>
                <p>Responsibly sourced with care and transparency.</p>
              </article>
              <article className="oh-philo__card oh-reveal oh-reveal--stagger-3">
                <h3>Sustainable</h3>
                <p>Supports Eco-friendly and sustainable methods.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE — Dark band ============ */}
      <section className="oh-why" id="sustain">
        <div className="oh-why__container">
          <h2 className="oh-why__title oh-reveal">Why choose Organic Heritage?</h2>

          <div className="oh-why__grid">
            <article className="oh-why__card oh-reveal oh-reveal--stagger-1">
                <img src="/images/branch.png" alt="Organic" className="branch" />
               <img src="/images/leaf 11.png" alt="Organic Heritage" className="svg" />
              <h3>Pure &amp; Authentic</h3>
              <p>Carefully sourced ingredients with minimal Processing Traditional wisdom.</p>
            </article>

            <article className="oh-why__card oh-reveal oh-reveal--stagger-2">
               <img src="/images/branch.png" alt="Organic" className="branch" />
            <img src="/images/bowl.png" alt="Organic Heritage" className=".oh-why__icon svg" />
              <h3>Traditional Wisdom</h3>
              <p>Products inspired by generations of natural living, sustainable approach.</p>
            </article>

            <article className="oh-why__card oh-reveal oh-reveal--stagger-3">
              <img src="/images/branch.png" alt="Organic" className="branch" />
             <img src="/images/stem.png" alt="Organic Heritage" className=".oh-why__icon svg" />
              <h3>Sustainable Approach</h3>
              <p>Supporting framers, Natures, and Responsible production.</p>
            </article>

            <article className="oh-why__card oh-reveal oh-reveal--stagger-4">
               <img src="/images/branch.png" alt="Organic" className="branch" />
               <img src="/images/medal.png" alt="Organic Heritage" className=".oh-why__icon svg" />
              <h3>Quality Assured</h3>
              <p>Every product is crafted with care and consistency.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ FEATURED CATEGORIES ============ */}
      <section className="oh-feat">
        <div className="oh-feat__container">
          <header className="oh-feat__header oh-reveal">
            <div className="oh-eyebrow" id='fea'>
              <span className="oh-eyebrow__rule" />
              <span className="oh-eyebrow__text">Featured</span>
            </div>
            <h2 className="oh-h2">Featured Categories</h2>
          </header>

          <div className="oh-feat__grid">
            {/* Grains card */}
            <article className="oh-feat__card oh-feat__card--green oh-reveal oh-reveal--from-left">
              <div className="oh-feat__products">
                
                <div className="oh-feat__product oh-reveal oh-reveal--stagger-1">
                <Link href="/grains#products">
                  <div className="oh-feat__productImg oh-feat__productImg--g1"  />
                   
                  <span className="oh-feat__productLabel" >Rice</span></Link>
                  
                </div>
                <div className="oh-feat__product oh-reveal oh-reveal--stagger-2">
                  <Link href="/grains#products2">
                    <div className="oh-feat__productImg oh-feat__productImg--g2"/>
                    <span className="oh-feat__productLabel">Flour</span>
                  </Link>
                </div>
                <div className="oh-feat__product oh-reveal oh-reveal--stagger-3">
                  <Link href="/grains#products3">
                    <div className="oh-feat__productImg oh-feat__productImg--g3" />
                    <span className="oh-feat__productLabel">Soup Mix</span>
                  </Link>
                </div>
                <div className="oh-feat__product oh-reveal oh-reveal--stagger-4">
                  <Link href="/grains#products5">
                    <div className="oh-feat__productImg oh-feat__productImg--g4" />
                    <span className="oh-feat__productLabel">Cookies</span>
                  </Link>
                </div>
              </div>

              {/* <a href="#grains" className="oh-btn oh-btn--solid oh-feat__btn"style={{ color: 'white' }}>View All Grains</a> */}
            </article>

            {/* Cosmetics card */}
            <article className="oh-feat__card oh-feat__card--sandal oh-reveal oh-reveal--from-right">
              <div className="oh-feat__products">
                <div className="oh-feat__product oh-reveal oh-reveal--stagger-1">
                  <Link href="/cosmetics/category/lip-care">
                    <div className="oh-feat__productImg oh-feat__productImg--c1" />
                    <span className="oh-feat__productLabel">Lip Care</span>
                  </Link>
                </div>
                <div className="oh-feat__product oh-reveal oh-reveal--stagger-2">
                  <Link href="/cosmetics/category/skin-care">
                    <div className="oh-feat__productImg oh-feat__productImg--c2" />
                    <span className="oh-feat__productLabel">Skin Care</span>
                  </Link>
                </div>
                <div className="oh-feat__product oh-reveal oh-reveal--stagger-3">
                  <Link href="/cosmetics/category/hair-care">
                    <div className="oh-feat__productImg oh-feat__productImg--c3" />
                    <span className="oh-feat__productLabel">Hair Care</span>
                  </Link>
                </div>
                <div className="oh-feat__product oh-reveal oh-reveal--stagger-4">
                  <Link href="/cosmetics/category/hygiene">
                    <div className="oh-feat__productImg oh-feat__productImg--c4" />
                    <span className="oh-feat__productLabel">Hygiene</span>
                  </Link>
                </div>
              </div>

              {/* <a href="#cosmetics" className="oh-btn oh-btn--solid oh-feat__btn" style={{ color: 'white' }}>View All Cosmetics</a> */}
            </article>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="oh-foot" id="contact">
        <img src="/images/branch.png" alt="Organic" className="branch2" />
         


        <div className="oh-foot__container">
          {/* Brand & newsletter */}
          <div className="oh-foot__brand oh-reveal oh-reveal--stagger-1">
            <div className="oh-foot__logo">
              <div className="oh-header__logoMark oh-header__logoMark--dark">
                {/* <span>O</span><i>H</i> */}
                 <img src="/images/Logo.svg" alt="Organic Heritage" className="logo " />
              </div>
            </div>

            <p className="oh-foot__tag">
              Bringing back the goodness of traditional organic heritage that
              nourished generations.
            </p>

            <form className="oh-foot__form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="oh-foot__input"
                aria-label="Email"
              />
              <button type="submit" className="oh-foot__subscribe">Subscribe</button>
            </form>
          </div>

          {/* Quick links */}
          <div className="oh-foot__col oh-reveal oh-reveal--stagger-2">
            <h4 className="oh-foot__heading inter-font">Quick links</h4>
            <ul className="oh-foot__list">
              <li><a href="#grains">About Us</a></li>
              <li><a href="#cosmetics">Grains</a></li>
              <li><a href="#apothecary">Cosmetics</a></li>
              <li><a href="#gifts">Contact</a></li>
            </ul>
          </div>

          {/* Get in touch */}
          <div className="oh-foot__col oh-reveal oh-reveal--stagger-3">
            <h4 className="oh-foot__heading inter-font">Get in touch</h4>
            <ul className="oh-foot__list oh-foot__list--touch">
              <li className='icon'>
                <LocationIcon />
                <span>#333/97, Lakshmanaswamy Salai,
kk Nagar, Chennai- 600 078,
Tamil Nadu, INDIA.</span>
              </li>
              <li>
                <PhoneIcon />
                <span>Landline :+91 98765 43210<br />Mobile    :+91 98765 43211</span>
              </li>
              <li>
                <MailIcon />
                <span>enquiry@push.digital</span>
              </li>
            </ul>
          </div>

          {/* Last column */}
          <div className="oh-foot__col oh-reveal oh-reveal--stagger-4">
            <h4 className="oh-foot__heading1 inter-font">Follow us</h4>
            <div className="oh-foot__social">
              <a href="#" aria-label="Facebook" className="oh-foot__socialBtn"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram" className="oh-foot__socialBtn"><InstagramIcon /></a>
              <a href="#" aria-label="Youtube" className="oh-foot__socialBtn"><YoutubeIcon /></a>
            </div>
          </div>
        </div>

        <div className="oh-foot__bottom">
          <span>© 2026 Organic Heritage. All right reserved.</span>
          <span className="oh-foot__bottomBrand">ORGANIC HERITAGE — NOURISHING LIFE NATURALLY</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
