import gsap from "gsap";

export function animateMobileNavigation(panel, backdrop, open) {
  if (!panel || !backdrop) return undefined;
  gsap.killTweensOf([panel, backdrop]);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(panel, {
      visibility: open ? "visible" : "hidden",
      opacity: open ? 1 : 0,
      y: 0,
    });
    gsap.set(backdrop, {
      visibility: open ? "visible" : "hidden",
      opacity: open ? 1 : 0,
    });
    return undefined;
  }

  if (open) {
    gsap.set([panel, backdrop], { visibility: "visible" });
    return gsap
      .timeline()
      .fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power1.out" },
        0,
      )
      .fromTo(
        panel,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.26, ease: "power2.out" },
        0.02,
      );
  }

  return gsap
    .timeline({
      onComplete: () => gsap.set([panel, backdrop], { visibility: "hidden" }),
    })
    .to(panel, { opacity: 0, y: -8, duration: 0.18, ease: "power1.in" }, 0)
    .to(backdrop, { opacity: 0, duration: 0.18, ease: "power1.in" }, 0);
}
