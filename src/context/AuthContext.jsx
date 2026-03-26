import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [serverDown, setServerDown] = useState(false);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data));

    setToken(data.token);
    setRole(data.role);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    setToken("");
    setRole("");
    setUser(null);
  };

  const setPatientId = (patientId) => {
    const updatedUser = { ...user, patientId };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const setDoctorId = (doctorId) => {
    const updatedUser = { ...user, doctorId };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        login,
        logout,
        setPatientId,
        setDoctorId,
        serverDown,
        setServerDown,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}