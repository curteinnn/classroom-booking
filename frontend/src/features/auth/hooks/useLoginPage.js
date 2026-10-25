import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { playLoginTransition, setupLoginAnimations } from "../../../animations/loginAnimations";
import useLogin from "./useLogin";

export default function useLoginPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const transitionRef = useRef(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { error, loading, submit } = useLogin();

  useGSAP(() => setupLoginAnimations(containerRef.current), { scope: containerRef });

  async function handleSubmit(event) {
    event.preventDefault();
    const data = await submit({ identifier, password });
    if (!data) return;
    const destination = String(data.user?.role || "").trim().toLowerCase() === "admin" ? "/admin" : "/home";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate(destination);
      return;
    }
    setIsTransitioning(true);
    playLoginTransition(containerRef.current, transitionRef.current, () => navigate(destination));
  }

  function handleIdentifierChange(event) { setIdentifier(event.target.value); }
  function handlePasswordChange(event) { setPassword(event.target.value); }

  return { containerRef, transitionRef, identifier, password, error, loading, isTransitioning, handleSubmit, handleIdentifierChange, handlePasswordChange };
}
