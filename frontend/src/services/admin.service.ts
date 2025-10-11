import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

interface PlatformStats {
  totalMesses: number;
  activeMesses: number;
  pendingMesses: number;
  suspendedMesses: number;
  totalManagers: number;
  totalMembers: number;
  activeMembers: number;
  totalUsers: number;
  totalRevenue: number;
  pendingPayments: number;
  averageRating: number;
  totalFeedbacks: number;
}

interface Mess {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  description?: string | null;
  capacity: number;
  currentMembers: number;
  monthlyFee: number;
  status: 'active' | 'suspended' | 'pending';
  ownerName: string;
  ownerPhone: string;
  createdAt: Date;
}

interface AppUser {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: 'admin' | 'manager' | 'member';
  messId: string | null;
  messName?: string | null;
  joinStatus?: string | null;
  status: 'active' | 'suspended';
  createdAt: Date;
  lastLogin?: Date | null;
}

interface CreateMessInput {
  name: string;
  ownerId: string;
  address: string;
  capacity: number;
  monthlyFee: number;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  securityDeposit?: number | null;
}

interface CreateUserInput {
  name: string;
  phone: string;
  email?: string | null;
  password: string;
  role: 'manager' | 'member';
  messId?: string | null;
}

class AdminService {
  /**
   * Get platform-wide statistics
   */
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_STATS);
    return response.data;
  }

  /**
   * Get all messes
   */
  async getMesses(): Promise<Mess[]> {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_MESSES);
    return response.data;
  }

  /**
   * Approve a pending mess
   */
  async approveMess(messId: string): Promise<void> {
    await api.post(API_ENDPOINTS.ADMIN.APPROVE_MESS(messId));
  }

  /**
   * Suspend an active mess
   */
  async suspendMess(messId: string): Promise<void> {
    await api.post(API_ENDPOINTS.ADMIN.SUSPEND_MESS(messId));
  }

  /**
   * Activate a suspended mess
   */
  async activateMess(messId: string): Promise<void> {
    await api.post(API_ENDPOINTS.ADMIN.ACTIVATE_MESS(messId));
  }

  /**
   * Get all users
   */
  async getUsers(): Promise<AppUser[]> {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_USERS);
    return response.data;
  }

  /**
   * Get all managers
   */
  async getManagers(): Promise<AppUser[]> {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_MANAGERS);
    return response.data;
  }

  /**
   * Get user details by ID
   */
  async getUserById(userId: string): Promise<AppUser> {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_USER_BY_ID(userId));
    return response.data;
  }

  /**
   * Suspend a user
   */
  async suspendUser(userId: string): Promise<void> {
    await api.post(API_ENDPOINTS.ADMIN.SUSPEND_USER(userId));
  }

  /**
   * Activate a suspended user
   */
  async activateUser(userId: string): Promise<void> {
    await api.post(API_ENDPOINTS.ADMIN.ACTIVATE_USER(userId));
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.ADMIN.DELETE_USER(userId));
  }

  /**
   * Change user role
   */
  async changeUserRole(userId: string, role: 'admin' | 'manager' | 'member'): Promise<void> {
    await api.patch(API_ENDPOINTS.ADMIN.CHANGE_USER_ROLE(userId), { role });
  }

  /**
   * Update user details (name, email)
   */
  async updateUser(userId: string, data: { name?: string; email?: string }): Promise<void> {
    await api.patch(API_ENDPOINTS.ADMIN.UPDATE_USER(userId), data);
  }

  /**
   * Create a new mess
   */
  async createMess(data: CreateMessInput): Promise<Mess> {
    const response = await api.post(API_ENDPOINTS.ADMIN.CREATE_MESS, data);
    return response.data;
  }

  /**
   * Create a new user (manager/member)
   */
  async createUser(data: CreateUserInput): Promise<AppUser> {
    const response = await api.post(API_ENDPOINTS.ADMIN.CREATE_USER, data);
    return response.data;
  }
}

export const adminService = new AdminService();
export type { PlatformStats, Mess, AppUser, CreateMessInput, CreateUserInput };
