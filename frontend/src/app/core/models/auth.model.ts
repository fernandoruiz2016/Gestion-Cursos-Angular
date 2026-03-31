import { User } from './user.model';

export interface LoginCredentials {
  Email: string;
  Clave: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
