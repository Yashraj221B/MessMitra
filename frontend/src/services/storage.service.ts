// Storage service for centralized localStorage operations

import { STORAGE_KEYS } from '../constants';
import type { User, Role } from '../types';

class StorageService {
  // Generic get method
  private get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }

  // Generic set method
  private set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }

  // Generic remove method
  private remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }

  // Auth methods
  isAuthenticated(): boolean {
    return this.get<string>(STORAGE_KEYS.AUTH) === 'true';
  }

  setAuthenticated(value: boolean): boolean {
    return this.set(STORAGE_KEYS.AUTH, value.toString());
  }

  clearAuth(): boolean {
    this.remove(STORAGE_KEYS.AUTH);
    this.remove(STORAGE_KEYS.CURRENT_USER);
    this.remove(STORAGE_KEYS.ROLE);
    this.remove(STORAGE_KEYS.BASIC_DETAILS);
    return true;
  }

  // Role methods
  getRole(): Role | null {
    return this.get<Role>(STORAGE_KEYS.ROLE);
  }

  setRole(role: Role): boolean {
    return this.set(STORAGE_KEYS.ROLE, role);
  }

  // User methods
  getCurrentUser(): User | null {
    return this.get<User>(STORAGE_KEYS.CURRENT_USER);
  }

  setCurrentUser(user: User): boolean {
    return this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Users database
  getAllUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS_DB) || [];
  }

  setAllUsers(users: User[]): boolean {
    return this.set(STORAGE_KEYS.USERS_DB, users);
  }

  // Basic details
  getBasicDetails(): any {
    return this.get(STORAGE_KEYS.BASIC_DETAILS);
  }

  setBasicDetails(details: any): boolean {
    return this.set(STORAGE_KEYS.BASIC_DETAILS, details);
  }

  // Language
  getLanguage(): string {
    return this.get<string>(STORAGE_KEYS.LANGUAGE) || 'english';
  }

  setLanguage(language: string): boolean {
    return this.set(STORAGE_KEYS.LANGUAGE, language);
  }

  // Notifications
  getNotifications(): any[] {
    return this.get<any[]>(STORAGE_KEYS.NOTIFICATIONS) || [];
  }

  setNotifications(notifications: any[]): boolean {
    return this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  // Leave requests
  getLeaveRequests(): any[] {
    return this.get<any[]>(STORAGE_KEYS.LEAVE_REQUESTS) || [];
  }

  setLeaveRequests(requests: any[]): boolean {
    return this.set(STORAGE_KEYS.LEAVE_REQUESTS, requests);
  }

  // Menu data
  getMenuData(): any {
    return this.get(STORAGE_KEYS.MENU_DATA);
  }

  setMenuData(data: any): boolean {
    return this.set(STORAGE_KEYS.MENU_DATA, data);
  }

  // Attendance data
  getAttendanceData(): any[] {
    return this.get<any[]>(STORAGE_KEYS.ATTENDANCE_DATA) || [];
  }

  setAttendanceData(data: any[]): boolean {
    return this.set(STORAGE_KEYS.ATTENDANCE_DATA, data);
  }

  // Payment data
  getPaymentData(): any[] {
    return this.get<any[]>(STORAGE_KEYS.PAYMENT_DATA) || [];
  }

  setPaymentData(data: any[]): boolean {
    return this.set(STORAGE_KEYS.PAYMENT_DATA, data);
  }

  // Clear all app data
  clearAll(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing all storage:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;
