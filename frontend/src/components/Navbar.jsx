import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="hidden absolute top-0 h-12 left-0 z-50 w-full bg-white px-8 md:block">
      <div className="flex h-12 items-center justify-between">
        <Link to="/home" className="text-sm font-bold text-blue-400">
          Classroom.
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/home"
            className="text-sm text-blue-400 transition hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/rooms"
            className="text-sm text-blue-400 transition hover:text-black"
          >
            Rooms
          </Link>

          <Link
            to="/riwayat"
            className="text-sm text-blue-400 transition hover:text-black"
          >
            Riwayat
          </Link>
        </div>

        {/* Profile */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-400 text-sm font-bold text-white">
          A
        </div>
      </div>
    </nav>
  );
}
