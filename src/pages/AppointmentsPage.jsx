import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { patientApi, doctorApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export default function AppointmentsPage() {
  const { user, role } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [role, user?.patientId, user?.doctorId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (role === "PATIENT") {
        if (!user?.patientId) {
          setError("Patient profile not found. Please complete your profile first.");
          setAppointments([]);
          return;
        }

        const res = await patientApi.getAppointments(user.patientId);
        setAppointments(res.data || []);
        return;
      }

      if (role === "DOCTOR") {
        if (!user?.doctorId) {
          setError("Doctor profile not found. Please login again.");
          setAppointments([]);
          return;
        }

        const res = await doctorApi.getAppointments(user.doctorId);
        setAppointments(res.data || []);
        return;
      }

      setAppointments([]);
    } catch (err) {
      console.error("Fetch appointments error:", err);
      setError(err?.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setError("");
      setMessage("");

      await patientApi.cancelAppointment(appointmentId);

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId
            ? { ...appt, status: "CANCELLED" }
            : appt
        )
      );

      setMessage("Appointment cancelled successfully");
    } catch (err) {
      console.error("Cancel appointment error:", err);
      setError(err?.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const handleDoctorStatusUpdate = async (appointmentId, status) => {
    try {
      setError("");
      setMessage("");

      await doctorApi.updateAppointmentStatus(appointmentId, { status });

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status } : appt
        )
      );

      setMessage(`Appointment marked as ${status}`);
    } catch (err) {
      console.error("Update status error:", err);
      setError(
        err?.response?.data?.message || "Failed to update appointment status"
      );
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "COMPLETED":
        return "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
      case "CANCELLED":
        return "border border-red-400/20 bg-red-500/10 text-red-300";
      case "PENDING":
        return "border border-amber-400/20 bg-amber-500/10 text-amber-300";
      case "CONFIRMED":
        return "border border-blue-400/20 bg-blue-500/10 text-blue-300";
      default:
        return "border border-slate-500/20 bg-slate-500/10 text-slate-300";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 p-6 shadow-2xl backdrop-blur-xl">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-800/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Appointment Center
              </p>
              <h1 className="text-3xl font-bold text-white">
                {role === "DOCTOR" ? "Doctor Appointments" : "My Appointments"}
              </h1>
              <p className="mt-2 text-sm leading-6 text-white-500">
                {role === "DOCTOR"
                  ? "Review patient appointments, symptoms, and update consultation status."
                  : "View your appointment history and shared symptoms."}
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-white-500">
                  Total
                </p>
                <p className="mt-1 text-xl font-bold text-white">
                  {appointments.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-white-500">
                  Role
                </p>
                <p className="mt-1 text-xl font-bold text-cyan-300">{role}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts */}
        {message && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-xl backdrop-blur-xl">
            <p className="text-base font-medium text-slate-200">
              Loading appointments...
            </p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-xl backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white">
              No appointments found
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Appointments will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
                  {/* Left section */}
                  <div>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          Appointment #{appt.id}
                        </h2>
                        <p className="text-sm text-slate-400">
                          Consultation details
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClasses(
                          appt.status
                        )}`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Doctor
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {appt.doctorName}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Patient
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {appt.patientName}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Date
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {appt.appointmentDate}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Time
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {appt.appointmentTime}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Status
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {appt.status}
                        </p>
                      </div>

                      {appt.specialization && (
                        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:col-span-2 lg:col-span-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Specialization
                          </p>
                          <p className="mt-2 text-sm font-medium text-white">
                            {appt.specialization}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-cyan-400/10 bg-cyan-500/5 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                        Symptoms / Reason for Visit
                      </p>

                      <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm leading-6 text-slate-200 shadow-sm">
                        {appt.reason?.trim()
                          ? appt.reason
                          : "No symptoms provided by patient"}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {role === "PATIENT" && appt.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancelAppointment(appt.id)}
                          className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:opacity-95"
                        >
                          Cancel Appointment
                        </button>
                      )}

                      {role === "DOCTOR" && appt.status !== "CANCELLED" && (
                        <>
                          {appt.status !== "COMPLETED" && (
                            <button
                              onClick={() =>
                                handleDoctorStatusUpdate(appt.id, "COMPLETED")
                              }
                              className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:opacity-95"
                            >
                              Mark Completed
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleDoctorStatusUpdate(appt.id, "CANCELLED")
                            }
                            className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:opacity-95"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
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