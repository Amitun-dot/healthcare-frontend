import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HeartPulse,
  LayoutDashboard,
  UserRound,
  Stethoscope,
  CalendarCheck2,
  FileText,
  LogOut,
  Users,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) =>
    `group relative inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
      isActive(path)
        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-[0_8px_24px_rgba(59,130,246,0.12)] ring-1 ring-blue-100"
        : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      isActive(path)
        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 ring-1 ring-blue-100"
        : "text-gray-700 hover:bg-gray-50"
    }`;

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex min-h-[64px] max-w-[1450px] items-center justify-between gap-3 px-3 py-2 sm:min-h-[72px] sm:px-6 sm:py-3 lg:min-h-[84px]">
        {/* LEFT */}
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 text-white shadow-[0_10px_30px_rgba(59,130,246,0.30)] sm:h-12 sm:w-12">
            <div className="absolute inset-0 rounded-2xl bg-white/10" />
            <HeartPulse size={18} className="relative z-10 sm:hidden" />
            <HeartPulse size={22} className="relative z-10 hidden sm:block" />
          </div>

          <div className="min-w-0 leading-tight max-w-[180px] sm:max-w-none">
            <h1 className="truncate bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-[15px] font-extrabold tracking-tight text-transparent sm:text-lg lg:text-xl">
              Healthcare System 🩺
            </h1>

            <p className="hidden whitespace-nowrap text-xs font-semibold tracking-wide text-gray-800 sm:block">
              Appointment & Prescription Portal
            </p>
          </div>
        </div>

        {/* CENTER LINKS (DESKTOP) */}
        <div className="hidden flex-1 items-center justify-center px-4 lg:flex">
          <div className="flex items-center gap-2 overflow-x-auto rounded-[1.4rem] border border-gray-200/80 bg-white/70 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl">
            {role === "ADMIN" && (
              <>
                <Link to="/admin/dashboard" className={navLinkClass("/admin/dashboard")}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <Link to="/admin/doctors" className={navLinkClass("/admin/doctors")}>
                  <Stethoscope size={16} />
                  Doctors
                </Link>

                <Link to="/admin/patients" className={navLinkClass("/admin/patients")}>
                  <UserRound size={16} />
                  Patients
                </Link>

                <Link to="/admin/appointments" className={navLinkClass("/admin/appointments")}>
                  <CalendarCheck2 size={16} />
                  Appointments
                </Link>

                <Link to="/admin/users" className={navLinkClass("/admin/users")}>
                  <Users size={16} />
                  Users
                </Link>
              </>
            )}

            {role === "PATIENT" && (
              <>
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <Link to="/patients/profile" className={navLinkClass("/patients/profile")}>
                  <UserRound size={16} />
                  Profile
                </Link>

                <Link to="/doctors" className={navLinkClass("/doctors")}>
                  <Stethoscope size={16} />
                  Doctors
                </Link>

                <Link to="/appointments" className={navLinkClass("/appointments")}>
                  <CalendarCheck2 size={16} />
                  Appointments
                </Link>

                <Link to="/my-prescriptions" className={navLinkClass("/my-prescriptions")}>
                  <FileText size={16} />
                  Prescriptions
                </Link>
              </>
            )}

            {role === "DOCTOR" && (
              <>
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <Link to="/appointments" className={navLinkClass("/appointments")}>
                  <CalendarCheck2 size={16} />
                  Appointments
                </Link>

                <Link to="/prescriptions" className={navLinkClass("/prescriptions")}>
                  <FileText size={16} />
                  Prescriptions
                </Link>
              </>
            )}
          </div>
        </div>

        {/* RIGHT (DESKTOP) */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <div className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm sm:h-9 sm:w-9">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs font-medium text-gray-500">{role}</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.55)]" />
            Online
          </span>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(239,68,68,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:from-red-600 hover:to-rose-600 hover:shadow-[0_14px_28px_rgba(239,68,68,0.30)]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 lg:hidden sm:h-11 sm:w-11"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white/95 px-3 pb-4 pt-3 backdrop-blur-xl lg:hidden">
          <div className="mb-3 flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white/70 px-3 py-3 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs font-medium text-gray-500">{role}</p>
            </div>

            <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>

          <div className="space-y-2 rounded-2xl border border-gray-200/80 bg-white/80 p-2 shadow-sm">
            {role === "ADMIN" && (
              <>
                <Link to="/admin/dashboard" className={mobileLinkClass("/admin/dashboard")} onClick={closeMobileMenu}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <Link to="/admin/doctors" className={mobileLinkClass("/admin/doctors")} onClick={closeMobileMenu}>
                  <Stethoscope size={16} />
                  Doctors
                </Link>

                <Link to="/admin/patients" className={mobileLinkClass("/admin/patients")} onClick={closeMobileMenu}>
                  <UserRound size={16} />
                  Patients
                </Link>

                <Link to="/admin/appointments" className={mobileLinkClass("/admin/appointments")} onClick={closeMobileMenu}>
                  <CalendarCheck2 size={16} />
                  Appointments
                </Link>

                <Link to="/admin/users" className={mobileLinkClass("/admin/users")} onClick={closeMobileMenu}>
                  <Users size={16} />
                  Users
                </Link>
              </>
            )}

            {role === "PATIENT" && (
              <>
                <Link to="/dashboard" className={mobileLinkClass("/dashboard")} onClick={closeMobileMenu}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <Link to="/patients/profile" className={mobileLinkClass("/patients/profile")} onClick={closeMobileMenu}>
                  <UserRound size={16} />
                  Profile
                </Link>

                <Link to="/doctors" className={mobileLinkClass("/doctors")} onClick={closeMobileMenu}>
                  <Stethoscope size={16} />
                  Doctors
                </Link>

                <Link to="/appointments" className={mobileLinkClass("/appointments")} onClick={closeMobileMenu}>
                  <CalendarCheck2 size={16} />
                  Appointments
                </Link>

                <Link to="/my-prescriptions" className={mobileLinkClass("/my-prescriptions")} onClick={closeMobileMenu}>
                  <FileText size={16} />
                  Prescriptions
                </Link>
              </>
            )}

            {role === "DOCTOR" && (
              <>
                <Link to="/dashboard" className={mobileLinkClass("/dashboard")} onClick={closeMobileMenu}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <Link to="/appointments" className={mobileLinkClass("/appointments")} onClick={closeMobileMenu}>
                  <CalendarCheck2 size={16} />
                  Appointments
                </Link>

                <Link to="/prescriptions" className={mobileLinkClass("/prescriptions")} onClick={closeMobileMenu}>
                  <FileText size={16} />
                  Prescriptions
                </Link>
              </>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(239,68,68,0.24)] transition-all duration-300 hover:from-red-600 hover:to-rose-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}