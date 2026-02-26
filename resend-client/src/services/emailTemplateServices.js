import API from "./api";

const handleRequest = async (promise) => {
  try {
    const res = await promise;
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message || err.response?.data?.error || err.message,
    };
  }
};

export const fetchPublicTemplatesService = ({ page = 1, limit = 10 } = {}) => {
  return handleRequest(
    API.get(`/users/email-templates/public?page=${page}&limit=${limit}`)
  );
};

export const fetchMyTemplatesService = () => {
  return handleRequest(API.get("/users/email-templates/my"));
};

export const createEmailTemplateService = async (templateData) => {
  return await handleRequest(
    API.post("/users/create-email-template", templateData)
  );
};
