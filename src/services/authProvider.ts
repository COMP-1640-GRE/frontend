import { AuthBindings } from "@refinedev/core";
import { AxiosError } from "axios";
import { LocalStorageKey } from "../enums/local-storage.enum";
import { AccountStatus } from "../enums/user.enum";
import api from "./apis";
import { Identity } from "./types";

export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthBindings = {
  login: async ({ username, password, remember }) => {
    if (username && password) {
      let redirectTo = "/";
      const res = await api
        .post("/auth/login", { username, password, remember })
        .catch(({ response }: AxiosError) => {
          if (response?.status === 428) {
            localStorage.setItem(
              LocalStorageKey.USER,
              JSON.stringify(response.data)
            );
            redirectTo = "/activate-account";
          }
        });

      if (res) {
        localStorage.setItem(LocalStorageKey.USER, JSON.stringify(res.data));
      }
      if (remember) {
        localStorage.setItem(LocalStorageKey.REMEMBER, "true");
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
    const user = getUser();

    if (user?.account_status === AccountStatus.ACTIVE) {
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
  getPermissions: async () => {
    const user = getUser();
    if (user) {
      return user.role;
    }
    return;
  },
  getIdentity: async () => getUser(),
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};

const getUser = () => {
  const user = localStorage.getItem(LocalStorageKey.USER);

  if (user) {
    return JSON.parse(user) as Identity;
  }

  return null;
};
