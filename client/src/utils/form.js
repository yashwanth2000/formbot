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
