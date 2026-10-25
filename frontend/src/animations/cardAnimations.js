import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function usePageAnimations(scope) {
  useGSAP(
    () => {
      const root = scope.current;
      if (
        !root ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      const headings = root.querySelectorAll('[data-motion="heading"]');
      const sections = root.querySelectorAll('[data-motion="section"]');
      const cards = root.querySelectorAll('[data-motion="card"]');

      timeline.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.28 });
      if (headings.length)
        timeline.fromTo(
          headings,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.48, stagger: 0.07 },
          "<0.04",
        );
      if (sections.length)
        timeline.fromTo(
          sections,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.42, stagger: 0.08 },
          "<0.06",
        );
      if (cards.length)
        timeline.fromTo(
          cards,
          { opacity: 0, y: 20, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            stagger: { each: 0.075, from: "start" },
          },
          "<0.04",
        );
    },
    { scope },
  );

  useEffect(() => {
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const cleanups = [];
    const bound = new WeakSet();
    const animated = new WeakSet(root.querySelectorAll('[data-motion="card"]'));
    const addInteraction = (element, selector, enterVars, leaveVars) => {
      if (!element.matches(selector) || bound.has(element)) return;
      bound.add(element);
      const enter = () =>
        gsap.to(element, { ...enterVars, duration: 0.2, ease: "power2.out" });
      const leave = () =>
        gsap.to(element, { ...leaveVars, duration: 0.24, ease: "power2.out" });
      element.addEventListener("mouseenter", enter);
      element.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        element.removeEventListener("mouseenter", enter);
        element.removeEventListener("mouseleave", leave);
      });
    };
    const bindTree = (element) => {
      [element, ...element.querySelectorAll("*")].forEach((node) => {
        addInteraction(
          node,
          '[data-motion="card"]',
          {
            y: -4,
            scale: 1.01,
            boxShadow: "0 18px 42px rgba(15, 23, 42, 0.13)",
          },
          { y: 0, scale: 1, clearProps: "boxShadow" },
        );
        addInteraction(
          node,
          '[data-motion="button"]',
          { y: -2, scale: 1.025 },
          { y: 0, scale: 1 },
        );
      });
    };
    bindTree(root);
    const observer = new MutationObserver((records) => {
      const cards = [];
      records
        .flatMap((record) => Array.from(record.addedNodes))
        .forEach((node) => {
          if (!(node instanceof Element)) return;
          bindTree(node);
          if (node.matches('[data-motion="card"]') && !animated.has(node))
            cards.push(node);
          node.querySelectorAll('[data-motion="card"]').forEach((card) => {
            if (!animated.has(card)) cards.push(card);
          });
        });
      cards.forEach((card) => animated.add(card));
      if (cards.length)
        gsap.fromTo(
          cards,
          { opacity: 0, y: 18, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            stagger: 0.065,
            ease: "power3.out",
          },
        );
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [scope]);
}

export function usePageAnimationRef() {
  const scope = useRef(null);
  usePageAnimations(scope);
  return scope;
}
