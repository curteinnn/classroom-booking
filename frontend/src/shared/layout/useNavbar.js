import { useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../auth/sessionStore";

export default function useNavbar() {
  const navigate = useNavigate();
  const session = getSession();
  const isAdmin = String(session?.user?.role || "").trim().toLowerCase() === "admin";
  function handleLogout() {
    clearSession();
    navigate("/", { replace: true });
  }
  return { session, isAdmin, handleLogout };
}
