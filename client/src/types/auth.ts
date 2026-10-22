export interface UserScope {
  scope_type: 'area' | 'branch' | 'global';
  scope_area_id?: string;
  scope_position_id?: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'Area Manager' | 'Regional Manager' | 'DSM' | 'Field Agent' | 'Admin';
  scope: UserScope;
  is_active: boolean;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: User;
}