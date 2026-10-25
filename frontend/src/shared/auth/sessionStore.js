const TOKEN_KEY = "smartclass.token";
const USER_KEY = "smartclass.user";

export function saveSession({ token, user }) {
  if (!token || !user) throw new Error("Respons login tidak lengkap.");
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    return { token, user };
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
