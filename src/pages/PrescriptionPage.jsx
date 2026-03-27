import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { doctorApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import {
  ClipboardPlus,
  CalendarDays,
  UserRound,
  FileText,
  Pill,
  StickyNote,
  Send,
  Download,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
} from "lucide-react";

export default function PrescriptionPage() {
  const { user, role } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lastPrescriptionId, setLastPrescriptionId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setPageLoading(true);
        setError("");

        if (role !== "DOCTOR") {
          setError("Only doctors can create prescriptions");
          setPageLoading(false);
          return;
        }

        if (!user?.doctorId) {
          setError("Doctor ID not found. Open doctor dashboard once first.");
          setPageLoading(false);
          return;
        }

        const response = await doctorApi.getAppointments(user.doctorId);
        const data = response.data || [];

        const validAppointments = data.filter(
          (appt) => appt.status !== "CANCELLED" && appt.status !== "COMPLETED"
        );

        setAppointments(validAppointments);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load appointments");
      } finally {
        setPageLoading(false);
      }
    };

    fetchAppointments();
  }, [role, user?.doctorId]);

  const selectedAppointment = useMemo(() => {
    return appointments.find(
      (appt) => String(appt.id) === String(selectedAppointmentId)
    );
  }, [appointments, selectedAppointmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const refreshAppointments = async () => {
    const refreshed = await doctorApi.getAppointments(user.doctorId);
    const validAppointments = (refreshed.data || []).filter(
      (appt) => appt.status !== "CANCELLED" && appt.status !== "COMPLETED"
    );
    setAppointments(validAppointments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLastPrescriptionId(null);

    if (!selectedAppointment) {
      setError("Please select an appointment");
      return;
    }

    if (!form.diagnosis.trim() || !form.medicines.trim()) {
      setError("Diagnosis and medicines are required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        appointmentId: Number(selectedAppointment.id),
        doctorId: Number(selectedAppointment.doctorId),
        patientId: Number(selectedAppointment.patientId),
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        notes: form.notes,
      };

      const response = await doctorApi.createPrescription(payload);
      const createdPrescription = response.data;

      setLastPrescriptionId(createdPrescription.id);
      setMessage(
        "Prescription created successfully. Email is being sent in background."
      );

      setSelectedAppointmentId("");
      setForm({ diagnosis: "", medicines: "", notes: "" });

      await refreshAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create prescription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendEmailAgain = async () => {
    if (!lastPrescriptionId) return;

    try {
      setEmailSending(true);
      const res = await doctorApi.sendPrescriptionEmail(lastPrescriptionId);
      setMessage(res?.data || "Email sent successfully");
      setError("");
    } catch (err) {
      setError("Failed to send email");
    } finally {
      setEmailSending(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!lastPrescriptionId) return;

    try {
      setDownloading(true);
      const response = await doctorApi.downloadPrescriptionPdf(lastPrescriptionId);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `prescription_${lastPrescriptionId}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
      setError("");
    } catch {
      setError("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-6 md:p-8 shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-lg">
                <ClipboardPlus size={28} />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Create Prescription
                </h2>
                <p className="mt-2 max-w-2xl text-sm md:text-base text-blue-100">
                  Select an active appointment, add diagnosis, medicines, and notes,
                  then generate a clean digital prescription for the patient.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:min-w-[280px]">
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  Pending Appointments
                </p>
                <p className="mt-1 text-2xl font-bold">{appointments.length}</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white backdrop-blur-md">
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  Last Prescription
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {lastPrescriptionId ? `#${lastPrescriptionId}` : "--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTS */}
        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 text-emerald-600" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-emerald-800">{message}</p>

                {lastPrescriptionId && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={handleSendEmailAgain}
                      disabled={emailSending}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Send size={16} />
                      {emailSending ? "Sending..." : "Send Email Again"}
                    </button>

                    <button
                      onClick={handleDownloadPdf}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Download size={16} />
                      {downloading ? "Downloading..." : "Download PDF"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 text-red-600" size={20} />
              <p className="font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid gap-6 xl:grid-cols-[1.05fr_1.2fr]">
          {/* LEFT SIDE */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                <CalendarDays size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Select Appointment
                </h3>
                <p className="text-sm text-slate-500">
                  Choose an active appointment before creating a prescription.
                </p>
              </div>
            </div>

            {pageLoading ? (
              <div className="space-y-3">
                <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                  <Stethoscope size={24} />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-slate-700">
                  No active appointments
                </h4>
                <p className="mt-2 text-sm text-slate-500">
                  All appointments are completed or cancelled, or there are no
                  appointments available right now.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => {
                  const isSelected =
                    String(selectedAppointmentId) === String(appt.id);

                  return (
                    <button
                      key={appt.id}
                      onClick={() => setSelectedAppointmentId(appt.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              Appointment #{appt.id}
                            </span>
                            {isSelected && (
                              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                                Selected
                              </span>
                            )}
                          </div>

                          <h4 className="mt-3 text-lg font-bold text-slate-800">
                            {appt.patientName}
                          </h4>

                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <CalendarDays size={16} className="text-blue-600" />
                              <span>{appt.appointmentDate}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <UserRound size={16} className="text-indigo-600" />
                              <span>Patient ID: {appt.patientId}</span>
                            </div>
                          </div>

                          <p className="mt-2 text-sm text-slate-500">
                            Time: {appt.appointmentTime}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Prescription Form
                </h3>
                <p className="text-sm text-slate-500">
                  Fill in the medical details to generate the prescription.
                </p>
              </div>
            </div>

            {!selectedAppointment ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                  <ClipboardPlus size={24} />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-slate-700">
                  Select an appointment first
                </h4>
                <p className="mt-2 text-sm text-slate-500">
                  Once you select an appointment from the left side, the prescription
                  form will be ready.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 p-4 border border-slate-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                      Appointment #{selectedAppointment.id}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                      {selectedAppointment.patientName}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                      {selectedAppointment.appointmentDate}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Stethoscope size={16} className="text-blue-600" />
                      Diagnosis
                    </label>
                    <input
                      name="diagnosis"
                      value={form.diagnosis}
                      onChange={handleChange}
                      placeholder="Enter diagnosis"
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Pill size={16} className="text-indigo-600" />
                      Medicines
                    </label>
                    <textarea
                      name="medicines"
                      value={form.medicines}
                      onChange={handleChange}
                      placeholder="Write prescribed medicines"
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <StickyNote size={16} className="text-amber-600" />
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Additional instructions or precautions"
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <ClipboardPlus size={18} />
                    {submitting ? "Creating Prescription..." : "Create Prescription"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}