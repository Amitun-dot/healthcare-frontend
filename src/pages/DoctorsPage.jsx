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

      const res = await patientApi.bookAppointment(payload);

      toast.success("Appointment booked successfully!");
      setSelectedDoctorId(null);
      resetForm();
    } catch (err) {
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
        {/* --- UI unchanged above --- */}

        {doctors.map((doc) => (
          <div key={doc.id}>
            {selectedDoctorId === doc.id && (
              <div className="space-y-4">
                {/* DATE INPUT FIX */}
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-cyan-400
                  [&::-webkit-calendar-picker-indicator]:invert
                  [&::-webkit-calendar-picker-indicator]:opacity-80
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  value={appointmentForm.appointmentDate}
                  onChange={(e) =>
                    setAppointmentForm((prev) => ({
                      ...prev,
                      appointmentDate: e.target.value,
                    }))
                  }
                />

                {/* TIME INPUT FIX */}
                <input
                  type="time"
                  min={minAllowedTime || undefined}
                  max={normalizeTime(doc.availableTo) || undefined}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-cyan-400
                  [&::-webkit-calendar-picker-indicator]:invert
                  [&::-webkit-calendar-picker-indicator]:opacity-80
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  value={appointmentForm.appointmentTime}
                  onChange={(e) =>
                    setAppointmentForm((prev) => ({
                      ...prev,
                      appointmentTime: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}