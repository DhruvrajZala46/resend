import API from "./api";

/**
 * Axios wrapper to handle errors
 */
const handleRequest = async (axiosPromise) => {
  try {
    const { data } = await axiosPromise;
    return { success: true, data };
  } catch (err) {
    console.error("API request error:", err);

    // Normalize backend error messages
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";

    return { success: false, message };
  }
};

// AUTH API FUNCTIONS

export const registerUser = async (name, email, password) => {
  return await handleRequest(
    API.post("/users/register", { name, email, password })
  );
};

export const loginUser = async (email, password) => {
  return await handleRequest(API.post("/users/login", { email, password }));
};

export const logoutUser = async () => {
  return await handleRequest(API.post("/users/logout"));
};

export const getProfile = async () => {
  return await handleRequest(API.get("/users/me"));
};

export const verifyUserAccount = async (token) => {
  return await handleRequest(API.post(`/users/verify/${token}`));
};

export const getDashboardDataService = async (page, status) => {
  return await handleRequest(
    API.get(`/users/dashboard?page=${page}&limit=10&status=${status}`)
  );
};
