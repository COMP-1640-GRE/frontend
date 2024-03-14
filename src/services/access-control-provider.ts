import { AccessControlProvider } from "@refinedev/core";
import { UserRole } from "../enums/user.enum";
import { Resource } from "../refineResources";
import { authProvider } from "./authProvider";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const role = (await authProvider.getPermissions?.()) as UserRole;

    if (
      role &&
      rolesCan[role][resource as Resource].includes(action as Action)
    ) {
      return { can: true };
    }

    console.log(role, "can not access", resource, action);

    return {
      can: false,
      reason: "Unauthorized",
    };
  },
  options: {
    buttons: { enableAccessControl: true, hideIfUnauthorized: true },
  },
};

type Action = "list" | "create" | "edit" | "delete" | "show";

const rolesCan: Record<UserRole, Record<Resource, Action[]>> = {
  administrator: {
    faculties: ["list", "create", "edit", "delete", "show"],
    periods: ["list", "create", "edit", "delete", "show"],
  },
  faculty_marketing_coordinator: {
    faculties: [],
    periods: [],
  },
  university_marketing_manager: {
    faculties: [],
    periods: [],
  },
  guest: {
    faculties: [],
    periods: [],
  },
  student: {
    faculties: [],
    periods: [],
  },
};
