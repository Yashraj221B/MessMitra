// API endpoint constants (for future backend integration)

const API_VERSION = '/api/v1';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_VERSION}/auth/login`,
    LOGOUT: `${API_VERSION}/auth/logout`,
    VERIFY_OTP: `${API_VERSION}/auth/verify-otp`,
    REFRESH_TOKEN: `${API_VERSION}/auth/refresh`,
    CHANGE_PASSWORD: `${API_VERSION}/auth/change-password`,
  },

  // User Management
  USERS: {
    GET_PROFILE: `${API_VERSION}/users/profile`,
    UPDATE_PROFILE: `${API_VERSION}/users/profile`,
    GET_ALL: `${API_VERSION}/users`,
    GET_BY_ID: (id: string) => `${API_VERSION}/users/${id}`,
    UPDATE: (id: string) => `${API_VERSION}/users/${id}`,
    DELETE: (id: string) => `${API_VERSION}/users/${id}`,
  },

  // Menu Management
  MENU: {
    GET_ALL: `${API_VERSION}/menu`,
    GET_BY_DATE: (date: string) => `${API_VERSION}/menu/${date}`,
    CREATE: `${API_VERSION}/menu`,
    UPDATE: (id: string) => `${API_VERSION}/menu/${id}`,
    DELETE: (id: string) => `${API_VERSION}/menu/${id}`,
    COPY: `${API_VERSION}/menu/copy`,
  },

  // Attendance
  ATTENDANCE: {
    GET_ALL: `${API_VERSION}/attendance`,
    GET_BY_DATE: (date: string) => `${API_VERSION}/attendance/${date}`,
    MARK: `${API_VERSION}/attendance/mark`,
    SCAN_QR: `${API_VERSION}/attendance/scan`,
    GET_STATS: `${API_VERSION}/attendance/stats`,
  },

  // Leave Management
  LEAVE: {
    GET_ALL: `${API_VERSION}/leave`,
    GET_BY_ID: (id: string) => `${API_VERSION}/leave/${id}`,
    CREATE: `${API_VERSION}/leave`,
    UPDATE: (id: string) => `${API_VERSION}/leave/${id}`,
    APPROVE: (id: string) => `${API_VERSION}/leave/${id}/approve`,
    REJECT: (id: string) => `${API_VERSION}/leave/${id}/reject`,
    DELETE: (id: string) => `${API_VERSION}/leave/${id}`,
  },

  // Payments
  PAYMENTS: {
    GET_ALL: `${API_VERSION}/payments`,
    GET_BY_ID: (id: string) => `${API_VERSION}/payments/${id}`,
    CREATE: `${API_VERSION}/payments`,
    UPDATE: (id: string) => `${API_VERSION}/payments/${id}`,
    MARK_PAID: (id: string) => `${API_VERSION}/payments/${id}/mark-paid`,
    SEND_REMINDER: (id: string) => `${API_VERSION}/payments/${id}/reminder`,
  },

  // Announcements
  ANNOUNCEMENTS: {
    GET_ALL: `${API_VERSION}/announcements`,
    CREATE: `${API_VERSION}/announcements`,
    UPDATE: (id: string) => `${API_VERSION}/announcements/${id}`,
    DELETE: (id: string) => `${API_VERSION}/announcements/${id}`,
  },

  // Feedback & Ratings
  FEEDBACK: {
    GET_ALL: `${API_VERSION}/feedback`,
    CREATE: `${API_VERSION}/feedback`,
    GET_STATS: `${API_VERSION}/feedback/stats`,
  },

  // Notifications
  NOTIFICATIONS: {
    GET_ALL: `${API_VERSION}/notifications`,
    MARK_READ: (id: string) => `${API_VERSION}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_VERSION}/notifications/read-all`,
    DELETE: (id: string) => `${API_VERSION}/notifications/${id}`,
  },

  // Reports
  REPORTS: {
    DASHBOARD: `${API_VERSION}/reports/dashboard`,
    ATTENDANCE: `${API_VERSION}/reports/attendance`,
    PAYMENTS: `${API_VERSION}/reports/payments`,
    EXPORT: `${API_VERSION}/reports/export`,
  },
} as const;

export default API_ENDPOINTS;
