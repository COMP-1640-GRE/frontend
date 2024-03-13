export interface Identity {
  id: number;
  username: string;
  role: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  account_status: string;
  created_at: string;
  updated_at: string;
  faculty: Faculty;
}

export interface Faculty {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
