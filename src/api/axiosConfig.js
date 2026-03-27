import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isAuthRoute =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error);

    // 🚨 SERVER DOWN / NETWORK ERROR
    if (!error.response) {
      console.error("SERVER DOWN OR NETWORK ISSUE");
      alert("Server is down or unreachable. Please try again later.");
      return Promise.reject(error);
    }

    // 🔐 TOKEN EXPIRED / UNAUTHORIZED
    if (error.response.status === 401) {
      console.warn("Unauthorized - Token expired or invalid");

      localStorage.removeItem("token");

      // redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;