// This file will hold all our common types

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    first_name: string;
    email: string;
  };
}