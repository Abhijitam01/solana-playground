/**
 * Lightweight GSAP helpers for the landing page.
 */
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

const noop = () => {};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const ensureGsap = () => {
  if (typeof window === "undefined") return null;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
};

export function fadeInStagger(
  root: Element | null,
  selector = "[data-reveal]",
  delay = 0.1
) {
  const g = ensureGsap();
  if (!g || !root) return noop;

  const elements = root.querySelectorAll(selector);
  const ctx = g.context(() => {
    g.fromTo(
      elements,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        stagger: delay,
      }
    );
  }, root);

  return () => ctx.revert();
}

export function parallaxY(
  targets: Array<Element | null>,
  distance = 40,
  start = "top 85%"
) {
  const g = ensureGsap();
  if (!g) return noop;

  const cleanups: Array<() => void> = [];
  targets.forEach((target) => {
    if (!target) return;
    const ctx = g.context(() => {
      g.fromTo(
        target,
        { y: distance, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "power2.out",
          duration: 0.8,
          scrollTrigger: {
            trigger: target,
            start,
            toggleActions: "play none none reverse",
          },
        }
      );
    }, target);
    cleanups.push(() => ctx.revert());
  });

  return () => cleanups.forEach((c) => c());
}

export function floatingGlow(target: Element | null, strength = 8) {
  const g = ensureGsap();
  if (!g || !target) return noop;

  const ctx = g.context(() => {
    g.to(target, {
      x: () => g.utils.random(-strength, strength),
      y: () => g.utils.random(-strength, strength),
      scale: () => g.utils.random(0.96, 1.04),
      ease: "sine.inOut",
      duration: 2.4,
      repeat: -1,
      yoyo: true,
    });
  }, target);

  return () => ctx.revert();
}

