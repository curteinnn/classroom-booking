import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { animateMobileNavigation } from "../../animations/navigationAnimations";
import { clearSession, getSession } from "../auth/sessionStore";

export default function useNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mobilePanelRef = useRef(null);
  const backdropRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const session = getSession();
  const isAdmin = String(session?.user?.role || "").trim().toLowerCase() === "admin";
  const links = (isAdmin
    ? [{ label: "Dashboard admin", path: "/admin" }]
    : [{ label: "Beranda", path: "/home" }, { label: "Ruangan", path: "/rooms" }, { label: "Riwayat", path: "/riwayat" }])
    .map((link) => ({ ...link, isActive: pathname === link.path }));

  useEffect(() => {
    const timeline = animateMobileNavigation(mobilePanelRef.current, backdropRef.current, isMobileMenuOpen);
    return () => timeline?.kill();
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(min-width: 768px)");
    function closeAtDesktop(event) {
      if (event.matches) setIsMobileMenuOpen(false);
    }
    mobileQuery.addEventListener("change", closeAtDesktop);
    return () => mobileQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    function closeAfterHistoryNavigation() {
      setIsMobileMenuOpen(false);
    }
    window.addEventListener("popstate", closeAfterHistoryNavigation);
    return () => window.removeEventListener("popstate", closeAfterHistoryNavigation);
  }, []);

  function toggleMobileMenu() {
    setIsMobileMenuOpen((current) => !current);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function handleLogout() {
    clearSession();
    setIsMobileMenuOpen(false);
    navigate("/", { replace: true });
  }

  return {
    session,
    links,
    isAdmin,
    isMobileMenuOpen,
    mobilePanelRef,
    backdropRef,
    toggleMobileMenu,
    closeMobileMenu,
    handleLogout,
  };
}
