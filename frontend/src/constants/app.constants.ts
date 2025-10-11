// Application-wide constants

export const APP_NAME = 'MessMitra';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Complete Mess Management Solution';

// Screen/Route Names
export const ADMIN_SCREENS = {
  DASHBOARD: 'dashboard',
  MENU_PLANNER: 'menu-planner',
  ATTENDANCE: 'attendance',
  BILLING: 'billing',
  ANNOUNCEMENTS: 'announcements',
  MEMBERS: 'members',
  RATINGS: 'ratings',
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications',
} as const;

export const STUDENT_SCREENS = {
  HOME: 'home',
  LEAVE: 'leave',
  QR_CODE: 'qr-code',
  FEEDBACK: 'feedback',
  PAYMENT: 'payment',
  MENU_CALENDAR: 'menu-calendar',
  FOOD_RATING: 'food-rating',
  SETTINGS: 'settings',
} as const;

// Roles
export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

// Meal Types
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
} as const;

// Meal Times
export const MEAL_TIMES = {
  BREAKFAST: '7:00 - 9:00 AM',
  LUNCH: '12:00 - 2:00 PM',
  DINNER: '7:00 - 9:00 PM',
} as const;

// Status Types
export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LEAVE: 'leave',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Validation Rules
export const VALIDATION = {
  PHONE_LENGTH: 10,
  MIN_PASSWORD_LENGTH: 4,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_REASON_LENGTH: 500,
  MAX_FEEDBACK_LENGTH: 1000,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  TIMESTAMP: 'YYYY-MM-DD HH:mm:ss',
} as const;

// Languages
export const LANGUAGES = {
  ENGLISH: 'english',
  HINDI: 'hindi',
  MARATHI: 'marathi',
} as const;

export const LANGUAGE_OPTIONS = [
  { value: LANGUAGES.ENGLISH, label: 'English', emoji: '🇬🇧' },
  { value: LANGUAGES.HINDI, label: 'हिंदी', emoji: '🇮🇳' },
  { value: LANGUAGES.MARATHI, label: 'मराठी', emoji: '🚩' },
] as const;
