// Central export for all type definitions

export type * from './user.types';
export type * from './menu.types';
export type * from './payment.types';
export type * from './attendance.types';
export type * from './leave.types';
export type * from './notification.types';

// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}
