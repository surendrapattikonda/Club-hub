import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api";
import { User, AuthContextType, RegisterData } from "@/types/auth";
const API_URL ="/api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // NEW IMPORTANT STATE
  const [authLoading, setAuthLoading] = useState(true); 
  const [isLoading, setIsLoading] = useState(false);  

  // Load user from localStorage ONCE
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser?.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
        }
      } catch (error) {
        console.error("Invalid user in localStorage");
        localStorage.removeItem("user");
      }
    }

    setAuthLoading(false); // Wait before rendering routes
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const res = await api.post(`${API_URL}/login`, { email, password });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await api.post(`${API_URL}/signup`, data);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        authLoading,   // EXPOSE NEW STATE
      }}
    >
      {!authLoading && children} {/* WAIT before rendering app */}
    </AuthContext.Provider>
  );
};
