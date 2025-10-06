import type { Member, AttendanceRecord, User, Payment, Leave, PendingMember, MenuItem } from '../types';

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    subscriptionEndDate: '2025-10-08',
    subscriptionStatus: 'expiring-soon',
    daysLeft: 4,
    joinDate: '2025-07-10',
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 98765 43211',
    subscriptionEndDate: '2025-10-20',
    subscriptionStatus: 'active',
    daysLeft: 16,
    joinDate: '2025-07-20',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    phone: '+91 98765 43212',
    subscriptionEndDate: '2025-10-06',
    subscriptionStatus: 'expiring-soon',
    daysLeft: 2,
    joinDate: '2025-08-06',
  },
  {
    id: '4',
    name: 'Sneha Desai',
    phone: '+91 98765 43213',
    subscriptionEndDate: '2025-11-15',
    subscriptionStatus: 'active',
    daysLeft: 42,
    joinDate: '2025-08-15',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    phone: '+91 98765 43214',
    subscriptionEndDate: '2025-10-02',
    subscriptionStatus: 'expired',
    daysLeft: -2,
    joinDate: '2025-07-02',
  },
  {
    id: '6',
    name: 'Anjali Reddy',
    phone: '+91 98765 43215',
    subscriptionEndDate: '2025-10-25',
    subscriptionStatus: 'active',
    daysLeft: 21,
    joinDate: '2025-08-25',
  },
  {
    id: '7',
    name: 'Karthik Iyer',
    phone: '+91 98765 43216',
    subscriptionEndDate: '2025-10-07',
    subscriptionStatus: 'expiring-soon',
    daysLeft: 3,
    joinDate: '2025-07-07',
  },
  {
    id: '8',
    name: 'Meera Joshi',
    phone: '+91 98765 43217',
    subscriptionEndDate: '2025-11-01',
    subscriptionStatus: 'active',
    daysLeft: 28,
    joinDate: '2025-08-01',
  },
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    memberId: '1',
    date: '2025-10-04',
    lunch: true,
    dinner: true,
  },
  {
    id: '2',
    memberId: '2',
    date: '2025-10-04',
    lunch: true,
    dinner: false,
  },
  {
    id: '3',
    memberId: '3',
    date: '2025-10-04',
    lunch: false,
    dinner: true,
  },
];

export const mockUser: User = {
  name: 'Rajesh Kulkarni',
  email: 'rajesh@messmitra.com',
  messName: 'Shivaji Mess',
  phone: '+91 98765 00000',
};

export const mockPayments: Payment[] = [
  {
    id: '1',
    memberId: '1',
    amount: 4500,
    date: '2025-07-10',
    method: 'upi',
    months: 3,
    status: 'completed',
  },
  {
    id: '2',
    memberId: '2',
    amount: 4500,
    date: '2025-07-20',
    method: 'cash',
    months: 3,
    status: 'completed',
  },
  {
    id: '3',
    memberId: '3',
    amount: 3000,
    date: '2025-08-06',
    method: 'upi',
    months: 2,
    status: 'completed',
  },
  {
    id: '4',
    memberId: '4',
    amount: 6000,
    date: '2025-08-15',
    method: 'bank-transfer',
    months: 4,
    status: 'completed',
  },
  {
    id: '5',
    memberId: '5',
    amount: 4500,
    date: '2025-07-02',
    method: 'cash',
    months: 3,
    status: 'completed',
  },
  {
    id: '6',
    memberId: '6',
    amount: 4500,
    date: '2025-08-25',
    method: 'upi',
    months: 3,
    status: 'completed',
  },
  {
    id: '7',
    memberId: '7',
    amount: 4500,
    date: '2025-07-07',
    method: 'card',
    months: 3,
    status: 'completed',
  },
  {
    id: '8',
    memberId: '8',
    amount: 6000,
    date: '2025-08-01',
    method: 'upi',
    months: 4,
    status: 'completed',
  },
];

export const mockLeaves: Leave[] = [
  {
    id: '1',
    memberId: '2',
    startDate: '2025-10-10',
    endDate: '2025-10-15',
    reason: 'Family function',
    status: 'approved',
  },
  {
    id: '2',
    memberId: '4',
    startDate: '2025-10-20',
    endDate: '2025-10-22',
    reason: 'Out of town',
    status: 'approved',
  },
];

export const mockPendingMembers: PendingMember[] = [
  {
    id: 'pending-1',
    name: 'Arjun Mehta',
    phone: '+91 98765 43220',
    email: 'arjun.mehta@email.com',
    enrollmentDate: '2025-10-05',
    status: 'pending',
  },
  {
    id: 'pending-2',
    name: 'Pooja Sharma',
    phone: '+91 98765 43221',
    email: 'pooja.sharma@email.com',
    enrollmentDate: '2025-10-06',
    status: 'pending',
  },
];

export const mockMenu: MenuItem[] = [
  {
    id: '1',
    mealType: 'breakfast',
    date: '2025-10-06',
    items: ['Poha', 'Tea/Coffee', 'Banana'],
    description: 'Light & healthy breakfast',
  },
  {
    id: '2',
    mealType: 'lunch',
    date: '2025-10-06',
    items: ['Dal Tadka', 'Jeera Rice', 'Roti', 'Mix Veg', 'Salad', 'Curd'],
    description: 'Wholesome lunch thali',
  },
  {
    id: '3',
    mealType: 'dinner',
    date: '2025-10-06',
    items: ['Paneer Butter Masala', 'Roti', 'Rice', 'Dal', 'Pickle'],
    description: 'Delicious dinner',
  },
];
