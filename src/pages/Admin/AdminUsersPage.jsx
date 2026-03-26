import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";
import {
  Users,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Mail,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteModal = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedUserId(null);
    setShowDeleteModal(false);
  };

  const deleteUser = async () => {
    try {
      setError("");
      setMessage("");

      await api.delete(`/admin/users/${selectedUserId}`);

      setMessage("User deleted successfully");
      closeDeleteModal();
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "DOCTOR":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PATIENT":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRoleCardColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "from-purple-600 via-violet-600 to-fuchsia-600";
      case "DOCTOR":
        return "from-blue-600 via-indigo-600 to-cyan-600";
      case "PATIENT":
        return "from-emerald-600 via-green-600 to-teal-600";
      default:
        return "from-slate-600 to-slate-700";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 p-7 text-white shadow-2xl">
          <div className="absolute -top-10 right-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-pink-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-purple-50 backdrop-blur">
                <Users size={14} />
                User Administration
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                User Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-purple-100 sm:text-base">
                View all registered users, manage roles, and control account
                access from one admin interface.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-purple-100">
                Total Users
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {loading ? "..." : users.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* Quick role stats */}
        {!loading && users.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {["ADMIN", "DOCTOR", "PATIENT"].map((role) => {
              const count = users.filter((user) => user.role === role).length;

              return (
                <div
                  key={role}
                  className={`rounded-3xl bg-gradient-to-r ${getRoleCardColor(
                    role
                  )} p-5 text-white shadow-lg`}
                >
                  <p className="text-sm font-medium text-white/80">{role}</p>
                  <h3 className="mt-2 text-3xl font-bold">{count}</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Registered {role.toLowerCase()} accounts
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Table Section */}
        <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">All Users</h2>
              <p className="text-sm text-slate-500">
                Manage all registered user accounts in the system
              </p>
            </div>

            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <UserRound size={24} />
              </div>
              <p className="text-sm font-medium text-slate-700">
                No users found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                User accounts will appear here once they are created.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-sm text-slate-600">
                      <th className="px-5 py-4 font-semibold">ID</th>
                      <th className="px-5 py-4 font-semibold">Name</th>
                      <th className="px-5 py-4 font-semibold">Email</th>
                      <th className="px-5 py-4 font-semibold">Role</th>
                      <th className="px-5 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-slate-100 text-sm transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-medium text-slate-700">
                          {user.id}
                        </td>

                        <td className="px-5 py-4">
                          <div className="inline-flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {user.name || "-"}
                              </p>
                              <p className="text-xs text-slate-500">
                                User Account
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div className="inline-flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" />
                            <span>{user.email || "-"}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getRoleClass(
                              user.role
                            )}`}
                          >
                            <ShieldCheck size={12} />
                            {user.role || "UNKNOWN"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => openDeleteModal(user.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">Delete User</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete this user? This action cannot be
              undone and may remove linked records as well.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={deleteUser}
                className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}