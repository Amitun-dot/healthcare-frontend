import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";
import { Users, RefreshCw, UserRound, MapPin, Phone, Mail } from "lucide-react";

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/patients");
      setPatients(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-7 text-white shadow-2xl">
          <div className="absolute -top-10 right-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-lime-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-emerald-50 backdrop-blur">
                <Users size={14} />
                Patient Administration
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Patient Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-100 sm:text-base">
                View and manage all patient records in your healthcare system
                from one organized dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-emerald-100">
                Total Patients
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {loading ? "..." : patients.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* Table Section */}
        <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">All Patients</h2>
              <p className="text-sm text-slate-500">
                View all registered patients in the system
              </p>
            </div>

            <button
              onClick={fetchPatients}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <UserRound size={24} />
              </div>
              <p className="text-sm font-medium text-slate-700">
                No patients found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Patients will appear here once they are registered in the system.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-sm text-slate-600">
                      <th className="px-5 py-4 font-semibold">ID</th>
                      <th className="px-5 py-4 font-semibold">Name</th>
                      <th className="px-5 py-4 font-semibold">Email</th>
                      <th className="px-5 py-4 font-semibold">Phone</th>
                      <th className="px-5 py-4 font-semibold">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="border-t border-slate-100 text-sm transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-medium text-slate-700">
                          {patient.id}
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {patient.name || "-"}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div className="inline-flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" />
                            <span>{patient.email || "-"}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div className="inline-flex items-center gap-2">
                            <Phone size={14} className="text-slate-400" />
                            <span>{patient.phone || "-"}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div className="inline-flex items-center gap-2">
                            <MapPin size={14} className="text-slate-400" />
                            <span>{patient.address || "-"}</span>
                          </div>
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
    </Layout>
  );
}