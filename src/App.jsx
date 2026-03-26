import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/PatientsPage";
import DoctorsPage from "./pages/DoctorsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import PrescriptionPage from "./pages/PrescriptionPage";
import MyPrescriptionsPage from "./pages/MyPrescriptionsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ServerDown from "./pages/ServerDown";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminDoctorsPage from "./pages/Admin/AdminDoctorsPage";
import AdminPatientsPage from "./pages/Admin/AdminPatientsPage";
import AdminAppointmentsPage from "./pages/Admin/AdminAppointmentsPage";
import AdminUsersPage from "./pages/Admin/AdminUsersPage"; // ✅ ADDED

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#111827",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/server-down" element={<ServerDown />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Common Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Patient Routes */}
        <Route
          path="/patients/profile"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-prescriptions"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <MyPrescriptionsPage />
            </ProtectedRoute>
          }
        />

        {/* Shared / General Routes */}
        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <DoctorsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <PrescriptionPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDoctorsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPatientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAppointmentsPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW USERS ROUTE */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;