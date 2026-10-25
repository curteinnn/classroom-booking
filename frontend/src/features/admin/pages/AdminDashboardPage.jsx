import Navbar from "../../../shared/layout/Navbar";
import BookingApprovalPanel from "../components/BookingApprovalPanel";
import DashboardStats from "../components/DashboardStats";
import RoomManagementPanel from "../components/RoomManagementPanel";
import UserManagementPanel from "../components/UserManagementPanel";
import useAdminDashboard from "../hooks/useAdminDashboard";

export default function AdminDashboardPage() {
  const dashboard = useAdminDashboard();

  return (
    <main className="min-h-screen bg-slate-50 pt-16">
      <Navbar />
      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">SmartClass · Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Dashboard admin</h1>
          <p className="mt-2 text-slate-600">Kelola ruangan, akun, dan persetujuan peminjaman dari satu halaman.</p>
        </header>

        {dashboard.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{dashboard.error}</p>}
        {dashboard.notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-green-800">{dashboard.notice}</p>}
        {dashboard.loading && <p className="text-sm text-slate-500">Memuat data dashboard...</p>}

        <DashboardStats rooms={dashboard.rooms} users={dashboard.users} bookings={dashboard.bookings} />
        <RoomManagementPanel
          rooms={dashboard.rooms}
          loading={dashboard.loading}
          form={dashboard.roomForm}
          setForm={dashboard.setRoomForm}
          editingRoomId={dashboard.editingRoomId}
          onSubmit={dashboard.submitRoom}
          onEdit={dashboard.editRoom}
          onCancelEdit={dashboard.cancelRoomEdit}
          onToggleStatus={dashboard.toggleRoom}
          onDelete={dashboard.removeRoom}
        />
        <UserManagementPanel
          users={dashboard.users}
          loading={dashboard.loading}
          form={dashboard.userForm}
          setForm={dashboard.setUserForm}
          onSubmit={dashboard.submitUser}
          onToggleStatus={dashboard.toggleUser}
        />
        <BookingApprovalPanel
          bookings={dashboard.bookings}
          loading={dashboard.loading}
          reasons={dashboard.rejectionReasons}
          setReasons={dashboard.setRejectionReasons}
          onReview={dashboard.reviewBooking}
        />
      </div>
    </main>
  );
}
