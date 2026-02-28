import React, { createContext, useContext, useState } from "react";
import {
  fetchPublicTemplatesService,
  fetchMyTemplatesService,
  createEmailTemplateService,
  getTemplateVariablesService,
} from "../services/emailTemplateServices";

const EmailTemplateContext = createContext();

export const EmailTemplateProvider = ({ children }) => {
  // ── Existing state ─────────────────────────────────────────────────────────
  const [publicTemplates, setPublicTemplates] = useState([]);
  const [myTemplates, setMyTemplates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Template variable resolver state ───────────────────────────────────────
  const [templateInfo, setTemplateInfo] = useState(null);
  const [templateVarKeys, setTemplateVarKeys] = useState([]);
  const [isFetchingTemplate, setIsFetchingTemplate] = useState(false);
  const [templateError, setTemplateError] = useState("");

  // ── Existing actions ───────────────────────────────────────────────────────
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

  // ── Template variable resolver actions ─────────────────────────────────────
  const getTemplateVariables = async (templateId, signal = undefined) => {
    if (!templateId) {
      clearTemplateVariables();
      return;
    }

    setIsFetchingTemplate(true);
    setTemplateError("");
    setTemplateInfo(null);
    setTemplateVarKeys([]);

    const res = await getTemplateVariablesService(templateId, signal);

    if (res.success) {
      const vars = Array.isArray(res.data?.variables) ? res.data.variables : [];
      setTemplateInfo(res.data?.template || {});
      setTemplateVarKeys(vars);
    } else {
      // Ignore intentional cancellations
      if (res.message !== "canceled") {
        setTemplateError(res.message || "Failed to fetch template");
      }
    }

    setIsFetchingTemplate(false);
    return res;
  };

  const clearTemplateVariables = () => {
    setTemplateInfo(null);
    setTemplateVarKeys([]);
    setTemplateError("");
    setIsFetchingTemplate(false);
  };

  // ── Provider ───────────────────────────────────────────────────────────────
  return (
    <EmailTemplateContext.Provider
      value={{
        // Existing
        publicTemplates,
        myTemplates,
        pagination,
        loading,
        fetchPublicTemplates,
        fetchMyTemplates,
        createEmailTemplate,
        // Template variable resolver
        templateInfo,
        templateVarKeys,
        isFetchingTemplate,
        templateError,
        getTemplateVariables,
        clearTemplateVariables,
      }}
    >
      {children}
    </EmailTemplateContext.Provider>
  );
};

export const useEmailTemplate = () => useContext(EmailTemplateContext);
