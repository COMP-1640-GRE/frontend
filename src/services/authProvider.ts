import { AuthBindings } from "@refinedev/core";
import { AxiosError } from "axios";
import { LocalStorageKey } from "../enums/local-storage.enum";
import api from "./apis";
import { Identity } from "./types";

export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthBindings = {
  login: async ({ username, password, remember }) => {
    try {
      if (username && password) {
        let redirectTo = "/";
        let message = "Some thing went wrong";
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
            message = (response?.data as any)?.["message"];
          });

        if (res) {
          localStorage.setItem(LocalStorageKey.USER, JSON.stringify(res.data));
          return {
            success: true,
            redirectTo,
            successNotification: {
              message: "Login successful",
              description: "Welcome back!",
            },
          };
        }

        if (remember) {
          localStorage.setItem(LocalStorageKey.REMEMBER, "true");
        }

        if (redirectTo === "/activate-account") {
          return {
            success: false,
            redirectTo,
            error: {
              name: "Account not activated",
              message: "You need to activate your account first",
            },
          };
        }

        return {
          success: false,
          redirectTo,
          error: {
            name: "Login Error",
            message,
          },
        };
      }
    } catch {
      //
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
    await api.get("/auth/logout").catch(() => ({}));

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () =>
    api
      .get("/auth/introspect")
      .then((response) => {
        localStorage.setItem(
          LocalStorageKey.USER,
          JSON.stringify(response.data)
        );

        return { authenticated: true };
      })
      .catch(() => ({
        authenticated: false,
        redirectTo: "/login",
      })),
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
