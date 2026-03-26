import { useState } from "react";
import { authApi } from "../api/endpoints";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "PATIENT",
    patientPhone: "",
    address: "",
    gender: "",
    age: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const cleanedValue = value.replace(/[^A-Za-z\s]/g, "");
      setForm((prev) => ({
        ...prev,
        name: cleanedValue,
      }));
      return;
    }

    if (name === "patientPhone") {
      const cleanedValue = value.replace(/[^0-9]/g, "");
      setForm((prev) => ({
        ...prev,
        patientPhone: cleanedValue,
      }));
      return;
    }

    if (name === "age") {
      const cleanedValue = value.replace(/[^0-9]/g, "");
      setForm((prev) => ({
        ...prev,
        age: cleanedValue === "" ? "" : Number(cleanedValue),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        age: Number(form.age),
      };

      console.log("REGISTER PAYLOAD:", payload);

      const res = await authApi.register(payload);
      setMessage(res?.data?.message || "Registration successful");
      navigate("/");
    } catch (err) {
      console.error("REGISTER STATUS:", err?.response?.status);
      console.error("REGISTER DATA:", err?.response?.data);
      console.error("FULL REGISTER ERROR:", err);
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.22),_transparent_30%),linear-gradient(to_bottom_right,_#020617,_#0f172a,_#111827)]" />

      <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col gap-45 p-12 text-white">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              New Patient Registration
            </div>

            <div className="mt-10 max-w-xl">
              <h1 className="text-5xl font-bold leading-tight">
                Create your healthcare account in a secure and modern system
              </h1>
              <p className="mt-6 text-lg text-slate-300 leading-8">
                Register as a patient to manage your profile, book appointments,
                track consultations, and receive prescription PDFs directly by email.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-2xl font-bold">Secure</p>
              <p className="mt-1 text-sm text-slate-300">JWT protected access</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-2xl font-bold">Easy</p>
              <p className="mt-1 text-sm text-slate-300">Fast appointment booking</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-2xl font-bold">Digital</p>
              <p className="mt-1 text-sm text-slate-300">Prescription by PDF & email</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl sm:p-7"
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <HeartPulse size={26} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Patient Registration
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Fill in your details to create your account
              </p>
            </div>

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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  pattern="[A-Za-z\s]+"
                  title="Only letters and spaces allowed"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="patientPhone"
                  placeholder="Enter your phone number"
                  inputMode="numeric"
                  pattern="[0-9]+"
                  maxLength={10}
                  title="Only numbers allowed"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={form.patientPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <select
                  name="gender"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  min="0"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:from-emerald-600 hover:to-cyan-600"
            >
              Register
            </button>

            <p className="mt-5 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-blue-600 transition hover:text-cyan-600"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}