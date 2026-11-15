import Navbar from "../../../shared/layout/Navbar";
import { Link } from "react-router-dom";
import useHomePage from "../hooks/useHomePage";

export default function Home() {
  const { pageRef, user } = useHomePage();

  return (
    <main ref={pageRef} className="bg-white min-h-[100dvh] relative flex">
      <Navbar />
      <div className="flex min-h-[100dvh] w-full items-center justify-center px-4 pb-8 pt-20 md:pl-64 md:pt-8">
        <div className="w-full max-w-5xl py-10">
          <section
            data-motion="heading"
            className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
              SmartClass
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Halo{user?.nama ? `, ${user.nama}` : ""}
            </h1>
            <p className="mt-3 text-slate-600">
              Cari ruang kelas yang tersedia dan ajukan peminjaman sesuai
              jadwalmu.
            </p>
            <Link
              data-motion="button"
              to="/rooms"
              className="mt-6 inline-flex rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Cari ruangan
            </Link>
          </section>

          <section
            className="mt-6 grid gap-4 md:grid-cols-3"
            aria-label="Tips peminjaman"
          ></section>
        </div>
      </div>
    </main>
  );
}
