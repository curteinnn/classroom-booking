import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../features/auth/authApi";
import { getSession } from "../../shared/auth/sessionStore";

export default function RoleRoute({ children, allowedRoles }) {
  const session = getSession();
  const [attempt, setAttempt] = useState(0);
  const [access, setAccess] = useState({
    status: "checking",
    role: null,
    error: "",
  });

  useEffect(() => {
    if (!session?.token) return undefined;

    let active = true;
    setAccess({ status: "checking", role: null, error: "" });

    getCurrentUser()
      .then(({ user }) => {
        if (active) {
          setAccess({
            status: "ready",
            role: String(user?.role || "")
              .trim()
              .toLowerCase(),
            error: "",
          });
        }
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401) {
          setAccess({ status: "unauthenticated", role: null, error: "" });
        } else {
          setAccess({ status: "error", role: null, error: error.message });
        }
      });

    return () => {
      active = false;
    };
  }, [session?.token, attempt]);

  if (!session?.token) return <Navigate to="/" replace />;

  if (access.status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Memeriksa akses...
      </main>
    );
  }

  if (access.status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <section className="max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Akses belum dapat diperiksa
          </h1>
          <p role="alert" className="mt-2 text-sm text-slate-600">
            {access.error}
          </p>
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className="mt-4 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white"
          >
            Coba lagi
          </button>
        </section>
      </main>
    );
  }

  if (access.status === "unauthenticated" || !access.role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(access.role)) {
    if (access.role === "admin") return <Navigate to="/admin" replace />;
    if (["mahasiswa", "dosen"].includes(access.role))
      return <Navigate to="/home" replace />;
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <section className="max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Role akun tidak dikenali
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Hubungi administrator untuk memeriksa role akun.
          </p>
        </section>
      </main>
    );
  }

  return children;
}
