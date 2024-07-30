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

export const createFolder = async (folderData) => {
  try {
    const response = await axiosInstance.post(
      "/api/folder/createFolder",
      folderData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteFolder = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/folder/deleteFolder/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllFolders = async () => {
  try {
    const response = await axiosInstance.get("/api/folder/getAll");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
