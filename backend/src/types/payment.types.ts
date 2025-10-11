export interface CreatePaymentDTO {
  messId: string;
  memberId: string;
  month: number; // 1-12
  year: number;
  amount: number;
  dueDate?: string; // YYYY-MM-DD
}

export interface RecordPaymentDTO {
  paidAmount: number;
  paymentMethod: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'online';
  transactionId?: string;
  upiId?: string;
  receiptNumber?: string;
  receiptUrl?: string;
}

export interface PaymentResponse {
  id: string;
  messId: string;
  memberId: string;
  memberName?: string;
  month: number;
  year: number;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  upiId?: string;
  receiptNumber?: string;
  receiptUrl?: string;
  dueDate?: Date;
  paidAt?: Date;
  lateFee?: number;
  lateFeeApplied: boolean;
  daysOverdue: number;
  remindersSent: number;
  lastReminderAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
