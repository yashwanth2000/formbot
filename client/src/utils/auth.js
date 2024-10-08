import axios from "axios";
import Cookies from "js-cookie";
const backendUrl = import.meta.env.VITE_SERVER_URL;

export const registerUser = async ({ email, password, name }) => {
  try {
    const reqUrl = `${backendUrl}/api/auth/register`;
    const response = await axios.post(reqUrl, {
      name,
      password,
      email,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Registration error:", error.response.data);
      throw error;
    } else if (error.request) {
      console.error("No response received from server");
    } else {
      console.error("Error setting up the request:", error.message);
    }
  }
};

export const login = async ({ email, password }) => {
  try {
    const reqUrl = `${backendUrl}/api/auth/login`;
    const response = await axios.post(reqUrl, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Login error:", error.response.data);
      throw error;
    } else if (error.request) {
      console.error("No response received from server");
    } else {
      console.error("Error setting up the request:", error.message);
    }
  }
};

export const logout = async () => {
  try {
    const reqUrl = `${backendUrl}/api/auth/logout`;
    const response = await axios.get(reqUrl);

    Cookies.remove("accessToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Logout error:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server");
    } else {
      console.error("Error setting up the request:", error.message);
    }
  }
};
