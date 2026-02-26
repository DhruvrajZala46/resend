import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchAppCredentialsService,
  createAppCredentialsService,
  deleteAppCredentialsService,
  viewDecryptedPasswordService,
} from "../services/appCredentialsServices";

const AppCredentialsContext = createContext();

export const AppCredentialsProvider = ({ children }) => {
  const [appCredentials, setAppCredentials] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAppCredentials = async () => {
    try {
      setLoading(true);
      const { data } = await fetchAppCredentialsService();
      setAppCredentials(data || null);
    } catch (err) {
      console.error("Fetch App Credentials Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createAppCredentials = async (formData) => {
    try {
      const res = await createAppCredentialsService(formData);
      if (res.data) setAppCredentials(res.data);
      await fetchAppCredentials();
      return res;
    } catch (err) {
      console.error("Create App Credentials Error:", err);
      return { success: false, message: "Failed to create app credentials" };
    }
  };

  const deleteAppCredentials = async (id) => {
    try {
      await deleteAppCredentialsService(id);
      setAppCredentials(null);
    } catch (err) {
      console.error("Delete App Credentials Error:", err);
    }
  };

  const viewDecryptedPassword = async (id) => {
    try {
      const { data } = await viewDecryptedPasswordService(id);
      return data.decryptedAppPassword;
    } catch (err) {
      console.error("View Decrypted Password Error:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchAppCredentials();
  }, []);

  return (
    <AppCredentialsContext.Provider
      value={{
        appCredentials,
        loading,
        createAppCredentials,
        deleteAppCredentials,
        viewDecryptedPassword,
        fetchAppCredentials,
      }}
    >
      {children}
    </AppCredentialsContext.Provider>
  );
};

export const useAppCredentials = () => useContext(AppCredentialsContext);
