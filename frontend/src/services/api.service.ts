import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { storageService } from './storage.service';

// Use empty string for relative URLs (works with Vite proxy during dev)
// In production, set VITE_API_URL to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from storageService
    const token = storageService.getAuthToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = storageService.getRefreshToken();
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });

          const { accessToken: newToken, refreshToken: newRefreshToken } = response.data.data;

          // Update tokens
          storageService.setAuthToken(newToken);
          storageService.setRefreshToken(newRefreshToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        storageService.clearAuth();
        
        // Redirect to login
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = 
      (error.response?.data as any)?.message || 
      error.message || 
      'An unexpected error occurred';

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

// Generic API methods
export const api = {
  get: <T = any>(url: string, params?: any) => 
    apiClient.get<ApiResponse<T>>(url, { params }).then(res => res.data),
  
  post: <T = any>(url: string, data?: any) => 
    apiClient.post<ApiResponse<T>>(url, data).then(res => res.data),
  
  put: <T = any>(url: string, data?: any) => 
    apiClient.put<ApiResponse<T>>(url, data).then(res => res.data),
  
  patch: <T = any>(url: string, data?: any) => 
    apiClient.patch<ApiResponse<T>>(url, data).then(res => res.data),
  
  delete: <T = any>(url: string) => 
    apiClient.delete<ApiResponse<T>>(url).then(res => res.data),
};

export default apiClient;
