import gsap from "gsap";

export default function homeAnimation(home) {
  if (!home) return;

  const card = home.querySelector(".card1");
  if (!card) return;

  return gsap.from(card, {
    opacity: 0,
    y: 80,
    ease: "power3.inOut",
    duration: 0.8,
  });
}
