import apiClient from './apiClient';
import { setAuthToken, clearAuthToken } from '../lib/security';
import { z } from 'zod';

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  languagePreference: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Registration failed');
    }
    
    // Store token
    setAuthToken(response.data.data.token);
    
    return response.data.data.user;
  },

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }
    
    // Store token
    setAuthToken(response.data.data.token);
    
    return response.data.data.user;
  },

  /**
   * Logout user
   */
  logout(): void {
    clearAuthToken();
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User }>('/auth/profile');
    
    if (!response.data.success) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.data.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<{ success: boolean; data: User }>('/auth/profile', data);
    
    if (!response.data.success) {
      throw new Error('Failed to update profile');
    }
    
    return response.data.data;
  },
};
