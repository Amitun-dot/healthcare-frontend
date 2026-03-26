import { useState } from "react";
import { authApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await authApi.login(form);
      login(res.data);
      setMessage("Login successful");

      const userRole = res.data.role;

      if (userRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.22),_transparent_30%),linear-gradient(to_bottom_right,_#020617,_#0f172a,_#111827)]" />

      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-12 text-white">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Smart Healthcare Platform
            </div>

            <div className="mt-16 max-w-xl">
              <h1 className="text-5xl font-bold leading-tight">
                Modern healthcare workflow for appointments and digital prescriptions
              </h1>
              <p className="mt-6 text-lg text-slate-300 leading-8">
                Manage patient appointments, generate prescriptions, download PDFs,
                and deliver them by email through one clean system.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-2xl font-bold">24/7</p>
              <p className="mt-1 text-sm text-slate-300">Access anywhere</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-2xl font-bold">PDF</p>
              <p className="mt-1 text-sm text-slate-300">Prescription export</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-2xl font-bold">Email</p>
              <p className="mt-1 text-sm text-slate-300">Instant delivery</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/95 p-8 shadow-2xl shadow-blue-950/30 backdrop-blur-xl sm:p-10"
          >
            {/* LOGO + TITLE */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30">
                  <HeartPulse size={28} />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Login to access your healthcare dashboard
              </p>
            </div>

            {/* Alerts */}
            {message && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
              >
                Login
              </button>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 transition hover:text-cyan-600"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}