import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchApiKeysService,
  createApiKeyService,
  deleteApiKeyService,
  toggleApiKeyStatusService,
} from "../services/apiKeysServices";

const ApiKeyContext = createContext();

export const ApiKeyProvider = ({ children }) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApiKeys = async () => {
    setLoading(true);
    const res = await fetchApiKeysService();
    if (res.success) {
      setApiKeys(res.data || []);
    } else {
      console.error("Failed to fetch API keys:", res.message);
    }
    setLoading(false);
  };

  const createApiKey = async (name) => {
    const res = await createApiKeyService(name);
    if (res.success && res.data?.apiKey) {
      setApiKeys((prev) => [res.data.apiKey, ...prev]);
    }
    return res;
  };

  const deleteApiKey = async (id) => {
    const res = await deleteApiKeyService(id);
    if (res.success) {
      setApiKeys((prev) => prev.filter((key) => key._id !== id));
    }
    return res;
  };

  const toggleApiKey = async (id) => {
    const res = await toggleApiKeyStatusService(id);
    if (res.success && res.data?.apiKey) {
      setApiKeys((prev) =>
        prev.map((key) =>
          key._id === id ? { ...key, active: res.data.apiKey.active } : key
        )
      );
    }
    return res;
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <ApiKeyContext.Provider
      value={{
        apiKeys,
        loading,
        fetchApiKeys,
        createApiKey,
        deleteApiKey,
        toggleApiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeys = () => useContext(ApiKeyContext);
