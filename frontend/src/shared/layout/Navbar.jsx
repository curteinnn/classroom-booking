import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import useNavbar from "./useNavbar";

function Brand({ to, onNavigate }) {
  return (
    <Link to={to} onClick={onNavigate} className="flex w-fit items-center gap-3">
      <img src={logo} alt="" className="h-9 w-auto" />
      <span className="text-lg font-bold tracking-tight text-slate-800">Smart<span className="text-blue-700">Class</span></span>
    </Link>
  );
}

function NavigationLinks({ links, onNavigate, mobile = false }) {
  return links.map((link) => (
    <Link
      aria-current={link.isActive ? "page" : undefined}
      key={link.path}
      to={link.path}
      onClick={onNavigate}
      className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${link.isActive ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"} ${mobile ? "w-full" : ""}`}
    >
      {link.label}
    </Link>
  ));
}

export default function Navbar() {
  const {
    session,
    links,
    isAdmin,
    isMobileMenuOpen,
    mobilePanelRef,
    backdropRef,
    toggleMobileMenu,
    closeMobileMenu,
    handleLogout,
  } = useNavbar();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60] flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 shadow-sm backdrop-blur md:hidden">
        <Brand to={isAdmin ? "/admin" : "/home"} onNavigate={closeMobileMenu} />
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation-panel"
          onClick={toggleMobileMenu}
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6">
            {isMobileMenuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </header>

      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={closeMobileMenu}
        className="invisible fixed inset-0 z-40 bg-slate-950/30 opacity-0 md:hidden"
      />
      <div
        ref={mobilePanelRef}
        id="mobile-navigation-panel"
        aria-label="Navigasi utama"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        className="invisible fixed inset-x-3 top-[4.25rem] z-50 rounded-2xl border border-slate-200 bg-white p-4 opacity-0 shadow-xl md:hidden"
      >
        <p className="mb-3 truncate px-3 text-sm font-medium text-slate-500">{session?.user?.nama || session?.user?.identifier}</p>
        <nav className="grid gap-1" aria-label="Menu mobile">
          <NavigationLinks links={links} onNavigate={closeMobileMenu} mobile />
        </nav>
        <button type="button" onClick={handleLogout} className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Keluar
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-200 bg-white/95 px-5 py-6 shadow-sm backdrop-blur md:flex">
        <Brand to={isAdmin ? "/admin" : "/home"} />
        <p className="mt-8 truncate px-3 text-sm font-medium text-slate-500">{session?.user?.nama || session?.user?.identifier}</p>
        <nav className="mt-3 grid gap-1" aria-label="Navigasi utama">
          <NavigationLinks links={links} />
        </nav>
        <div className="mt-auto border-t border-slate-200 pt-4">
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-700">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M10 17l5-5-5-5m5 5H3m9-9h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
