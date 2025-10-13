// Authentication service for login, logout, and user management

import { storageService } from './storage.service';
import type { User, Role, LoginCredentials, BasicDetailsForm } from '../types';

class AuthService {
  /**
   * Check if a user exists in the database
   */
  userExists(phone: string, role: Role): boolean {
    const users = storageService.getAllUsers();
    return users.some(user => user.phone === phone && user.role === role);
  }

  /**
   * Get user by phone and role
   */
  getUserByPhone(phone: string, role: Role): User | null {
    const users = storageService.getAllUsers();
    return users.find(user => user.phone === phone && user.role === role) || null;
  }

  /**
   * Authenticate user with phone and password
   */
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: User;
    isExisting: boolean;
    error?: string;
  }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const { phone, password, role } = credentials;

      // Check if user exists
      const existingUser = this.getUserByPhone(phone, role);

      if (existingUser) {
        // Verify password
        if (existingUser.password && existingUser.password !== password) {
          return {
            success: false,
            isExisting: true,
            error: 'Incorrect password',
          };
        }

        // Update current user in storage
        storageService.setCurrentUser(existingUser);
        storageService.setRole(role);
        storageService.setAuthenticated(true);

        return {
          success: true,
          user: existingUser,
          isExisting: true,
        };
      }

      // New user - create account
      const newUser: User = {
        phone,
        password,
        role,
        name: '', // Will be filled in basic details
      } as User;

      storageService.setCurrentUser(newUser);
      storageService.setRole(role);
      storageService.setAuthenticated(true);

      return {
        success: true,
        user: newUser,
        isExisting: false,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        isExisting: false,
        error: 'An error occurred during login',
      };
    }
  }

  /**
   * Complete user registration with basic details
   */
  async completeBasicDetails(details: BasicDetailsForm): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const currentUser = storageService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'No user found',
        };
      }

      // Merge basic details with current user
      const updatedUser: User = {
        ...currentUser,
        ...details,
      };

      // Add to users database
      const users = storageService.getAllUsers();
      const existingIndex = users.findIndex(
        u => u.phone === currentUser.phone && u.role === currentUser.role
      );

      if (existingIndex >= 0) {
        users[existingIndex] = updatedUser;
      } else {
        users.push(updatedUser);
      }

      storageService.setAllUsers(users);
      storageService.setCurrentUser(updatedUser);
      storageService.setBasicDetails(details);

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error('Complete basic details error:', error);
      return {
        success: false,
        error: 'An error occurred while saving details',
      };
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    storageService.clearAuth();
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    return storageService.getCurrentUser();
  }

  /**
   * Update current user
   */
  async updateUser(updates: Partial<User>): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const currentUser = storageService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'No user found',
        };
      }

      const updatedUser = {
        ...currentUser,
        ...updates,
      };

      // Update in users database
      const users = storageService.getAllUsers();
      const index = users.findIndex(
        u => u.phone === currentUser.phone && u.role === currentUser.role
      );

      if (index >= 0) {
        users[index] = updatedUser;
        storageService.setAllUsers(users);
      }

      storageService.setCurrentUser(updatedUser);

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: 'An error occurred while updating user',
      };
    }
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
    return storageService.getRole();
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const currentUser = storageService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'No user found',
        };
      }

      if (currentUser.password && currentUser.password !== oldPassword) {
        return {
          success: false,
          error: 'Incorrect current password',
        };
      }

      await this.updateUser({ password: newPassword });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'An error occurred while changing password',
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
