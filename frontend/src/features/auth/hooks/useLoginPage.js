import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { flipAuthCard, playLoginTransition, setupAuthAnimations } from "../../../animations/authAnimations";
import useLogin from "./useLogin";

const emptySignup = { nama: "", identifier: "", email: "", role: "mahasiswa", password: "", confirmation: "" };

export default function useLoginPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const transitionRef = useRef(null);
  const previousView = useRef("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [signupForm, setSignupForm] = useState(emptySignup);
  const [signupError, setSignupError] = useState("");
  const [signupNotice, setSignupNotice] = useState("");
  const { error, loading, submit } = useLogin();

  useGSAP(() => setupAuthAnimations(containerRef.current), { scope: containerRef });

  useGSAP(
    () => {
      if (previousView.current === authView) return;
      previousView.current = authView;
      return flipAuthCard(cardRef.current, authView === "signup", () => setIsFlipping(false));
    },
    { scope: cardRef, dependencies: [authView] },
  );

  async function handleLoginSubmit(event) {
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

  function showSignup() {
    if (isFlipping || authView === "signup") return;
    setSignupError("");
    setSignupNotice("");
    setIsFlipping(true);
    setAuthView("signup");
  }

  function showLogin() {
    if (isFlipping || authView === "login") return;
    setSignupError("");
    setIsFlipping(true);
    setAuthView("login");
  }

  function handleIdentifierChange(event) { setIdentifier(event.target.value); }
  function handlePasswordChange(event) { setPassword(event.target.value); }
  function handleSignupFieldChange(event) {
    const { field } = event.target.dataset;
    setSignupForm((current) => ({ ...current, [field]: event.target.value }));
    setSignupError("");
    setSignupNotice("");
  }

  function handleSignupSubmit(event) {
    event.preventDefault();
    setSignupError("");
    setSignupNotice("Formulir sudah diisi, tetapi pendaftaran mandiri belum tersedia dan data tidak disimpan. Hubungi admin untuk mendapatkan akun aktivasi.");
  }

  return {
    containerRef,
    cardRef,
    transitionRef,
    identifier,
    password,
    error,
    loading,
    isTransitioning,
    isFlipping,
    authView,
    signupForm,
    signupError,
    signupNotice,
    handleLoginSubmit,
    handleIdentifierChange,
    handlePasswordChange,
    handleSignupFieldChange,
    handleSignupSubmit,
    showSignup,
    showLogin,
  };
}
