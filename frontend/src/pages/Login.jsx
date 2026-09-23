import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import background from "../assets/background.JPEG";
import objek1 from "../assets/object1.png";
import unindra from "../assets/unindra.png";

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
      gsap.to(".login-card", {
        opacity: 0,
        duration: 1.5,
        ease: "power3.in",
        onComplete: () => {
          navigate("/home");
        },
      });
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
            <span className="text-blue-950">Smart</span>
            <span className="text-blue-900">class</span>
          </h1>

          <p className="mt-2 text-sm text-center text-neutral-500 md:text-left">
            Login untuk melanjutkan
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="login-form w-60 space-y-5 md:w-80"
        >
          <div className="">
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
            className="login-button w-full rounded-xl bg-blue-600 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
