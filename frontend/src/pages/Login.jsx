import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import loginAnimation from "../animations/loginAnimation";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      console.log("User login:", data.user);

      navigate("/home");
    } catch (error) {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleLogin} className="login-form space-y-5">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="login-button w-full rounded-xl bg-neutral-900 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
