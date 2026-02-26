import API from "./api";

const handleRequest = async (axiosPromise) => {
  try {
    const res = await axiosPromise;
    return {
      success: true,
      data: res.data,
      message: res.data?.message || "Success",
    };
  } catch (err) {
    console.error("API request error:", err);

    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";

    return {
      success: false,
      data: null,
      message,
      status: err.response?.status || 500,
    };
  }
};

export const fetchApiKeysService = async () => {
  return await handleRequest(API.get("/users/api-keys"));
};

export const createApiKeyService = async (name) => {
  return await handleRequest(API.post("/users/create-api-key", { name }));
};

export const deleteApiKeyService = async (id) => {
  return await handleRequest(API.delete(`/users/${id}`));
};

export const toggleApiKeyStatusService = async (id) => {
  return await handleRequest(API.patch(`/users/${id}/toggle`));
};
