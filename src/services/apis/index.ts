import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
