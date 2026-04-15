import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const AuthContext = createContext();

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [user, setUser] = useState(() => getStoredUser());
  const [serverDown, setServerDown] = useState(false);

  const login = useCallback((data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data));

    setToken(data.token);
    setRole(data.role);
    setUser(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    setToken("");
    setRole("");
    setUser(null);
    setServerDown(false);
  }, []);

  const setPatientId = useCallback((patientId) => {
    setUser((prevUser) => {
      const updatedUser = { ...(prevUser || {}), patientId };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const setDoctorId = useCallback((doctorId) => {
    setUser((prevUser) => {
      const updatedUser = { ...(prevUser || {}), doctorId };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value = useMemo(
    () => ({
      token,
      role,
      user,
      login,
      logout,
      setPatientId,
      setDoctorId,
      serverDown,
      setServerDown,
    }),
    [
      token,
      role,
      user,
      login,
      logout,
      setPatientId,
      setDoctorId,
      serverDown,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}