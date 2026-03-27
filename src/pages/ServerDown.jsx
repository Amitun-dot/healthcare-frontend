import { useEffect, useState } from "react";

export default function ServerDown() {
  const [checking, setChecking] = useState(false);

  const checkServer = async () => {
    try {
      setChecking(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/public/health`
      );

      if (res.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      // server still unreachable
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkServer();
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
          onClick={checkServer}
          disabled={checking}
          className="rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-red-600 disabled:opacity-50"
        >
          {checking ? "Checking..." : "Retry"}
        </button>
      </div>
    </div>
  );
}