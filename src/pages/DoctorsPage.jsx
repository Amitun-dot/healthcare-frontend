import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { patientApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const [appointmentForm, setAppointmentForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await patientApi.getAllDoctors();
        setDoctors(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load doctors");
      }
    };

    fetchDoctors();
  }, []);

  const resetForm = () => {
    setAppointmentForm({
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
    });
  };

  const handleToggleBooking = (doctorId) => {
    if (selectedDoctorId === doctorId) {
      setSelectedDoctorId(null);
      resetForm();
      return;
    }

    setSelectedDoctorId(doctorId);
    resetForm();
  };

  const selectedDoctor = useMemo(
    () => doctors.find((doc) => doc.id === selectedDoctorId) || null,
    [doctors, selectedDoctorId]
  );

  const formatTime = (timeValue) => {
    if (!timeValue) return "N/A";
    const value = timeValue.length >= 5 ? timeValue.slice(0, 5) : timeValue;
    const [hourStr, minuteStr] = value.split(":");
    const hour = Number(hourStr);
    const minute = minuteStr ?? "00";

    if (Number.isNaN(hour)) return timeValue;

    const ampm = hour >= 12 ? "PM" : "AM";
    const twelveHour = hour % 12 || 12;
    return `${twelveHour}:${minute} ${ampm}`;
  };

  const normalizeTime = (timeValue) => {
    if (!timeValue) return "";
    return timeValue.length >= 5 ? timeValue.slice(0, 5) : timeValue;
  };

  const isToday = (dateValue) => {
    if (!dateValue) return false;
    const today = new Date().toISOString().split("T")[0];
    return dateValue === today;
  };

  const getTodayTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const validateBooking = (doctor) => {
    if (!user?.patientId) {
      return "Open My Profile once before booking appointment";
    }

    if (
      !appointmentForm.appointmentDate ||
      !appointmentForm.appointmentTime ||
      !appointmentForm.reason.trim()
    ) {
      return "Please select date, time, and enter symptoms/reason";
    }

    const today = new Date().toISOString().split("T")[0];
    if (appointmentForm.appointmentDate < today) {
      return "Past date booking is not allowed";
    }

    const selectedTime = normalizeTime(appointmentForm.appointmentTime);
    const availableFrom = normalizeTime(doctor?.availableFrom);
    const availableTo = normalizeTime(doctor?.availableTo);

    if (availableFrom && availableTo) {
      if (selectedTime < availableFrom || selectedTime > availableTo) {
        return `Please select a time between ${formatTime(
          availableFrom
        )} and ${formatTime(availableTo)}`;
      }
    }

    if (isToday(appointmentForm.appointmentDate)) {
      const nowTime = getTodayTime();
      if (selectedTime < nowTime) {
        return "Past time booking is not allowed for today";
      }
    }

    return null;
  };

  const handleBook = async (doctorId) => {
    try {
      const doctor = doctors.find((doc) => doc.id === doctorId);
      const validationError = validateBooking(doctor);

      if (validationError) {
        toast.error(validationError);
        return;
      }

      const payload = {
        doctorId,
        patientId: user.patientId,
        appointmentDate: appointmentForm.appointmentDate,
        appointmentTime: appointmentForm.appointmentTime,
        reason: appointmentForm.reason.trim(),
      };

      console.log("BOOK PAYLOAD:", payload);

      const res = await patientApi.bookAppointment(payload);
      console.log("BOOK RESPONSE:", res.data);

      toast.success("Appointment booked successfully!");
      setSelectedDoctorId(null);
      resetForm();
    } catch (err) {
      console.error("BOOK STATUS:", err?.response?.status);
      console.error("BOOK DATA:", err?.response?.data);
      console.error("FULL BOOK ERROR:", err);

      const data = err?.response?.data;

      if (typeof data === "string") {
        toast.error(data);
      } else if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        toast.error(firstError || "Booking failed");
      } else {
        toast.error(data?.message || "Booking failed");
      }
    }
  };

  const minAllowedTime =
    selectedDoctor && isToday(appointmentForm.appointmentDate)
      ? (() => {
          const doctorFrom = normalizeTime(selectedDoctor.availableFrom);
          const nowTime = getTodayTime();
          if (!doctorFrom) return nowTime;
          return nowTime > doctorFrom ? nowTime : doctorFrom;
        })()
      : normalizeTime(selectedDoctor?.availableFrom);

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Doctor Directory
              </p>
              <h2 className="text-3xl font-bold text-white">Find a Doctor</h2>
              <p className="mt-2 text-sm leading-6 text-white-300">
                Browse doctors, review their details, and book an appointment with ease.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-wide text-white-400">
                Available Doctors
              </p>
              <p className="mt-1 text-xl font-bold text-cyan-300">
                {doctors.length}
              </p>
            </div>
          </div>
        </section>

        {doctors.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-xl backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white">No doctors found</h3>
            <p className="mt-2 text-sm text-slate-300">
              There are no doctors available right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
                      {doc.name ? doc.name.charAt(0).toUpperCase() : "D"}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">
                        {doc.name}
                      </h3>
                      <p className="mt-1 text-sm text-cyan-300">
                        {doc.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Phone
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {doc.phone}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Experience
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {doc.experienceYears} years
                      </p>
                    </div>

                    <div className="rounded-2xl border border-cyan-400/10 bg-cyan-500/5 p-4 sm:col-span-2">
                      <p className="text-xs uppercase tracking-wide text-cyan-300">
                        Available Time
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {formatTime(doc.availableFrom)} - {formatTime(doc.availableTo)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleToggleBooking(doc.id)}
                      className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:opacity-95"
                    >
                      {selectedDoctorId === doc.id ? "Cancel" : "Book Appointment"}
                    </button>
                  </div>

                  {selectedDoctorId === doc.id && (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                      <h4 className="mb-2 text-lg font-semibold text-white">
                        Book Appointment
                      </h4>

                      <p className="mb-4 text-sm text-cyan-300">
                        Available between {formatTime(doc.availableFrom)} and{" "}
                        {formatTime(doc.availableTo)}
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Appointment Date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                            value={appointmentForm.appointmentDate}
                            onChange={(e) =>
                              setAppointmentForm((prev) => ({
                                ...prev,
                                appointmentDate: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Appointment Time
                          </label>
                          <input
                            type="time"
                            min={minAllowedTime || undefined}
                            max={normalizeTime(doc.availableTo) || undefined}
                            className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                            value={appointmentForm.appointmentTime}
                            onChange={(e) =>
                              setAppointmentForm((prev) => ({
                                ...prev,
                                appointmentTime: e.target.value,
                              }))
                            }
                          />
                          <p className="mt-2 text-xs text-slate-400">
                            Choose a time only within doctor availability.
                          </p>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Symptoms / Reason for Visit
                          </label>
                          <textarea
                            rows={4}
                            className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                            placeholder="Example: Fever for 3 days, skin allergy, headache, chest pain..."
                            value={appointmentForm.reason}
                            onChange={(e) =>
                              setAppointmentForm((prev) => ({
                                ...prev,
                                reason: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <button
                          onClick={() => handleBook(doc.id)}
                          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:opacity-95"
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}