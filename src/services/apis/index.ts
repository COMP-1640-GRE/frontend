import { HttpError } from "@refinedev/core";
import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

export default api;
