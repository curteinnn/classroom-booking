import { useState } from "react";
import { activateAccount } from "../authApi";

export default function useAccountActivation(token) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(password, confirmation) {
    setError("");
    setMessage("");

    if (!token) {
      setError("Token aktivasi tidak ditemukan pada tautan.");
      return;
    }
    if (password !== confirmation) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    try {
      const data = await activateAccount({ token, password });
      setMessage(data.message || "Aktivasi berhasil.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return { error, message, loading, submit };
}
