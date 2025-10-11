// Real Authentication service that connects to the backend API

import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { storageService } from './storage.service';
import type { User, Role } from '../types';

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'member';
}

export interface LoginData {
  phone: string;
  password: string;
  role: 'admin' | 'manager' | 'member';
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    messId?: string;
    joinStatus?: string;
  };
  accessToken: string;
  refreshToken: string;
}

class RealAuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens
        storageService.setAuthToken(accessToken);
        storageService.setRefreshToken(refreshToken);
        storageService.setUserRole(user.role);
        
        // Map backend user to frontend User type
        const mappedUser: User = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role as Role,
          messId: user.messId,
          joinStatus: user.joinStatus as any,
        } as User;
        
        return {
          success: true,
          user: mappedUser,
        };
      }
      
      return {
        success: false,
        error: response.message || 'Registration failed',
      };
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during registration',
      };
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginData): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens
        storageService.setAuthToken(accessToken);
        storageService.setRefreshToken(refreshToken);
        storageService.setUserRole(user.role);
        
        // Map backend user to frontend User type
        const mappedUser: User = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role as Role,
          messId: user.messId,
          joinStatus: user.joinStatus as any,
        } as User;
        
        return {
          success: true,
          user: mappedUser,
        };
      }
      
      return {
        success: false,
        error: response.message || 'Login failed',
      };
    } catch (error: any) {
      console.error('Login error:', error);
      // Re-throw error with proper structure for Login component to handle
      throw {
        response: {
          status: error.status || 500,
          data: {
            message: error.message || 'Invalid credentials'
          }
        },
        message: error.message || 'Invalid credentials'
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      storageService.clearAuth();
    }
  }

  /**
   * Get current authenticated user - fetches from backend
   */
  getCurrentUser(): User | null {
    // This is deprecated - use userService.getProfile() instead
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return storageService.isAuthenticated();
  }

  /**
   * Get user role
   */
  getRole(): Role | null {
    const role = storageService.getUserRole();
    return role as Role;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = storageService.getRefreshToken();
      
      if (!refreshToken) {
        return false;
      }

      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken,
      });

      if (response.success && response.data) {
        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;
        
        storageService.setAuthToken(newToken);
        storageService.setRefreshToken(newRefreshToken);
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const realAuthService = new RealAuthService();
export default realAuthService;
