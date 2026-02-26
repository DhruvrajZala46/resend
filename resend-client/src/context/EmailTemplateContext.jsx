import React, { createContext, useContext, useState } from "react";
import {
  fetchPublicTemplatesService,
  fetchMyTemplatesService,
  createEmailTemplateService,
} from "../services/emailTemplateServices";

const EmailTemplateContext = createContext();

export const EmailTemplateProvider = ({ children }) => {
  const [publicTemplates, setPublicTemplates] = useState([]);
  const [myTemplates, setMyTemplates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPublicTemplates = async (options = {}) => {
    setLoading(true);
    const res = await fetchPublicTemplatesService(options);
    if (res.success) {
      if (options.page === 1) {
        setPublicTemplates(res.data.templates);
      } else {
        setPublicTemplates((prev) => [...prev, ...res.data.templates]);
      }
      setPagination(res.data.pagination);
    }
    setLoading(false);
  };

  const fetchMyTemplates = async () => {
    setLoading(true);
    const res = await fetchMyTemplatesService();
    if (res.success) {
      setMyTemplates(res.data.templates);
    }
    setLoading(false);
  };

  const createEmailTemplate = async (data) => {
    return createEmailTemplateService(data);
  };

  return (
    <EmailTemplateContext.Provider
      value={{
        publicTemplates,
        myTemplates,
        pagination,
        loading,
        fetchPublicTemplates,
        fetchMyTemplates,
        createEmailTemplate,
      }}
    >
      {children}
    </EmailTemplateContext.Provider>
  );
};

export const useEmailTemplate = () => useContext(EmailTemplateContext);
