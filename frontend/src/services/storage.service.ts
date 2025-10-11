// Storage service for centralized localStorage operations
// Only handles JWT tokens and UI preferences - all data comes from backend APIs

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token', 
  USER_ROLE: 'user_role',
  LANGUAGE: 'language',
} as const;

class StorageService {
  // Auth token methods
  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  removeAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Refresh token methods
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Role methods (for UI navigation only)
  getUserRole(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  }

  setUserRole(role: string): void {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  }

  removeUserRole(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  }

  // Language preference
  getLanguage(): string {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'english';
  }

  setLanguage(language: string): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  // Auth helpers
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Clear all auth data on logout
  clearAuth(): void {
    this.removeAuthToken();
    this.removeRefreshToken();
    this.removeUserRole();
  }

  // Clear all app data
  clearAll(): void {
    localStorage.clear();
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;
