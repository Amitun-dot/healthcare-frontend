import api from "./axiosConfig";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

export const patientApi = {
  getProfileByUserId: (userId) => api.get(`/patient/profile-by-user/${userId}`),
  getAllDoctors: () => api.get("/patient/doctors"),
  bookAppointment: (data) => api.post("/patient/book-appointment", data),
  getAppointments: (patientId) => api.get(`/patient/appointments/${patientId}`),
  cancelAppointment: (appointmentId) =>
    api.put(`/patient/cancel-appointment/${appointmentId}`),
};

export const doctorApi = {
  getProfileByUserId: (userId) => api.get(`/doctor/profile/user/${userId}`),
  getAppointments: (doctorId) => api.get(`/doctor/appointments/${doctorId}`),

  updateAppointmentStatus: (appointmentId, data) =>
    api.put(`/doctor/appointments/${appointmentId}/status`, data),

  createPrescription: (data) => api.post("/doctor/prescriptions", data),
  getPrescriptions: (doctorId) => api.get(`/doctor/prescriptions/${doctorId}`),

  sendPrescriptionEmail: (prescriptionId) =>
    api.post(`/prescriptions/${prescriptionId}/send-email`),

  downloadPrescriptionPdf: (prescriptionId) =>
    api.get(`/prescriptions/${prescriptionId}/download`, {
      responseType: "blob",
    }),
};