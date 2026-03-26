import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { patientApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export default function PatientsPage() {
  const { user, setPatientId } = useAuth();

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    age: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await patientApi.getProfileByUserId(user.userId);

        setProfile({
          id: res.data.id || "",
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          gender: res.data.gender || "",
          age: res.data.age || "",
        });

        if (res.data.id) {
          setPatientId(res.data.id);
        }
      } catch (err) {
        console.error("PROFILE STATUS:", err?.response?.status);
        console.error("PROFILE DATA:", err?.response?.data);
        console.error("FULL PROFILE ERROR:", err);
        setError(err?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.userId]);

  return (
    <Layout>
      <div className="space-y-8">

        {/* 🔥 ONLY THIS SECTION COLOR CHANGED */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Patient Profile
              </p>
              <h2 className="text-3xl font-bold text-white">My Profile</h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                View your personal information stored in the healthcare system.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-wide text-white/100">Patient ID</p>
              <p className="mt-1 text-xl font-bold text-white-200">
                {profile.id || "--"}
              </p>
            </div>
          </div>
        </section>

        {/* EVERYTHING BELOW IS EXACT SAME */}

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-slate-200 shadow-xl backdrop-blur-xl">
            Loading profile...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-3xl font-bold text-white shadow-lg shadow-cyan-500/20">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "P"}
                </div>

                <h3 className="text-2xl font-semibold text-white">
                  {profile.name || "Patient"}
                </h3>

                <p className="mt-2 text-sm text-slate-300">
                  {profile.email || "No email available"}
                </p>

                <div className="mt-6 grid w-full grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Gender</p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {profile.gender || "--"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Age</p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {profile.age || "--"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl lg:col-span-2">
              <div className="mb-5">
                <h3 className="text-xl font-semibold text-white">Profile Details</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Your account and contact details in read-only mode.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Full Name
                  </label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white outline-none"
                    value={profile.name}
                    readOnly
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Email Address
                  </label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white outline-none"
                    value={profile.email}
                    readOnly
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Phone Number
                  </label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white outline-none"
                    value={profile.phone}
                    readOnly
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Gender
                  </label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white outline-none"
                    value={profile.gender}
                    readOnly
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Age
                  </label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white outline-none"
                    value={profile.age}
                    readOnly
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Address
                  </label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white outline-none"
                    value={profile.address}
                    readOnly
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
}