import { AccountStatus, UserRole } from "../../enums/user.enum";

export interface Identity {
  id: number;
  username: string;
  role: UserRole;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
  faculty: Faculty;
  avatar?: string;
}

export interface Faculty {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
