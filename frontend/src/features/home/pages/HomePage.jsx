import Navbar from "../../../shared/layout/Navbar";
import { Link } from "react-router-dom";
import useHomePage from "../hooks/useHomePage";

export default function Home() {
  const { pageRef, user } = useHomePage();

  return (
    <main ref={pageRef} className="app-background min-h-[100dvh] relative flex">
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
              className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Cari ruangan
            </Link>
          </section>

          <section
            className="mt-6 grid gap-4 md:grid-cols-3"
            aria-label="Tips peminjaman"
          >
            <article
              data-motion="card"
              className="rounded-2xl border border-white/70 bg-white/95 p-5 shadow-lg transition-shadow hover:shadow-xl"
            >
              <span className="text-2xl" aria-hidden="true">
                01
              </span>
              <h2 className="mt-3 font-semibold text-slate-900">
                Pilih jadwal
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Cari ruangan berdasarkan tanggal, waktu, kapasitas, dan lokasi.
              </p>
            </article>
            <article
              data-motion="card"
              className="rounded-2xl border border-white/70 bg-white/95 p-5 shadow-lg transition-shadow hover:shadow-xl"
            >
              <span className="text-2xl" aria-hidden="true">
                02
              </span>
              <h2 className="mt-3 font-semibold text-slate-900">
                Ajukan booking
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Tuliskan tujuan penggunaan ruang agar admin dapat meninjau
                permintaan.
              </p>
            </article>
            <article
              data-motion="card"
              className="rounded-2xl border border-white/70 bg-white/95 p-5 shadow-lg transition-shadow hover:shadow-xl"
            >
              <span className="text-2xl" aria-hidden="true">
                03
              </span>
              <h2 className="mt-3 font-semibold text-slate-900">
                Pantau status
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Buka riwayat booking untuk melihat persetujuan atau membatalkan
                permintaan.
              </p>
              <Link
                to="/riwayat"
                className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Lihat riwayat
              </Link>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}
