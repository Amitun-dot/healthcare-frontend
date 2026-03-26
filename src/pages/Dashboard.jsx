import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  FileText,
  User,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { doctorApi } from "../api/endpoints";

export default function Dashboard() {
  const { user, role, setDoctorId } = useAuth();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        if (role === "DOCTOR" && user?.userId && !user?.doctorId) {
          const res = await doctorApi.getProfileByUserId(user.userId);
          if (res.data?.id) {
            setDoctorId(res.data.id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch doctor profile", err);
      }
    };

    fetchDoctorProfile();
  }, [role, user?.userId, user?.doctorId, setDoctorId]);

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* 🔥 HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/100">
                Healthcare Dashboard
              </p>

              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Welcome back, {user?.name}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/100 sm:text-base">
                Manage appointments, prescriptions, and patient workflow through a
                clean digital healthcare system.
              </p>
            </div>

            {/* 🔥 SMALL STATS */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-white-400">Role</p>
                <p className="mt-2 text-lg font-bold text-white">{role}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-white/100">User ID</p>
                <p className="mt-2 text-lg font-bold text-white">{user?.userId}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-white/100">Access</p>
                <p className="mt-2 text-lg font-bold text-emerald-300">Secure</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-white/100">Status</p>
                <p className="mt-2 text-lg font-bold text-cyan-400">Active</p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 MAIN CARDS */}
        <section className="grid gap-6 lg:grid-cols-3">
          
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/70 to-slate-900/90 p-6 shadow-xl backdrop-blur-xl lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Account Overview</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Your authenticated information inside the system
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-cyan-300 backdrop-blur-md">
                Verified Session
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {["Full Name", "Email", "Role", "User ID"].map((label, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                >
                  <p className="text-xs text-white/60">{label}</p>
                  <p className="mt-2 text-lg text-white">
                    {i === 0
                      ? user?.name
                      : i === 1
                      ? user?.email
                      : i === 2
                      ? role
                      : user?.userId}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/70 to-slate-900/90 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white">Quick Insight</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Use this dashboard to manage your healthcare workflow efficiently.
              Access appointments, prescriptions, and profile features in a clean and
              organized way.
            </p>
          </div>
        </section>

        {/* 🔥 ACTION CARDS */}
        {role === "PATIENT" && (
          <section className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white">Patient Actions</h3>
              <p className="text-sm text-slate-300">
                Access your profile, browse doctors, and manage appointments smoothly
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

              <Link to="/patients/profile" className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 transition">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
                  <User size={22} />
                </div>
                <h4 className="text-xl font-semibold text-white">My Profile</h4>
                <p className="mt-2 text-sm text-slate-300">View your personal details</p>
              </Link>

              <Link to="/doctors" className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 transition">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
                  <Stethoscope size={22} />
                </div>
                <h4 className="text-xl font-semibold text-white">Doctors</h4>
                <p className="mt-2 text-sm text-slate-300">Browse doctors</p>
              </Link>

              <Link to="/appointments" className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 transition">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                  <ClipboardList size={22} />
                </div>
                <h4 className="text-xl font-semibold text-white">Appointments</h4>
                <p className="mt-2 text-sm text-slate-300">Track your bookings</p>
              </Link>

            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}