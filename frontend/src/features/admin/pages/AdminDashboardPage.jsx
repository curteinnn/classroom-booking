import Navbar from "../../../shared/layout/Navbar";
import { usePageAnimationRef } from "../../../animations/cardAnimations";
import AdminMenuCards from "../components/AdminMenuCards";
import BookingApprovalPanel from "../components/BookingApprovalPanel";
import DashboardStats from "../components/DashboardStats";
import RoomManagementPanel from "../components/RoomManagementPanel";
import UserManagementPanel from "../components/UserManagementPanel";
import useAdminDashboard from "../hooks/useAdminDashboard";

export default function AdminDashboardPage() {
  const pageRef = usePageAnimationRef();
  const dashboard = useAdminDashboard();

  return (
    <main ref={pageRef} className="min-h-screen bg-slate-50 pt-16">
      <Navbar />
      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">
        <header data-motion="heading" className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">SmartClass &middot; Admin</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Dashboard admin</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Pantau operasional ruang kelas dan proses booking dari satu tempat.</p>
          </div>
          <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">Administrator</span>
        </header>

        {dashboard.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{dashboard.error}</p>}
        {dashboard.notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{dashboard.notice}</p>}
        {dashboard.loading && <p className="rounded-xl bg-white p-4 text-sm text-slate-500" role="status">Memuat data dashboard...</p>}

        <DashboardStats stats={dashboard.stats} />
        <AdminMenuCards activeSection={dashboard.activeSection} counts={dashboard.menuCounts} onSelect={dashboard.handleSectionSelect} />

        {dashboard.activeSection === "rooms" && (
          <RoomManagementPanel
            rooms={dashboard.rooms}
            loading={dashboard.loading}
            form={dashboard.roomForm}
            onFormChange={dashboard.handleRoomFormChange}
            editingRoomId={dashboard.editingRoomId}
            onSubmit={dashboard.submitRoom}
            onPanelClick={dashboard.handleRoomAction}
          />
        )}
        {dashboard.activeSection === "users" && (
          <UserManagementPanel
            users={dashboard.filteredUsers}
            totalUsers={dashboard.users.length}
            loading={dashboard.loading}
            form={dashboard.userForm}
            search={dashboard.userSearch}
            roleFilter={dashboard.userRoleFilter}
            onSearch={dashboard.handleUserSearch}
            onRoleFilter={dashboard.handleUserRoleFilter}
            onFormChange={dashboard.handleUserFormChange}
            onSubmit={dashboard.submitUser}
            onToggleStatus={dashboard.handleUserStatus}
          />
        )}
        {dashboard.activeSection === "bookings" && (
          <BookingApprovalPanel
            bookings={dashboard.filteredBookings}
            loading={dashboard.loading}
            reasons={dashboard.rejectionReasons}
            status={dashboard.bookingStatus}
            counts={dashboard.bookingCounts}
            processingId={dashboard.processingBookingId}
            onStatusChange={dashboard.handleBookingStatusSelect}
            onReasonChange={dashboard.handleBookingReasonChange}
            onReview={dashboard.handleBookingReview}
          />
        )}
      </div>
    </main>
  );
}
