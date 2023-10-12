export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'admin' | 'customer';
  user_organization?: UserOrganization;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  status: boolean;
}

export interface PaginateType<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: LinksType[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: string | null;
  total: number;
}

export interface LinksType {
  url: string;
  label: string;
  active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  created_at: string;
  updated_at: string;
}

export interface FormOrganization {
  name: string;
  phone: string;
  email: string;
  website: string;
  logo: File | null;
}

export interface FormPerson {
  organization_id: string;
  name: string;
  phone: string;
  email: string;
  avatar: File | null;
}

export interface FormUser {
  name: string;
  phone: string;
  email: string;
  password?: string;
}


export interface UserOrganization {
  id: string;
  user_id: string;
  organization_id: string;
  organization?: Organization
  is_manager: boolean;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  organization_id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}
