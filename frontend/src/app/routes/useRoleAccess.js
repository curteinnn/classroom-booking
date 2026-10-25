import { useEffect, useState } from "react";
import { getCurrentUser } from "../../features/auth/authApi";
import { getSession } from "../../shared/auth/sessionStore";

export default function useRoleAccess(allowedRoles) {
  const session = getSession();
  const [attempt, setAttempt] = useState(0);
  const [access, setAccess] = useState({ status: "checking", role: null, error: "" });

  useEffect(() => {
    if (!session?.token) return undefined;
    let active = true;
    setAccess({ status: "checking", role: null, error: "" });
    getCurrentUser()
      .then(({ user }) => {
        if (active) setAccess({ status: "ready", role: String(user?.role || "").trim().toLowerCase(), error: "" });
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401) setAccess({ status: "unauthenticated", role: null, error: "" });
        else setAccess({ status: "error", role: null, error: error.message });
      });
    return () => { active = false; };
  }, [session?.token, attempt]);

  let redirectTo = null;
  if (!session?.token || access.status === "unauthenticated" || (access.status === "ready" && !access.role)) redirectTo = "/";
  else if (access.status === "ready" && !allowedRoles.includes(access.role)) {
    if (access.role === "admin") redirectTo = "/admin";
    else if (["mahasiswa", "dosen"].includes(access.role)) redirectTo = "/home";
  }

  return { access, redirectTo, retry: () => setAttempt((value) => value + 1) };
}
