import axios from "axios";
import toast from "react-hot-toast";

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

      toast.error("Server unreachable. Please try again.");

      return Promise.reject(error);
    }

    // 🔐 TOKEN EXPIRED / UNAUTHORIZED
    if (error.response.status === 401) {
      console.warn("Unauthorized - Token expired or invalid");

      localStorage.removeItem("token");

      toast.error("Session expired. Please login again.");

      window.location.href = "/";
    }

    // ❌ OTHER ERRORS (400, 403, 500 etc.)
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default api;