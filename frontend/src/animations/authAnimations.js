import gsap from "gsap";

export function setupAuthAnimations(container) {
  if (!container) return undefined;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return undefined;
  const card = container.querySelector(".auth-card");
  const title = container.querySelector(".login-title");
  const form = container.querySelector(".login-form");
  const button = container.querySelector(".login-button");
  const shine = container.querySelector(".smart-shine");
  const intro = gsap.timeline();
  if (card)
    intro.from(card, { opacity: 0, y: 28, duration: 0.65, ease: "power3.out" });
  if (title)
    intro.from(
      title,
      { opacity: 0, y: 14, duration: 0.35, ease: "power2.out" },
      "-=0.3",
    );
  if (form)
    intro.from(
      form.children,
      { opacity: 0, y: 10, duration: 0.32, stagger: 0.07, ease: "power2.out" },
      "-=0.15",
    );

  const onEnter = () => gsap.to(button, { scale: 1.02, duration: 0.18 });
  const onLeave = () => gsap.to(button, { scale: 1, duration: 0.18 });
  button?.addEventListener("mouseenter", onEnter);
  button?.addEventListener("mouseleave", onLeave);
  if (shine)
    gsap.fromTo(
      shine,
      { left: "110%" },
      {
        left: "-20%",
        duration: 1.2,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 3.8,
      },
    );

  return () => {
    intro.kill();
    button?.removeEventListener("mouseenter", onEnter);
    button?.removeEventListener("mouseleave", onLeave);
    gsap.killTweensOf(shine);
  };
}

export function flipAuthCard(card, showSignup, onComplete) {
  if (!card) return undefined;
  const targetRotation = showSignup ? 180 : 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(card, { rotationY: targetRotation });
    onComplete?.();
    return undefined;
  }
  gsap.killTweensOf(card);
  return gsap.to(card, {
    rotationY: targetRotation,
    duration: 0.68,
    ease: "power3.inOut",
    transformOrigin: "center center",
    onComplete,
  });
}

export function playLoginTransition(container, overlay, onComplete) {
  const card = container?.querySelector(".auth-card");
  if (!container || !overlay || !card) return undefined;
  return gsap
    .timeline({ defaults: { ease: "power3.inOut" }, onComplete })
    .to(card, { y: -12, scale: 0.985, opacity: 0, duration: 0.4 }, 0)
    .to(container, { filter: "blur(4px)", scale: 1.01, duration: 0.58 }, 0)
    .to(overlay, { clipPath: "circle(150% at 50% 50%)", duration: 0.66 }, 0.02);
}
