import { apiRequest } from "../../shared/api/httpClient";

export function login(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser() {
  return apiRequest("/api/auth/me");
}

export function activateAccount(payload) {
  return apiRequest("/api/activation/complete", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
