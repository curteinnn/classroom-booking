import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import BookingHistory from "./pages/BookingHistory";
import ActivateAccount from "./pages/ActivateAccount";
import AdminDashboard from "./pages/AdminDashboard";
import { apiRequest, getSession } from "./services/api";

function RoleRoute({ children, allowedRoles }) {
  const [role, setRole] = useState(null);
  const [checking, setChecking] = useState(true);
  const session = getSession();

  useEffect(() => {
    let active = true;
    if (!session?.token) {
      return () => { active = false; };
    }

    apiRequest("/api/auth/me")
      .then(({ user }) => {
        if (active) setRole(user?.role || null);
      })
      .catch(() => {
        if (active) setRole(null);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => { active = false; };
  }, [session?.token]);

  if (!session?.token) return <Navigate to="/" replace />;
  if (checking) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">Memeriksa akses...</main>;
  }
  if (!role) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === "admin" ? "/admin" : "/home"} replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/home" element={<RoleRoute allowedRoles={["mahasiswa", "dosen"]}><Home /></RoleRoute>} />
        <Route path="/rooms" element={<RoleRoute allowedRoles={["mahasiswa", "dosen"]}><Rooms /></RoleRoute>} />
        <Route path="/riwayat" element={<RoleRoute allowedRoles={["mahasiswa", "dosen"]}><BookingHistory /></RoleRoute>} />
        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
