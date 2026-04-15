import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const isAuthRoute = (url = "") =>
  url.includes("/auth/login") || url.includes("/auth/register");

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && !isAuthRoute(config.url)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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

    const status = error.response.status;
    const message = error.response?.data?.message;

    // 🔐 TOKEN EXPIRED / UNAUTHORIZED
    if (status === 401) {
      console.warn("Unauthorized - Token expired or invalid");

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      toast.error("Session expired. Please login again.");
      window.location.href = "/";

      return Promise.reject(error);
    }

    // ❌ OTHER ERRORS (400, 403, 404, 500 etc.)
    toast.error(message || "Something went wrong. Please try again.");

    return Promise.reject(error);
  }
);

export default api;