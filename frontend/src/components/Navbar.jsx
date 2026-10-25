import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { clearSession, getSession } from "../services/api";

export default function Navbar() {
  const session = getSession();

  return (
    <nav className="absolute top-0 h-12 left-0 z-50 w-full bg-white px-8 md:block">
      <div className="flex h-12 items-center justify-between">
        <Link to="/home" className="flex gap-2 justify-center items-center">
          <img src={logo} alt="Classroom" className="h-8 w-auto" />
          <h1 className="text-blue-400">
            Smart<span className="text-blue-600">Class</span>
          </h1>
        </Link>

        <div className="flex items-center gap-8 ">
          <Link
            to="/rooms"
            className="hidden md:block text-sm text-blue-400 transition hover:text-black"
          >
            Rooms
          </Link>

          <Link
            to="/riwayat"
            className="hidden md:block text-sm text-blue-400 transition hover:text-black"
          >
            Riwayat
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-600 sm:inline">
            {session?.user?.nama || session?.user?.identifier}
          </span>
          <button
            type="button"
            onClick={() => {
              clearSession();
              window.location.assign("/");
            }}
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
          >
            Keluar
          </button>
        </div>
      </div>
    </nav>
  );
}
