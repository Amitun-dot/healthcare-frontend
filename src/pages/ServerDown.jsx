import { useEffect } from "react";

export default function ServerDown() {
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch("http://localhost:8080", {
          method: "GET",
        });

        if (res) {
          window.location.href = "/";
        }
      } catch (error) {
        // server still unreachable, do nothing
      }
    };

    const interval = setInterval(checkServer, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="text-center space-y-5 px-6 max-w-md">
        <h1 className="text-4xl font-bold text-red-500">
          Server Unreachable 🚫
        </h1>

        <p className="text-gray-700">
          The server is currently unavailable. Please try again later.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
}