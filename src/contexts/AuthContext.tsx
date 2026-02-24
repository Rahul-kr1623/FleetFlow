import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "driver" | "supplier";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  userName: string;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  userName: "",
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("fleet-auth"));
  const [role, setRole] = useState<UserRole | null>(() => localStorage.getItem("fleet-role") as UserRole | null);
  const [userName, setUserName] = useState(() => localStorage.getItem("fleet-name") || "");

  const login = (r: UserRole, name: string) => {
    setIsAuthenticated(true);
    setRole(r);
    setUserName(name);
    localStorage.setItem("fleet-auth", "true");
    localStorage.setItem("fleet-role", r);
    localStorage.setItem("fleet-name", name);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUserName("");
    localStorage.removeItem("fleet-auth");
    localStorage.removeItem("fleet-role");
    localStorage.removeItem("fleet-name");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
