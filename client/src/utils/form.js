import axios from "axios";
const backendUrl = import.meta.env.VITE_SERVER_URL;

const getToken = () => localStorage.getItem("accessToken");

const axiosInstance = axios.create({
  baseURL: backendUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createForm = async (data) => {
  try {
    const response = await axiosInstance.post("/api/form/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
};

export const getAllForms = async () => {
  try {
    const response = await axiosInstance.get("/api/form/getAll");
    return response.data;
  } catch (error) {
    console.error("Error getting all forms:", error);
    throw error;
  }
};

export const getFormById = async (formId) => {
  try {
    const response = await axiosInstance.get(`/api/form/get/${formId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting form by ID:", error);
    throw error;
  }
};

export const deleteForm = async (formId) => {
  try {
    const response = await axiosInstance.delete(`/api/form/delete/${formId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting form:", error);
    throw error;
  }
};

export const updateInputValue = async (formId, elementId, value) => {
  try {
    const response = await axiosInstance.put(
      `/api/form/updateInputValue/${formId}/${elementId}`,
      { value }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating input value:", error);
    throw error;
  }
};

export const updateFormAnalytics = async (
  formId,
  completions,
  views,
  starts
) => {
  try {
    const response = await axiosInstance.put(
      `/api/form/updateAnalytics/${formId}`,
      { completions, views, starts }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating form analytics:", error);
    throw error;
  }
};
