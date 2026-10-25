const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000")
  .replace(/\/+$/, "");

const TOKEN_KEY = "smartclass.token";
const USER_KEY = "smartclass.user";

export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    clearSession();
  }

  return token ? { token, user } : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function apiRequest(path, options = {}) {
  const session = getSession();
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) clearSession();
    throw new Error(data.message || "Permintaan gagal diproses.");
  }

  return data;
}
