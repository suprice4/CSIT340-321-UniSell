export function saveSession(session) {
  localStorage.setItem("authToken",    session.token);
  localStorage.setItem("isLoggedIn",   "true");
  localStorage.setItem("loggedInUser", JSON.stringify({
    id:       session.id,
    email:    session.email,
    username: session.username,
    role:     session.role,
  }));
}

export function clearSession() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUser");
}

export function getSession() {
  const raw = localStorage.getItem("loggedInUser");
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn() {
  return !!localStorage.getItem("authToken");
}


export function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type":  "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}