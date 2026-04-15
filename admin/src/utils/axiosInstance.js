import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    // support either key (some pages set 'token', others 'accessToken')
    const accessToken =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // You can handle specific status codes here
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login
        console.error("Unauthorized! Redirecting to login...");
        // window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server error! Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout! Please try again.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
