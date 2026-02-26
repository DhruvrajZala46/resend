import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  getProfile,
  verifyUserAccount,
  getDashboardDataService,
} from "../services/authServices.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const result = await getProfile();
      if (result.success) setUser(result.data);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogin = async (email, password) => {
    const result = await loginUser(email, password);
    if (result.success) {
      const profile = await getProfile();
      if (profile.success) setUser(profile.data);
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const handleRegister = async (name, email, password) => {
    const result = await registerUser(name, email, password);
    return result;
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  const verifyAccount = async (token) => {
    const result = await verifyUserAccount(token);
    return result;
  };

  const getDashboardData = async (page, status) => {
    const result = await getDashboardDataService(page, status);
    return result.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        verifyAccount,
        getDashboardData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
