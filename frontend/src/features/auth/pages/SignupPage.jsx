import unindra from "../../../assets/unindra.png";

export default function SignupPage({ view, isActive }) {
  return (
    <section
      className="auth-face auth-face--back rounded-2xl bg-white p-8 shadow-2xl"
      aria-hidden={!isActive}
      inert={!isActive}
    >
      <img
        src={unindra}
        alt=""
        className="hidden lg:block absolute right-6 -top-1 w-40 z-10 md:block"
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
      </div>

      <form
        onSubmit={view.handleSignupSubmit}
        className="login-form w-full max-w-60 space-y-5 md:max-w-80"
      >
        <div>
          <label
            htmlFor="signup-identifier"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Identifier
          </label>
          <input
            id="signup-identifier"
            data-field="identifier"
            value={view.signupForm.identifier}
            onChange={view.handleSignupFieldChange}
            autoComplete="username"
            placeholder="Masukkan identifier"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Password
          </label>
          <input
            id="signup-password"
            data-field="password"
            type="password"
            value={view.signupForm.password}
            onChange={view.handleSignupFieldChange}
            autoComplete="new-password"
            placeholder="Masukkan password"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            required
          />
        </div>

        {view.signupError && (
          <p role="alert" className="text-sm text-red-500">
            {view.signupError}
          </p>
        )}
        {view.signupNotice && (
          <p role="status" className="text-sm text-neutral-600">
            {view.signupNotice}
          </p>
        )}

        <button
          type="submit"
          disabled={view.isFlipping}
          className="login-button w-full rounded-xl bg-blue-600 py-3 font-medium text-white disabled:opacity-50"
        >
          Signup
        </button>
        <button
          type="button"
          onClick={view.showLogin}
          disabled={view.isFlipping}
          className="block w-full text-sm text-center text-neutral-500 disabled:opacity-50 md:text-left"
        >
          sudah punya akun?
          <span className="text-blue-800 font-bold"> Login</span>
        </button>
      </form>
    </section>
  );
}
