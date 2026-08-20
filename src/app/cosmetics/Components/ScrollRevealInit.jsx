"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Runs the IntersectionObserver-based scroll reveal on every route change.
 * Elements with classes: reveal, reveal-up, reveal-left, reveal-right, reveal-img
 * will animate in when they enter the viewport.
 *
 * On the home page (/) the Preloader component handles the initial hero reveal
 * via its own triggerReveal() after the curtain exits. ScrollRevealInit defers
 * to the Preloader for elements already in the viewport so the animations play
 * correctly instead of being skipped.
 */
export default function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if the Preloader is still active (it sets this attribute on <body>)
    const preloaderActive = () =>
      document.body.hasAttribute("data-preloader-active");

    const timer = setTimeout(() => {
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
        // Reset for clean page transitions
        el.classList.remove("is-visible");

        const rect = el.getBoundingClientRect();
        const alreadyInView =
          rect.top < window.innerHeight - 20 && rect.bottom > 0;

        if (alreadyInView) {
          // If the Preloader is still running, do NOT instantly show it —
          // the Preloader's triggerReveal() will animate it in after exit.
          if (!preloaderActive()) {
            el.classList.add("is-visible");
          }
          // If preloader is active, just let it be — triggerReveal handles it.
        } else {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
