import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import loginAnimation from "../animations/loginAnimation";

export default function Login() {
  const container = useRef(null);

  useGSAP(
    () => {
      loginAnimation(container.current);
    },
    { scope: container },
  );

  return (
    <main
      ref={container}
      className="min-h-screen bg-grey-300 flex items-center justify-center px-6"
    >
      <div className="login-card w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="login-title mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">
            Classroom Booking
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Login untuk melanjutkan
          </p>
        </div>

        <form className="login-form space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Masukkan email"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
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
              placeholder="Masukkan password"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            />
          </div>

          <button
            type="submit"
            className="login-button w-full rounded-xl bg-neutral-900 py-3 font-medium text-white"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
