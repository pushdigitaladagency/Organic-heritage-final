"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SCROLL_REVEAL_REFRESH_EVENT = "oh:refresh-scroll-reveal";
const REVEAL_SELECTOR =
  ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-img";

export const requestScrollRevealRefresh = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SCROLL_REVEAL_REFRESH_EVENT));
};

const setupScrollReveal = () => {
  const els = document.querySelectorAll(REVEAL_SELECTOR);
  if (!els.length) return undefined;

  const preloaderActive = () =>
    document.body.hasAttribute("data-preloader-active");

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

    const rect = el.getBoundingClientRect();
    const alreadyInView =
      rect.top < window.innerHeight - 20 && rect.bottom > 0;

    if (alreadyInView) {
      if (!preloaderActive()) {
        el.classList.add("is-visible");
      }
    } else {
      observer.observe(el);
    }
  });

  return () => observer.disconnect();
};

export default function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    let cleanupReveal;

    const runReveal = () => {
      cleanupReveal?.();
      cleanupReveal = setupScrollReveal();
    };

    const timer = setTimeout(runReveal, 250);
    window.addEventListener(SCROLL_REVEAL_REFRESH_EVENT, runReveal);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(SCROLL_REVEAL_REFRESH_EVENT, runReveal);
      cleanupReveal?.();
    };
  }, [pathname]);

  return null;
}
