import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";
import {
  CalendarDays,
  RefreshCw,
  UserRound,
  Stethoscope,
  Clock3,
  CircleCheckBig,
  Ban,
  Trash2,
  AlertTriangle,
  FileText,
  CalendarClock,
} from "lucide-react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await api.get("/admin/appointments");
      setAppointments(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      setError("");
      setMessage("");

      await api.put(`/appointments/${appointmentId}/status`, { status });

      setMessage(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update appointment status"
      );
    }
  };

  const deleteAppointment = async () => {
    try {
      setError("");
      setMessage("");

      await api.delete(`/appointments/${selectedId}`);

      setMessage("Appointment deleted successfully");
      setShowDeleteModal(false);
      setSelectedId(null);
      fetchAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete appointment");
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedId(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "BOOKED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-7 text-white shadow-2xl">
          <div className="absolute -top-10 right-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-pink-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-violet-50 backdrop-blur">
                <CalendarDays size={14} />
                Appointment Administration
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Appointment Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-violet-100 sm:text-base">
                Monitor all appointments, update their status, and manage records
                from one clean and modern interface.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-violet-100">
                Total Appointments
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {loading ? "..." : appointments.length}
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
            {typeof error === "string" ? error : "Something went wrong"}
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                All Appointments
              </h2>
              <p className="text-sm text-slate-500">
                View and manage every appointment in the system
              </p>
            </div>

            <button
              onClick={fetchAppointments}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <CalendarDays size={24} />
              </div>
              <p className="text-sm font-medium text-slate-700">
                No appointments found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Appointment records will appear here when available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          Appointment ID: {appointment.id}
                        </span>

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status || "UNKNOWN"}
                        </span>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Patient
                          </p>
                          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                            <UserRound size={15} className="text-slate-500" />
                            {appointment.patientName || "-"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Doctor
                          </p>
                          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                            <Stethoscope size={15} className="text-slate-500" />
                            {appointment.doctorName || "-"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Date
                          </p>
                          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                            <CalendarClock size={15} className="text-slate-500" />
                            {appointment.appointmentDate || "-"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Time
                          </p>
                          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                            <Clock3 size={15} className="text-slate-500" />
                            {appointment.appointmentTime || "-"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 md:col-span-2 xl:col-span-2">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Reason
                          </p>
                          <div className="inline-flex items-start gap-2 text-sm font-medium text-slate-800">
                            <FileText size={15} className="mt-0.5 text-slate-500" />
                            <span>{appointment.reason || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 xl:w-[260px] xl:flex-col">
                      <button
                        onClick={() => updateStatus(appointment.id, "COMPLETED")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                      >
                        <CircleCheckBig size={16} />
                        Complete
                      </button>

                      <button
                        onClick={() => updateStatus(appointment.id, "CANCELLED")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600"
                      >
                        <Ban size={16} />
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          setSelectedId(appointment.id);
                          setShowDeleteModal(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Delete Appointment
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete this appointment? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={deleteAppointment}
                className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}