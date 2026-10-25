import background from "../../../assets/background.JPEG";
import objek1 from "../../../assets/object1.png";
import unindra from "../../../assets/unindra.png";
import useLoginPage from "../hooks/useLoginPage";

export default function Login() {
  const view = useLoginPage();

  return (
    <>
      <main
        ref={view.containerRef}
        className="min-h-screen flex items-center justify-center px-6 bg-cover"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="login-card relative w-80 rounded-2xl bg-white p-8 m-10 shadow-2xl md:w-150">
          <img
            src={objek1}
            alt=""
            className="hidden lg:block absolute -right-40 top-25 w-100 z-10 md:block md:-right-30 "
          />

          <img
            src={unindra}
            alt=""
            className="hidden lg:block absolute right-6 -top-1 w-40 z-10 md:block "
          />

          <div className="login-title mb-8 text-left">
            <h1 className="text-3xl text-center font-bold text-black md:text-left">
              Welcome to <br />
              <span className="smart-class relative inline-block overflow-hidden">
                <span className="text-blue-950">Smart</span>
                <span className="text-blue-900">class</span>

                <span className="smart-shine pointer-events-none absolute -top-1/2 left-full h-[200%] w-8 rotate-[20deg] bg-gradient-to-b from-transparent via-white/80 to-transparent blur-sm" />
              </span>
            </h1>

            <p className="mt-2 text-sm text-center text-neutral-500 md:text-left">
              Login untuk melanjutkan
            </p>
          </div>

          <form
            onSubmit={view.handleSubmit}
            className="login-form w-60 space-y-5 md:w-80"
          >
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Email atau identifier
              </label>

              <input
                id="identifier"
                type="text"
                autoComplete="username"
                value={view.identifier}
                onChange={view.handleIdentifierChange}
                placeholder="Masukkan email atau identifier"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={view.password}
                onChange={view.handlePasswordChange}
                placeholder="Masukkan password"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
                required
              />
            </div>

            {view.error && <p className="text-sm text-red-500">{view.error}</p>}

            <button
              type="submit"
              disabled={view.loading || view.isTransitioning}
              className="login-button w-full rounded-xl bg-blue-600 py-3 font-medium text-white disabled:opacity-50"
            >
              {view.loading ? "Memeriksa akun..." : view.isTransitioning ? "Membuka dashboard..." : "Login"}
            </button>
          </form>
        </div>
      </main>
      <div
        ref={view.transitionRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-950"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />
    </>
  );
}
