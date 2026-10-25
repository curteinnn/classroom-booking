import background from "../../../assets/background.JPEG";
import Navbar from "../../../shared/layout/Navbar";
import { Link } from "react-router-dom";
import { getSession } from "../../../shared/auth/sessionStore";

export default function Home() {
  const user = getSession()?.user;

  return (
    <main
      className="min-h-screen relative flex bg-cover"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Navbar />
      <div className="flex min-h-screen w-full items-center justify-center bg-blue-100/80 px-6 pt-16">
        <section className="max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">SmartClass</p>
          <h1 className="text-3xl font-bold text-slate-900">Halo{user?.nama ? `, ${user.nama}` : ""}</h1>
          <p className="mt-3 text-slate-600">Cari ruang kelas yang tersedia dan ajukan peminjaman sesuai jadwalmu.</p>
          <Link to="/rooms" className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
            Cari ruangan
          </Link>
        </section>
      </div>
    </main>
  );
}
