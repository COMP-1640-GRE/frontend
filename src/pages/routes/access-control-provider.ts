import { AccessControlProvider } from "@refinedev/core";
import { UserRole } from "../../enums/user.enum";
import { Resource } from "./refineResources";
import { authProvider } from "../../services/authProvider";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    const role = (await authProvider.getPermissions?.()) as UserRole;
    const resourceKey = (params?.resource?.identifier || resource) as Resource;

    if (role && rolesCan[role]?.[resourceKey]?.includes(action as Action)) {
      return { can: true };
    }

    return {
      can: false,
      reason: "Unauthorized",
    };
  },
  options: {
    buttons: { enableAccessControl: true, hideIfUnauthorized: true },
  },
};

type Action = "list" | "create" | "edit" | "delete" | "show" | "clone";

const rolesCan: Record<UserRole, Partial<Record<Resource, Action[]>>> = {
  administrator: {
    users: ["list", "create", "edit", "delete", "show"],
    semesters: ["list", "create", "edit", "delete", "show"],
    faculties: ["list", "create", "edit", "delete", "show"],
    contributions: ["list", "show", "delete"],
    comments: ["create", "edit", "delete"],
    systems: ["list"],
  },
  faculty_marketing_coordinator: {
    contributions: ["list", "show"],
    reviews: ["list", "create", "edit", "delete"],
    comments: ["create", "edit", "delete"],
    systems: ["list"],
  },
  university_marketing_manager: {
    contributions: ["list", "show"],
    reviews: ["list"],
    comments: ["create", "edit", "delete"],
    systems: ["list"],
  },
  guest: {
    contributions_gallery: ["list", "show"],
    comments: ["create", "edit", "delete"],
  },
  student: {
    contributions_gallery: ["list", "create", "edit", "show", "delete"],
    reviews: ["list"],
    comments: ["create", "edit", "delete"],
  },
};
