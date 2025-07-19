import { User } from "./user.model";

export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: Date;
}