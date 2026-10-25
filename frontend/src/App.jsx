import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import BookingHistory from "./pages/BookingHistory";
import ActivateAccount from "./pages/ActivateAccount";
import { getSession } from "./services/api";

function ProtectedRoute({ children }) {
  return getSession() ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
        <Route path="/riwayat" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
