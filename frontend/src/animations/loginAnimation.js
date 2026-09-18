import gsap from "gsap";

export default function loginAnimation(container) {
  const card = container.querySelector(".login-card");
  const title = container.querySelector(".login-title");
  const form = container.querySelector(".login-form");
  const button = container.querySelector(".login-button");

  const tl = gsap.timeline();

  tl.from(card, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power3.out",
  })
    .from(
      title,
      {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.4"
    )
    .from(
      form.children,
      {
        opacity: 0,
        y: 15,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.2"
    );

  button.addEventListener("mouseenter", () => {
    gsap.to(button, {
      scale: 1.02,
      duration: 0.2,
    });
  });

  button.addEventListener("mouseleave", () => {
    gsap.to(button, {
      scale: 1,
      duration: 0.2,
    });
  });
}