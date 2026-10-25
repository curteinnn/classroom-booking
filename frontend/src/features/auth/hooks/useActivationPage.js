import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAccountActivation from "./useAccountActivation";

export default function useActivationPage() {
  const [searchParams] = useSearchParams();
  const { error, message, loading, submit } = useAccountActivation(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await submit(password, confirmation);
  }
  function handlePasswordChange(event) { setPassword(event.target.value); }
  function handleConfirmationChange(event) { setConfirmation(event.target.value); }

  return { error, message, loading, password, confirmation, handleSubmit, handlePasswordChange, handleConfirmationChange };
}
