import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ ADD THIS (server down detection)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚨 if no response → server is down / network error
    if (!error.response) {
      console.error("SERVER DOWN:", error);
      window.location.href = "/server-down";
    }

    return Promise.reject(error);
  }
);

export default api;