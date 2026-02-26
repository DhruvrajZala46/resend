import API from "./api";

// Unified request handler
const handleRequest = async (axiosPromise) => {
  try {
    const { data } = await axiosPromise;
    return { success: true, data };
  } catch (err) {
    console.error("API request error:", err);

    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";

    return { success: false, message };
  }
};

// Fetch user's App Credentials
export const fetchAppCredentialsService = async () => {
  return await handleRequest(API.get("/users/app/credentials"));
};

// Create App Credentials
export const createAppCredentialsService = async (payload) => {
  return await handleRequest(
    API.post("/users/app/create-credentials", payload)
  );
};

// View decrypted password (secure)
export const viewDecryptedPasswordService = async (id) => {
  return await handleRequest(API.get(`/users/app/credentials/${id}/decrypted`));
};

// Delete App Credentials
export const deleteAppCredentialsService = async (id) => {
  return await handleRequest(API.delete(`/users/app/${id}`));
};
