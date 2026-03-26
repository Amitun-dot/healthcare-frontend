import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  Download,
  UserRound,
  CalendarDays,
  Clock3,
  ClipboardList,
  Pill,
  NotebookPen,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function MyPrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (user?.patientId) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/prescriptions/patient/${user.patientId}`);
      setPrescriptions(response.data || []);
    } catch (err) {
      setError("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (prescriptionId) => {
    try {
      setDownloadingId(prescriptionId);
      setError("");

      const response = await api.get(`/prescriptions/${prescriptionId}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `prescription_${prescriptionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download prescription PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-6 md:p-8 shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md border border-white/20 shadow-lg">
                <FileText size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  My Prescriptions
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-blue-100 md:text-base">
                  View all prescriptions issued for your appointments in a clean,
                  modern, and easy-to-read format.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:min-w-[280px]">
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  Total Prescriptions
                </p>
                <p className="mt-1 text-2xl font-bold">{prescriptions.length}</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  Patient ID
                </p>
                <p className="mt-1 text-2xl font-bold">{user?.patientId || "--"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 text-red-600" size={18} />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="h-8 w-56 animate-pulse rounded-xl bg-slate-200" />
                  <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
                  <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
                  <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <ClipboardList size={28} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-800">
              No prescriptions found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Your prescriptions will appear here once your doctor creates them.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((item) => (
              <div
                key={item.id}
                className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8"
              >
                {/* Top */}
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900">
                        Prescription #{item.id}
                      </h2>

                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 size={16} />
                        Prescribed
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Your doctor has issued this prescription for your appointment.
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(item.id)}
                    disabled={downloadingId === item.id}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Download size={17} />
                    {downloadingId === item.id ? "Downloading..." : "Download PDF"}
                  </button>
                </div>

                {/* Info Cards */}
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                        <UserRound size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Doctor
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {item.doctorName || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                        <ClipboardList size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Appointment ID
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {item.appointmentId || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-cyan-100 p-2 text-cyan-700">
                        <CalendarDays size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {item.appointmentDate || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
                        <Clock3 size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Time / Status
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {item.appointmentTime || "N/A"}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {item.status || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                        <ClipboardList size={18} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Diagnosis
                      </h3>
                    </div>
                    <p className="text-[15px] leading-7 text-slate-700">
                      {item.diagnosis || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                        <Pill size={18} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Medicines
                      </h3>
                    </div>
                    <p className="whitespace-pre-line text-[15px] leading-7 text-slate-700">
                      {item.medicines || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
                        <NotebookPen size={18} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Notes</h3>
                    </div>
                    <p className="whitespace-pre-line text-[15px] leading-7 text-slate-700">
                      {item.notes || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}