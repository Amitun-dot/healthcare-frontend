import toast from "react-hot-toast";

// success
export const showSuccess = (msg) =>
  toast.success(msg, {
    iconTheme: {
      primary: "#22c55e",
      secondary: "#ffffff",
    },
  });

// error
export const showError = (msg) =>
  toast.error(msg, {
    iconTheme: {
      primary: "#ef4444",
      secondary: "#ffffff",
    },
  });

// loading
export const showLoading = (msg) => toast.loading(msg);