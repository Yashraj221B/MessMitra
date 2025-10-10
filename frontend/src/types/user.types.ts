// User-related type definitions

export type Role = 'manager' | 'member';

export interface BaseUser {
  phone: string;
  role: Role;
  name: string;
  password?: string;
}

export interface ManagerUser extends BaseUser {
  role: 'manager';
  messName?: string;
  address?: string;
}

export interface MemberUser extends BaseUser {
  role: 'member';
  room?: string;
  memberId?: string;
  subscriptionEndDate?: string;
  daysLeft?: number;
  monthlyFee?: number;
}

export type User = ManagerUser | MemberUser;

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
}

export interface LoginCredentials {
  phone: string;
  password: string;
  role: Role;
}

export interface BasicDetailsForm {
  name: string;
  // Manager fields (mess owner/operator)
  messName?: string;
  address?: string;
  // Member fields (mess subscriber)
  room?: string;
  memberId?: string;
}
