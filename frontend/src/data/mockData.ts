import type { Member, AttendanceRecord, User } from '../types';

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
