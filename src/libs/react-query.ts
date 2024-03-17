import { type QueryClientConfig } from "@tanstack/react-query";
import { notification } from "antd";

export const clientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      onError(err: any) {
        notification.error({
          message: "Error",
          description: err.message || "Failed to fetch data",
        });
      },
    },
    mutations: {
      onError(err: any) {
        notification.error({
          message: "Error",
          description: err.message || "Mutation failed",
        });
      },
    },
  },
};
