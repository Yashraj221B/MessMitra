/**
 * API Service Layer
 * 
 * This file contains all API calls for the application.
 * Currently using mock implementations with setTimeout to simulate network requests.
 * 
 * When connecting to a real backend:
 * 1. Replace mock implementations with actual API calls (axios/fetch)
 * 2. Update API_BASE_URL to point to your backend server
 * 3. Add proper error handling and response parsing
 * 4. No changes needed in UI components!
 */

// Configuration
// When connecting to real backend, uncomment and use this:
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const MOCK_DELAY = 1000; // Simulated network delay in ms

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface MemberLoginCredentials {
  phone: string;
  password: string;
}

interface EnrollmentData {
  name: string;
  phone: string;
  email: string;
  address: string;
  password: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Manager Authentication APIs
 */
export const managerAuth = {
  /**
   * Manager login
   * @future Replace with: axios.post(`${API_BASE_URL}/auth/manager/login`, credentials)
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
    await delay(MOCK_DELAY);
    
    // Mock validation
    if (credentials.email && credentials.password) {
      return {
        success: true,
        data: {
          user: {
            id: '1',
            email: credentials.email,
            name: 'Manager',
            role: 'manager'
          },
          token: 'mock-jwt-token'
        }
      };
    }
    
    throw new Error('Invalid credentials');
  },

  /**
   * Manager logout
   * @future Replace with: axios.post(`${API_BASE_URL}/auth/logout`)
   */
  logout: async (): Promise<ApiResponse> => {
    await delay(500);
    return { success: true };
  }
};

/**
 * Member Authentication APIs
 */
export const memberAuth = {
  /**
   * Member login
   * @future Replace with: axios.post(`${API_BASE_URL}/auth/member/login`, credentials)
   */
  login: async (credentials: MemberLoginCredentials): Promise<ApiResponse> => {
    await delay(MOCK_DELAY);
    
    // Mock validation
    if (credentials.phone && credentials.password) {
      return {
        success: true,
        data: {
          user: {
            id: '101',
            phone: credentials.phone,
            name: 'Member',
            role: 'member'
          },
          token: 'mock-jwt-token-member'
        }
      };
    }
    
    throw new Error('Invalid credentials');
  },

  /**
   * Member logout
   * @future Replace with: axios.post(`${API_BASE_URL}/auth/member/logout`)
   */
  logout: async (): Promise<ApiResponse> => {
    await delay(500);
    return { success: true };
  }
};

/**
 * Enrollment APIs
 */
export const enrollment = {
  /**
   * Submit new member enrollment
   * @future Replace with: axios.post(`${API_BASE_URL}/enrollment/submit`, data)
   */
  submit: async (data: EnrollmentData): Promise<ApiResponse> => {
    await delay(MOCK_DELAY);
    
    // Mock validation
    if (data.name && data.phone && data.email && data.password) {
      return {
        success: true,
        data: {
          enrollmentId: `ENR-${Date.now()}`,
          status: 'pending',
          submittedAt: new Date().toISOString()
        },
        message: 'Enrollment submitted successfully'
      };
    }
    
    throw new Error('Invalid enrollment data');
  }
};

/**
 * Member APIs
 */
export const members = {
  /**
   * Get member profile
   * @future Replace with: axios.get(`${API_BASE_URL}/members/${memberId}`)
   */
  getProfile: async (memberId: string): Promise<ApiResponse> => {
    await delay(500);
    return {
      success: true,
      data: {
        id: memberId,
        name: 'Member Name',
        phone: '9876543210',
        email: 'member@example.com',
        address: 'Sample Address',
        status: 'active',
        joinedDate: '2024-01-01'
      }
    };
  },

  /**
   * Get all members
   * @future Replace with: axios.get(`${API_BASE_URL}/members`)
   */
  getAll: async (): Promise<ApiResponse> => {
    await delay(500);
    return {
      success: true,
      data: [] // Will be populated from mockData
    };
  }
};

/**
 * Attendance APIs
 */
export const attendance = {
  /**
   * Mark attendance
   * @future Replace with: axios.post(`${API_BASE_URL}/attendance/mark`, data)
   */
  mark: async (memberId: string, date: string): Promise<ApiResponse> => {
    await delay(500);
    return {
      success: true,
      data: {
        attendanceId: `ATT-${Date.now()}`,
        memberId,
        date,
        markedAt: new Date().toISOString()
      },
      message: 'Attendance marked successfully'
    };
  },

  /**
   * Get attendance records
   * @future Replace with: axios.get(`${API_BASE_URL}/attendance?start=${startDate}&end=${endDate}`)
   */
  getRecords: async (_startDate?: string, _endDate?: string): Promise<ApiResponse> => {
    await delay(500);
    // In production, these params will be used in the API call URL
    return {
      success: true,
      data: [] // Will be populated from mockData
    };
  }
};

// Export default object with all API groups
export default {
  managerAuth,
  memberAuth,
  enrollment,
  members,
  attendance
};
