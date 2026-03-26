import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";
import {
  Stethoscope,
  PlusCircle,
  RefreshCw,
  UserRound,
  Mail,
  Lock,
} from "lucide-react";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    phone: "",
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await api.get("/admin/doctors");
      setDoctors(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await api.post("/admin/doctors", {
        name: form.name,
        email: form.email,
        password: form.password,
        specialization: form.specialization,
        experienceYears: Number(form.experience),
        phone: form.phone,
      });

      setMessage("Doctor added successfully");
      setForm({
        name: "",
        email: "",
        password: "",
        specialization: "",
        experience: "",
        phone: "",
      });

      fetchDoctors();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add doctor");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  return (
    <Layout>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-7 text-white shadow-2xl">
          <div className="absolute -top-10 right-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-blue-50 backdrop-blur">
                <Stethoscope size={14} />
                Doctor Administration
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Doctor Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
                Add new doctors, manage their profiles, and keep your healthcare
                system organized from one clean interface.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-blue-100">
                Total Doctors
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {loading ? "..." : doctors.length}
              </h2>
            </div>
          </div>
        </div>

        {message && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                  <PlusCircle size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Add Doctor
                  </h2>
                  <p className="text-sm text-slate-500">
                    Create a new doctor profile
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddDoctor} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter doctor name"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Lock size={16} />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    placeholder="Enter specialization"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Enter experience in years"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={inputClass}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Add Doctor"}
                </button>
              </form>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-xl">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    All Doctors
                  </h2>
                  <p className="text-sm text-slate-500">
                    View all registered doctors in the system
                  </p>
                </div>

                <button
                  onClick={fetchDoctors}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Loading doctors...
                </div>
              ) : doctors.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <UserRound size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    No doctors found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Add your first doctor using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-slate-50">
                        <tr className="text-left text-sm text-slate-600">
                          <th className="px-5 py-4 font-semibold">Name</th>
                          <th className="px-5 py-4 font-semibold">
                            Specialization
                          </th>
                          <th className="px-5 py-4 font-semibold">
                            Experience
                          </th>
                          <th className="px-5 py-4 font-semibold">Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.map((doctor) => (
                          <tr
                            key={doctor.id}
                            className="border-t border-slate-100 text-sm transition hover:bg-slate-50"
                          >
                            <td className="px-5 py-4 font-semibold text-slate-800">
                              {doctor.name}
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                {doctor.specialization}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              {doctor.experienceYears
                                ? `${doctor.experienceYears} Years`
                                : "-"}
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              {doctor.phone}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}