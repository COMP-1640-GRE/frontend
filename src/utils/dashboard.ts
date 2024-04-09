import { UserRole } from "../enums/user.enum";
import { Identity } from "../services/types";

export const isGuestCanAccess = (
  identity: Identity | undefined,
  ...resources: string[]
) => {
  if (identity) {
    const { role, faculty } = identity;

    if (role === UserRole.GUEST) {
      return faculty.guest_resource.some((item) => resources.includes(item));
    }
  }

  return true;
};
