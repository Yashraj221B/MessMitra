// Payment-related type definitions

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  month: string;
  status: PaymentStatus;
  paidDate?: string;
  dueDate: string;
}

export interface PaymentHistory {
  payments: Payment[];
  totalPaid: number;
  totalPending: number;
}
