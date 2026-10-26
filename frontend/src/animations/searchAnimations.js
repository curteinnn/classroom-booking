import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function useSearchModeAnimation(scope, mode) {
  const previousMode = useRef(mode);

  useGSAP(
    () => {
      if (previousMode.current === mode) return;
      previousMode.current = mode;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const content = scope.current?.querySelector(
        "[data-search-mode-content]",
      );
      if (!content) return;
      return gsap.fromTo(
        content,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" },
      );
    },
    { scope, dependencies: [mode], revertOnUpdate: true },
  );
}
