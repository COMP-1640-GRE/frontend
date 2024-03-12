import { AuthBindings } from "@refinedev/core";
import api from "./apis";
import { LocalStorageKey } from "../enums/local-storage.enum";
import { AxiosError } from "axios";

export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthBindings = {
  login: async ({ username, password, remember }) => {
    if (username && password) {
      let redirectTo = "/";
      const res = await api
        .post("/auth/login", { username, password })
        .catch(({ response }: AxiosError) => {
          if (response?.status === 428) {
            localStorage.setItem(
              LocalStorageKey.USER,
              JSON.stringify(response.data)
            );
            redirectTo = "/activate";
          }
        });

      if (res) {
        localStorage.setItem(LocalStorageKey.USER, JSON.stringify(res.data));
      }

      return {
        success: true,
        redirectTo,
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.clear();
    await api.get("/auth/logout");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(LocalStorageKey.USER);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  // TODO: Implement
  getPermissions: async () => null,
  getIdentity: async () => {
    const user = localStorage.getItem(LocalStorageKey.USER);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
