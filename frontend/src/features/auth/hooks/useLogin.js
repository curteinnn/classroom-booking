import { useState } from "react";
import { login } from "../authApi";
import { saveSession } from "../../../shared/auth/sessionStore";

export default function useLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(credentials) {
    setError("");
    setLoading(true);
    try {
      const data = await login(credentials);
      saveSession(data);
      return data;
    } catch (requestError) {
      setError(requestError.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { error, loading, submit };
}
