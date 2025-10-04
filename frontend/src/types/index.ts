export interface Member {
  id: string;
  name: string;
  phone: string;
  subscriptionEndDate: string;
  subscriptionStatus: 'active' | 'expiring-soon' | 'expired';
  daysLeft: number;
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: string;
  lunch: boolean;
  dinner: boolean;
}

export interface User {
  name: string;
  email: string;
  messName: string;
  phone: string;
}
