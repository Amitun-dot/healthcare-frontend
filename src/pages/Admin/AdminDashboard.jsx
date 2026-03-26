import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";
import {
  Stethoscope,
  Users,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserCog,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [doctorsRes, patientsRes, appointmentsRes, usersRes] =
        await Promise.all([
          api.get("/admin/doctors"),
          api.get("/admin/patients"),
          api.get("/admin/appointments"),
          api.get("/admin/users"),
        ]);

      setStats({
        doctors: Array.isArray(doctorsRes.data) ? doctorsRes.data.length : 0,
        patients: Array.isArray(patientsRes.data) ? patientsRes.data.length : 0,
        appointments: Array.isArray(appointmentsRes.data)
          ? appointmentsRes.data.length
          : 0,
        users: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
      });
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      setStats({
        doctors: 0,
        patients: 0,
        appointments: 0,
        users: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Doctors",
      value: stats.doctors,
      subtitle: "Registered doctor accounts",
      icon: <Stethoscope size={20} />,
      iconWrap:
        "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/20",
      cardBg:
        "bg-gradient-to-br from-slate-900/80 to-slate-800/70 border-white/10",
    },
    {
      title: "Total Patients",
      value: stats.patients,
      subtitle: "Active patient profiles",
      icon: <Users size={20} />,
      iconWrap:
        "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-400/20",
      cardBg:
        "bg-gradient-to-br from-slate-900/80 to-slate-800/70 border-white/10",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      subtitle: "Total appointment records",
      icon: <CalendarDays size={20} />,
      iconWrap:
        "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300 border border-violet-400/20",
      cardBg:
        "bg-gradient-to-br from-slate-900/80 to-slate-800/70 border-white/10",
    },
    {
      title: "System Users",
      value: stats.users,
      subtitle: "All registered accounts",
      icon: <UserCog size={20} />,
      iconWrap:
        "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/20",
      cardBg:
        "bg-gradient-to-br from-slate-900/80 to-slate-800/70 border-white/10",
    },
  ];

  const actions = [
    {
      title: "Manage Doctors",
      desc: "Create, view, and maintain doctor profiles.",
      to: "/admin/doctors",
      icon: <Stethoscope size={20} />,
      iconWrap:
        "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/20",
      arrow: "text-cyan-300",
      cardGlow: "hover:border-cyan-400/30",
    },
    {
      title: "Manage Patients",
      desc: "Access patient records and profile details.",
      to: "/admin/patients",
      icon: <Users size={20} />,
      iconWrap:
        "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-400/20",
      arrow: "text-emerald-300",
      cardGlow: "hover:border-emerald-400/30",
    },
    {
      title: "Manage Appointments",
      desc: "Track bookings and update appointment status.",
      to: "/admin/appointments",
      icon: <CalendarDays size={20} />,
      iconWrap:
        "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300 border border-violet-400/20",
      arrow: "text-violet-300",
      cardGlow: "hover:border-violet-400/30",
    },
    {
      title: "Manage Users",
      desc: "Control users, roles, and account access.",
      to: "/admin/users",
      icon: <ShieldCheck size={20} />,
      iconWrap:
        "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/20",
      arrow: "text-amber-300",
      cardGlow: "hover:border-amber-400/30",
    },
  ];

  return (
    <Layout>
      <div className="w-full space-y-5 sm:space-y-6 lg:space-y-8">
        {/* Hero */}
        <div className="relative w-full overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 p-4 text-white shadow-2xl sm:rounded-[26px] sm:p-5 md:p-6 lg:rounded-[30px] lg:p-8">
          <div className="absolute -top-10 right-0 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl sm:h-36 sm:w-36 lg:h-40 lg:w-40" />
          <div className="absolute -bottom-12 left-4 h-28 w-28 rounded-full bg-violet-500/15 blur-3xl sm:left-8 sm:h-36 sm:w-36 lg:h-40 lg:w-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_26%)]" />

          <div className="relative flex flex-col gap-5 lg:gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 w-full xl:max-w-2xl">
              <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/30 bg-gradient-to-r from-emerald-500/20 to-green-500/20 px-3 py-2 text-[11px] font-medium text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-500/10 sm:mb-4 sm:px-4 sm:text-xs">
                <Sparkles size={14} className="shrink-0" />
                <span className="truncate">Smart Healthcare Admin Panel</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Welcome back, Admin
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                Manage doctors, patients, appointments, and users from one clean
                and modern dashboard.
              </p>
            </div>

            <div className="w-full max-w-full">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:ml-auto xl:w-[320px]">
                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
                  <p className="text-xs text-white/80">Doctors</p>
                  <h3 className="mt-2 text-xl font-bold text-cyan-300 sm:text-2xl">
                    {loading ? "..." : stats.doctors}
                  </h3>
                </div>

                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
                  <p className="text-xs text-white/80">Patients</p>
                  <h3 className="mt-2 text-xl font-bold text-emerald-300 sm:text-2xl">
                    {loading ? "..." : stats.patients}
                  </h3>
                </div>

                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
                  <p className="text-xs text-white/80">Appointments</p>
                  <h3 className="mt-2 text-xl font-bold text-violet-200 sm:text-2xl">
                    {loading ? "..." : stats.appointments}
                  </h3>
                </div>

                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
                  <p className="text-xs text-white/80">Users</p>
                  <h3 className="mt-2 text-xl font-bold text-amber-300 sm:text-2xl">
                    {loading ? "..." : stats.users}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              className={`w-full min-w-0 rounded-[22px] border p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:rounded-[26px] sm:p-5 ${card.cardBg}`}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-400">
                    {card.title}
                  </p>
                  <h2 className="mt-3 break-words text-3xl font-bold text-white sm:text-4xl">
                    {loading ? "..." : card.value}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {card.subtitle}
                  </p>
                </div>

                <div className={`shrink-0 rounded-2xl p-3 ${card.iconWrap}`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-4 sm:space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Open the main admin sections quickly and keep everything organized.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {actions.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={`group w-full min-w-0 rounded-[22px] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/70 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:rounded-[26px] sm:p-5 ${item.cardGlow}`}
              >
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className={`inline-flex rounded-2xl p-3 ${item.iconWrap}`}>
                      {item.icon}
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${item.arrow}`}
                  >
                    Open Section
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}