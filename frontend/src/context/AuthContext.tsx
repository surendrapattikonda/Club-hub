import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuthContextType, RegisterData } from "@/types/auth";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // backend base URL

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/login`, { email, password, role });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
     // const res =  await axios.post(`${API_URL}/signup`, data);
     const res = await axios.post(
  `${API_URL}/signup`,
  data,
  { headers: { "Content-Type": "application/json" } }
);
 
     setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
