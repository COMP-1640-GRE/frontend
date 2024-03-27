import { useGetIdentity } from "@refinedev/core";
import { Identity } from "../services/types";

export const useIdentity = () => {
  const { data } = useGetIdentity<Identity>({});

  return { ...data };
};
