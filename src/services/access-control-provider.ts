import { AccessControlProvider } from "@refinedev/core";
import { UserRole } from "../enums/user.enum";
import { Resource } from "../pages/routes/refineResources";
import { authProvider } from "./authProvider";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const role = (await authProvider.getPermissions?.()) as UserRole;

    if (
      role &&
      rolesCan[role]?.[resource as Resource]?.includes(action as Action)
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

const rolesCan: Record<UserRole, Partial<Record<Resource, Action[]>>> = {
  administrator: {
    users: ["list", "create", "edit", "delete", "show"],
    semesters: ["list", "create", "edit", "delete", "show"],
    faculties: ["list", "create", "edit", "delete", "show"],
  },
  faculty_marketing_coordinator: {},
  university_marketing_manager: {},
  guest: {},
  student: {},
};
