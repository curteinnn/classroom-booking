import { Navigate } from "react-router-dom";
import useRoleAccess from "./useRoleAccess";

export default function RoleRoute({ children, allowedRoles }) {
  const { access, redirectTo, retry } = useRoleAccess(allowedRoles);
  if (redirectTo) return <Navigate to={redirectTo} replace />;

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
            onClick={retry}
            className="mt-4 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white"
          >
            Coba lagi
          </button>
        </section>
      </main>
    );
  }

  if (access.status === "ready" && !allowedRoles.includes(access.role)) {
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
