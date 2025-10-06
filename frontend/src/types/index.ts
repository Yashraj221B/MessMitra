export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subscriptionEndDate: string;
  subscriptionStatus: 'active' | 'expiring-soon' | 'expired';
  daysLeft: number;
  joinDate: string;
  onLeave?: boolean;
  leaveStartDate?: string;
  leaveEndDate?: string;
  enrollmentStatus?: 'pending' | 'approved' | 'rejected';
}

export interface PendingMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  enrollmentDate: string;
  status: 'pending';
}

export interface MenuItem {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string;
  items: string[];
  description?: string;
}

export interface QRCodeData {
  memberId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: string;
  lunch: boolean;
  dinner: boolean;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  method: 'cash' | 'upi' | 'card' | 'bank-transfer';
  months: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface Leave {
  id: string;
  memberId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface User {
  name: string;
  email: string;
  messName: string;
  phone: string;
}
