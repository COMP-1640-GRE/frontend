import { AccessControlProvider } from "@refinedev/core";
import { UserRole } from "../enums/user.enum";
import { Resource } from "../refineResources";
import { authProvider } from "./authProvider";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const role = (await authProvider.getPermissions?.()) as UserRole;

    if (
      role &&
      rolesCan[role][action as Action].includes(resource as Resource)
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

type Action = "list" | "create" | "edit" | "delete";

const rolesCan: Record<UserRole, Record<Action, Resource[]>> = {
  administrator: {
    list: ["faculties", "periods"],
    create: ["faculties", "periods"],
    edit: ["faculties", "periods"],
    delete: ["faculties", "periods"],
  },
  faculty_marketing_coordinator: {
    list: [],
    create: [],
    edit: [],
    delete: [],
  },
  university_marketing_manager: {
    list: [],
    create: [],
    edit: [],
    delete: [],
  },
  guest: {
    list: [],
    create: [],
    edit: [],
    delete: [],
  },
  student: {
    list: [],
    create: [],
    edit: [],
    delete: [],
  },
};
