// API endpoint constants

const API_VERSION = '/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_VERSION}/auth/register`,
    LOGIN: `${API_VERSION}/auth/login`,
    LOGOUT: `${API_VERSION}/auth/logout`,
    REFRESH_TOKEN: `${API_VERSION}/auth/refresh`,
  },

  // User Management
  USERS: {
    GET_PROFILE: `${API_VERSION}/users/profile`,
    UPDATE_PROFILE: `${API_VERSION}/users/profile`,
    CHANGE_PASSWORD: `${API_VERSION}/users/password`,
    GET_ALL: `${API_VERSION}/users`,
  },

  // Mess Management
  MESS: {
    CREATE: `${API_VERSION}/messes`,
    GET_ALL: `${API_VERSION}/messes`,
    GET_BY_ID: (messId: string) => `${API_VERSION}/messes/${messId}`,
    UPDATE: (messId: string) => `${API_VERSION}/messes/${messId}`,
    DELETE: (messId: string) => `${API_VERSION}/messes/${messId}`,
    REQUEST_JOIN: `${API_VERSION}/messes/join`,
    REGENERATE_QR: (messId: string) => `${API_VERSION}/messes/${messId}/qr-code`,
    GET_MEMBERS: (messId: string) => `${API_VERSION}/messes/${messId}/members`,
    UPDATE_MEMBER_STATUS: (messId: string, memberId: string) => `${API_VERSION}/messes/${messId}/members/${memberId}/status`,
  },

  // Menu Management
  MENU: {
    CREATE: (messId: string) => `${API_VERSION}/menus/${messId}`,
    GET_BY_ID: (menuId: string) => `${API_VERSION}/menus/${menuId}`,
    GET_BY_DATE: (messId: string) => `${API_VERSION}/menus/${messId}/date`,
    GET_WEEKLY: (messId: string) => `${API_VERSION}/menus/${messId}/weekly`,
    GET_MONTHLY: (messId: string) => `${API_VERSION}/menus/${messId}/monthly`,
    UPDATE: (menuId: string) => `${API_VERSION}/menus/${menuId}`,
    DELETE: (menuId: string) => `${API_VERSION}/menus/${menuId}`,
  },

  // Attendance
  ATTENDANCE: {
    MARK: `${API_VERSION}/attendance`,
    GET_BY_ID: (attendanceId: string) => `${API_VERSION}/attendance/${attendanceId}`,
    GET_REPORT: (messId: string) => `${API_VERSION}/attendance/mess/${messId}/report`,
    GET_MEMBER_ATTENDANCE: (messId: string, memberId: string) => `${API_VERSION}/attendance/mess/${messId}/member/${memberId}`,
    GET_STATS: (messId: string) => `${API_VERSION}/attendance/mess/${messId}/stats`,
  },

  // Leave Management
  LEAVE: {
    CREATE: (messId: string) => `${API_VERSION}/leaves/${messId}`,
    GET_MY_LEAVES: `${API_VERSION}/leaves/my-leaves`,
    GET_BY_ID: (leaveId: string) => `${API_VERSION}/leaves/${leaveId}`,
    GET_MESS_LEAVES: (messId: string) => `${API_VERSION}/leaves/${messId}/all`,
    GET_STATS: (messId: string) => `${API_VERSION}/leaves/${messId}/stats`,
    GET_MEMBER_LEAVES: (memberId: string) => `${API_VERSION}/leaves/member/${memberId}`,
    UPDATE_STATUS: (leaveId: string) => `${API_VERSION}/leaves/${leaveId}/status`,
    CANCEL: (leaveId: string) => `${API_VERSION}/leaves/${leaveId}/cancel`,
  },

  // Payments
  PAYMENTS: {
    CREATE: `${API_VERSION}/payments`,
    RECORD_PAYMENT: (paymentId: string) => `${API_VERSION}/payments/${paymentId}/record`,
    GET_BY_ID: (paymentId: string) => `${API_VERSION}/payments/${paymentId}`,
    GET_MESS_PAYMENTS: (messId: string) => `${API_VERSION}/payments/mess/${messId}`,
    GET_OVERDUE: (messId: string) => `${API_VERSION}/payments/mess/${messId}/overdue`,
    GET_STATS: (messId: string) => `${API_VERSION}/payments/mess/${messId}/stats`,
    GET_MEMBER_PAYMENTS: (memberId: string) => `${API_VERSION}/payments/member/${memberId}`,
  },

  // Announcements
  ANNOUNCEMENTS: {
    CREATE: `${API_VERSION}/announcements`,
    GET_BY_ID: (announcementId: string) => `${API_VERSION}/announcements/${announcementId}`,
    GET_MESS_ANNOUNCEMENTS: (messId: string) => `${API_VERSION}/announcements/mess/${messId}`,
    UPDATE: (announcementId: string) => `${API_VERSION}/announcements/${announcementId}`,
    DELETE: (announcementId: string) => `${API_VERSION}/announcements/${announcementId}`,
  },

  // Feedback & Ratings
  FEEDBACK: {
    CREATE: `${API_VERSION}/feedback`,
    GET_BY_ID: (feedbackId: string) => `${API_VERSION}/feedback/${feedbackId}`,
    GET_MY_FEEDBACK: `${API_VERSION}/feedback/my-feedback`,
    GET_MESS_FEEDBACK: (messId: string) => `${API_VERSION}/feedback/mess/${messId}`,
    GET_STATS: (messId: string) => `${API_VERSION}/feedback/mess/${messId}/stats`,
    GET_FOOD_RATINGS: (messId: string) => `${API_VERSION}/feedback/mess/${messId}/food-ratings`,
  },

  // Notifications
  NOTIFICATIONS: {
    GET_USER_NOTIFICATIONS: `${API_VERSION}/notifications`,
    GET_UNREAD_COUNT: `${API_VERSION}/notifications/unread-count`,
    MARK_READ: (notificationId: string) => `${API_VERSION}/notifications/${notificationId}/read`,
    MARK_ALL_READ: `${API_VERSION}/notifications/read-all`,
    DELETE: (notificationId: string) => `${API_VERSION}/notifications/${notificationId}`,
  },

  // Admin Management
  ADMIN: {
    // Statistics
    GET_STATS: `${API_VERSION}/admin/stats`,
    
    // Mess Management
    GET_MESSES: `${API_VERSION}/admin/messes`,
    CREATE_MESS: `${API_VERSION}/admin/messes`,
    APPROVE_MESS: (messId: string) => `${API_VERSION}/admin/messes/${messId}/approve`,
    SUSPEND_MESS: (messId: string) => `${API_VERSION}/admin/messes/${messId}/suspend`,
    ACTIVATE_MESS: (messId: string) => `${API_VERSION}/admin/messes/${messId}/activate`,
    
    // User Management
    GET_USERS: `${API_VERSION}/admin/users`,
    GET_MANAGERS: `${API_VERSION}/admin/managers`,
    CREATE_USER: `${API_VERSION}/admin/users`,
    GET_USER_BY_ID: (userId: string) => `${API_VERSION}/admin/users/${userId}`,
    UPDATE_USER: (userId: string) => `${API_VERSION}/admin/users/${userId}`,
    DELETE_USER: (userId: string) => `${API_VERSION}/admin/users/${userId}`,
    SUSPEND_USER: (userId: string) => `${API_VERSION}/admin/users/${userId}/suspend`,
    ACTIVATE_USER: (userId: string) => `${API_VERSION}/admin/users/${userId}/activate`,
    CHANGE_USER_ROLE: (userId: string) => `${API_VERSION}/admin/users/${userId}/role`,
  },
} as const;

export default API_ENDPOINTS;
