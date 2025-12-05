import { User } from '../../users/models/user.model';

/**
 * Modèle d'authentification
 */
export interface AuthStateModel {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Credentials pour le login
 */
export interface LoginCredentials {
  login: string;
  password: string;
}

/**
 * Réponse du backend lors du login
 */
export interface LoginResponse {
  token?: string;
  user: User;
}
