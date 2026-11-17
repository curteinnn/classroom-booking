import { useEffect, useState } from "react";
import { login } from "../authApi";
import { saveSession } from "../../../shared/auth/sessionStore";

export default function useLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error) return undefined;
    const timeoutId = window.setTimeout(() => setError(""), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [error]);

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
