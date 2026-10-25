import gsap from "gsap";

export function setupLoginAnimations(container) {
  if (!container) return undefined;
  const card = container.querySelector(".login-card");
  const title = container.querySelector(".login-title");
  const form = container.querySelector(".login-form");
  const button = container.querySelector(".login-button");
  const shine = container.querySelector(".smart-shine");
  const timeline = gsap.timeline();
  if (card)
    timeline.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
    });
  if (title)
    timeline.from(
      title,
      { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" },
      "-=0.4",
    );
  if (form)
    timeline.from(
      form.children,
      { opacity: 0, y: 15, duration: 0.4, stagger: 0.1, ease: "power2.out" },
      "-=0.2",
    );

  const onEnter = () => gsap.to(button, { scale: 1.02, duration: 0.2 });
  const onLeave = () => gsap.to(button, { scale: 1, duration: 0.2 });
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
    timeline.kill();
    button?.removeEventListener("mouseenter", onEnter);
    button?.removeEventListener("mouseleave", onLeave);
    gsap.killTweensOf(shine);
  };
}

export function playLoginTransition(container, overlay, onComplete) {
  return gsap
    .timeline({ defaults: { ease: "power3.inOut" }, onComplete })
    .to(
      container.querySelector(".login-card"),
      { y: -16, scale: 0.98, opacity: 0, duration: 0.42 },
      0,
    )
    .to(container, { filter: "blur(5px)", scale: 1.015, duration: 0.62 }, 0)
    .to(overlay, { clipPath: "circle(150% at 50% 50%)", duration: 0.68 }, 0.03);
}
