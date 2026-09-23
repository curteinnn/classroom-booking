import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="hidden absolute top-0 h-12 left-0 z-50 w-full bg-white px-8 md:block">
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

        <div className="flex h-9 w-9 bg-black items-center justify-center rounded-full text-sm font-bold text-white">
          A
        </div>
      </div>
    </nav>
  );
}
