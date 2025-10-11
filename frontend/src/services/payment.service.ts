import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface Payment {
  id: string;
  messId: string;
  memberId: string;
  month: number;
  year: number;
  amount: number;
  paidAmount: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'upi' | 'bank_transfer' | 'card';
  transactionId?: string;
  member?: {
    id: string;
    name: string;
    phone: string;
    room?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStats {
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  overduePayments: number;
  collectionRate: number;
}

class PaymentService {
  /**
   * Create a new payment record for a member
   */
  async createPayment(data: {
    messId: string;
    memberId: string;
    month: number;
    year: number;
    amount: number;
    dueDate?: string;
  }): Promise<Payment> {
    const response = await api.post(API_ENDPOINTS.PAYMENTS.CREATE, data);
    return response.data.data;
  }

  /**
   * Record a payment (mark as paid)
   */
  async recordPayment(
    paymentId: string,
    data: {
      paidAmount: number;
      paymentMethod: 'cash' | 'upi' | 'bank_transfer' | 'card';
      transactionId?: string;
      paidDate?: string;
    }
  ): Promise<Payment> {
    const response = await api.put(API_ENDPOINTS.PAYMENTS.RECORD_PAYMENT(paymentId), data);
    return response.data.data;
  }

  /**
   * Get all payments for a mess
   */
  async getMessPayments(
    messId: string,
    filters?: {
      status?: 'pending' | 'partial' | 'paid' | 'overdue';
      month?: number;
      year?: number;
    }
  ): Promise<Payment[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());
    
    const response = await api.get(`${API_ENDPOINTS.PAYMENTS.GET_MESS_PAYMENTS(messId)}?${params.toString()}`);
    return response.data.data;
  }

  /**
   * Get overdue payments for a mess
   */
  async getOverduePayments(messId: string): Promise<Payment[]> {
    const response = await api.get(API_ENDPOINTS.PAYMENTS.GET_OVERDUE(messId));
    return response.data.data;
  }

  /**
   * Get payment statistics for a mess
   */
  async getPaymentStats(
    messId: string,
    month?: number,
    year?: number
  ): Promise<PaymentStats> {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    
    const response = await api.get(`${API_ENDPOINTS.PAYMENTS.GET_STATS(messId)}?${params.toString()}`);
    return response.data.data;
  }

  /**
   * Get member's payment history
   */
  async getMemberPayments(memberId: string): Promise<Payment[]> {
    const response = await api.get(API_ENDPOINTS.PAYMENTS.GET_MEMBER_PAYMENTS(memberId));
    return response.data.data;
  }

  /**
   * Get single payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    const response = await api.get(API_ENDPOINTS.PAYMENTS.GET_BY_ID(paymentId));
    return response.data.data;
  }
}

export const paymentService = new PaymentService();
