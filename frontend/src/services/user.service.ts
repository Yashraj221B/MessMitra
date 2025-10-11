// User API service

import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  messId?: string;
  joinStatus?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>(API_ENDPOINTS.USERS.GET_PROFILE);
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await api.put<UserProfile>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data);
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const response = await api.get<UserProfile[]>(API_ENDPOINTS.USERS.GET_ALL);
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
