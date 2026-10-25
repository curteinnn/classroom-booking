import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ActivateAccountPage from "./features/auth/pages/ActivateAccountPage";
import LoginPage from "./features/auth/pages/LoginPage";
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import BookingHistoryPage from "./features/bookings/pages/BookingHistoryPage";
import HomePage from "./features/home/pages/HomePage";
import RoomsPage from "./features/rooms/pages/RoomsPage";
import RoleRoute from "./app/routes/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/activate" element={<ActivateAccountPage />} />
        <Route path="/home" element={<RoleRoute allowedRoles={["mahasiswa", "dosen"]}><HomePage /></RoleRoute>} />
        <Route path="/rooms" element={<RoleRoute allowedRoles={["mahasiswa", "dosen"]}><RoomsPage /></RoleRoute>} />
        <Route path="/riwayat" element={<RoleRoute allowedRoles={["mahasiswa", "dosen"]}><BookingHistoryPage /></RoleRoute>} />
        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboardPage /></RoleRoute>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
