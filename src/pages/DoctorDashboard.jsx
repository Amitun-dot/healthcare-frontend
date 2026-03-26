import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/appointments");
      setAppointments(response.data || []);
    } catch (err) {
      setError("Failed to load doctor dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const doctorAppointments = useMemo(() => {
    if (!user?.id) return appointments;
    return appointments.filter(
      (appt) =>
        String(appt.doctorId) === String(user.id) ||
        String(appt.doctorUserId) === String(user.id)
    );
  }, [appointments, user]);

  const total = doctorAppointments.length;
  const pending = doctorAppointments.filter((a) => a.status === "PENDING").length;
  const completed = doctorAppointments.filter((a) => a.status === "COMPLETED").length;
  const cancelled = doctorAppointments.filter((a) => a.status === "CANCELLED").length;

  return (
    <Layout>
      <div className="space-y-8">

        {/* HEADER */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white">
            Doctor Dashboard
          </h1>
          <p className="text-slate-300 mt-2">
            Welcome, {user?.name || "Doctor"}
          </p>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl bg-white/10 p-6 text-slate-300 backdrop-blur-xl">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* STATS */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 backdrop-blur-xl">
                <p className="text-sm text-slate-400">Total</p>
                <h2 className="text-3xl font-bold text-white mt-2">{total}</h2>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 backdrop-blur-xl">
                <p className="text-sm text-slate-400">Pending</p>
                <h2 className="text-3xl font-bold text-yellow-400 mt-2">{pending}</h2>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 backdrop-blur-xl">
                <p className="text-sm text-slate-400">Completed</p>
                <h2 className="text-3xl font-bold text-emerald-400 mt-2">{completed}</h2>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 backdrop-blur-xl">
                <p className="text-sm text-slate-400">Cancelled</p>
                <h2 className="text-3xl font-bold text-red-400 mt-2">{cancelled}</h2>
              </div>
            </div>

            {/* ACTION CARDS */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                to="/appointments"
                className="group rounded-3xl bg-white/10 p-6 border border-white/10 backdrop-blur-xl hover:bg-white/15 transition"
              >
                <h3 className="text-xl font-semibold text-white">
                  Manage Appointments
                </h3>
                <p className="text-slate-300 mt-2">
                  View and manage all appointment requests.
                </p>
                <span className="mt-4 inline-block text-cyan-300 group-hover:text-cyan-200">
                  Open →
                </span>
              </Link>

              <Link
                to="/prescriptions"
                className="group rounded-3xl bg-white/10 p-6 border border-white/10 backdrop-blur-xl hover:bg-white/15 transition"
              >
                <h3 className="text-xl font-semibold text-white">
                  Create Prescription
                </h3>
                <p className="text-slate-300 mt-2">
                  Issue prescriptions for completed consultations.
                </p>
                <span className="mt-4 inline-block text-emerald-300 group-hover:text-emerald-200">
                  Open →
                </span>
              </Link>
            </div>

            {/* TABLE */}
            <div className="rounded-3xl bg-white/10 p-6 border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white mb-4">
                Recent Appointments
              </h3>

              {doctorAppointments.length === 0 ? (
                <p className="text-slate-300">No appointments found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-slate-400 border-b border-white/10">
                        <th className="py-3">ID</th>
                        <th className="py-3">Patient</th>
                        <th className="py-3">Date</th>
                        <th className="py-3">Time</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {doctorAppointments.slice(0, 5).map((appt) => (
                        <tr key={appt.id} className="border-b border-white/5">
                          <td className="py-3 text-white">{appt.id}</td>
                          <td className="py-3 text-white">
                            {appt.patientName || `Patient ${appt.patientId}`}
                          </td>
                          <td className="py-3 text-white">{appt.appointmentDate}</td>
                          <td className="py-3 text-white">{appt.appointmentTime}</td>
                          <td className="py-3">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200">
                              {appt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}