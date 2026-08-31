"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import "./Preloader.css";

export default function Preloader() {
  const [phase, setPhase] = useState("enter"); // enter → hold → exit → done
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Mark body so ScrollRevealInit knows the preloader is running
    document.body.setAttribute("data-preloader-active", "1");
    // Lock scroll while preloader is active
    document.body.style.overflow = "hidden";

    // Animate progress bar
    let start = null;
    const duration = 1800;

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        // Hold briefly then exit
        setTimeout(() => {
          setPhase("exit");
          setTimeout(() => {
            setPhase("done");
            document.body.style.overflow = "";
            // Remove preloader-active flag so ScrollRevealInit works on next nav
            document.body.removeAttribute("data-preloader-active");
            // Trigger scroll reveal for elements already in view
            triggerReveal();
          }, 900);
        }, 200);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    if (phase !== "done") return;
    triggerReveal();
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`preloader ${phase === "exit" ? "preloader--exit" : ""}`}>
      {/* Background curtain */}
      <div className="preloader__curtain preloader__curtain--top" />
      <div className="preloader__curtain preloader__curtain--bottom" />

      {/* Center content */}
      <div className="preloader__center">
        {/* Logo */}
        <div className="preloader__logo-wrap">
          <img
            src={asset("/images/svg/Organic_logo.svg")}
            alt="Organic Heritage Cosmetics"
            className="preloader__logo"
          />
        </div>

        {/* Brand name */}
        <p className="preloader__brand">ORGANIC HERITAGE COSMETICS</p>

        {/* Progress bar */}
        <div className="preloader__track">
          <div
            className="preloader__bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tagline */}
        <p className="preloader__tagline">Pure · Botanical · Crafted</p>
      </div>
    </div>
  );
}

/* ---- Scroll Reveal Helper ---- */
function triggerReveal() {
  const els = document.querySelectorAll(
    "[data-reveal], .reveal, .reveal-img, .reveal-left, .reveal-right, .reveal-up"
  );

  if (!els.length) return;

  // Separate elements that are already in the viewport from those below the fold.
  // Already-visible elements need a short delay so the browser paints the
  // initial hidden state (opacity:0 / transform) BEFORE we add is-visible,
  // which lets the CSS transition actually play.
  const alreadyVisible = [];
  const belowFold = [];

  els.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      alreadyVisible.push(el);
    } else {
      belowFold.push(el);
    }
  });

  // Animate hero / above-fold elements with a tiny stagger after one rAF
  // so the CSS transition duration (0.75 s) has a chance to run.
  requestAnimationFrame(() => {
    alreadyVisible.forEach((el, i) => {
      // Read the existing transition-delay set by .reveal-delay-* classes
      const existingDelay =
        parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
      const baseDelay = 60; // ms — just enough for the browser to paint opacity:0
      setTimeout(() => {
        el.classList.add("is-visible");
      }, baseDelay + existingDelay);
    });
  });

  // Off-screen elements use IntersectionObserver as usual
  if (!belowFold.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  belowFold.forEach((el) => observer.observe(el));
}
