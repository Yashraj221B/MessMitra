import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreatePaymentDTO, RecordPaymentDTO, PaymentResponse } from '../types/payment.types';
import { generateReceiptNumber } from '../utils/helpers.util';

type ElevatedRequester = {
  role: 'admin' | 'manager';
  userId: string;
  messId?: string;
};

type RequesterContext = ElevatedRequester | {
  role: 'member';
  userId: string;
  messId?: string;
};

// Helper to format payment response
const formatPaymentResponse = (payment: any, memberName?: string): PaymentResponse => ({
  id: payment.id,
  messId: payment.mess_id,
  memberId: payment.member_id,
  memberName: memberName || payment.users?.name || 'Unknown',
  month: payment.month,
  year: payment.year,
  amount: Number(payment.amount),
  paidAmount: payment.paid_amount ? Number(payment.paid_amount) : 0,
  dueDate: payment.due_date as any,
  paidAt: payment.paid_date as any,
  status: payment.status!,
  paymentMethod: payment.payment_method || undefined,
  transactionId: payment.transaction_id || undefined,
  receiptNumber: payment.receipt_number || undefined,
  createdAt: payment.created_at!,
  updatedAt: payment.updated_at!,
  remainingAmount: Number(payment.amount) - (payment.paid_amount ? Number(payment.paid_amount) : 0),
  lateFeeApplied: payment.late_fee ? Number(payment.late_fee) > 0 : false,
  daysOverdue: 0,
  remindersSent: Number(payment.reminders_sent || 0)
});

export class PaymentService {

  async createPayment(data: CreatePaymentDTO, requester: ElevatedRequester): Promise<PaymentResponse> {
    if (requester.role === 'manager') {
      if (!requester.messId || requester.messId !== data.messId) {
        throw new AppError('Managers can only create payments for their own mess', 403);
      }
    }

    // Verify mess and member
    const mess = await prisma.messes.findFirst({
      where: { id: data.messId, is_active: true }
    });
    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    const member = await prisma.users.findFirst({
      where: { id: data.memberId, mess_id: data.messId, join_status: 'approved' }
    });
    if (!member) {
      throw new AppError('Member not found or not approved in this mess', 404);
    }

    // Check if payment already exists for this period
    const existingPayment = await prisma.payments.findFirst({
      where: {
        mess_id: data.messId,
        member_id: data.memberId,
        month: data.month,
        year: data.year
      }
    });

    if (existingPayment) {
      throw new AppError('Payment already exists for this period', 400);
    }

    const payment = await prisma.payments.create({
      data: {
        mess_id: data.messId,
        member_id: data.memberId,
        month: data.month!,
        year: data.year!,
        amount: data.amount!,
        due_date: data.dueDate ? new Date(data.dueDate) : new Date(),
        status: 'pending'
      }
    });

    return {
      id: payment.id,
      messId: payment.mess_id,
      memberId: payment.member_id,
      memberName: member.name,
      month: payment.month,
      year: payment.year,
      amount: Number(payment.amount),
      paidAmount: payment.paid_amount ? Number(payment.paid_amount) : 0,
      dueDate: payment.due_date as any,
      paidAt: payment.paid_date as any,
      status: payment.status!,
      paymentMethod: payment.payment_method || undefined,
      transactionId: payment.transaction_id || undefined,
      receiptNumber: payment.receipt_number || undefined,
      createdAt: payment.created_at!,
      updatedAt: payment.updated_at!,
      remainingAmount: Number(payment.amount) - (payment.paid_amount ? Number(payment.paid_amount) : 0),
      lateFeeApplied: payment.late_fee ? Number(payment.late_fee) > 0 : false,
      daysOverdue: 0,
      remindersSent: 0
    };
  }

  async recordPayment(
    paymentId: string,
    data: RecordPaymentDTO,
    requester: ElevatedRequester
  ): Promise<PaymentResponse> {
    const payment = await prisma.payments.findUnique({
      where: { id: paymentId },
      include: { users: true }
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (requester.role === 'manager') {
      if (!requester.messId || requester.messId !== payment.mess_id) {
        throw new AppError('Managers can only record payments for their mess', 403);
      }
    }

    if (payment.status === 'paid') {
      throw new AppError('Payment already recorded', 400);
    }

    const paidAmount = data.paidAmount!;
    const amount = Number(payment.amount);
    const newStatus = paidAmount >= amount ? 'paid' : 'partial';

    const updated = await prisma.payments.update({
      where: { id: paymentId },
      data: {
        paid_amount: paidAmount,
        paid_date: new Date(),
        payment_method: (data.paymentMethod === 'online' ? 'other' : data.paymentMethod) as any,
        transaction_id: data.transactionId || null,
        receipt_number: data.receiptNumber || generateReceiptNumber(payment.mess_id, payment.month, payment.year),
        status: newStatus
      },
      include: { users: true }
    });

    return {
      id: updated.id,
      messId: updated.mess_id,
      memberId: updated.member_id,
      memberName: updated.users?.name || 'Unknown',
      month: updated.month,
      year: updated.year,
      amount: Number(updated.amount),
      paidAmount: updated.paid_amount ? Number(updated.paid_amount) : 0,
      dueDate: updated.due_date as any,
      paidAt: updated.paid_date as any,
      status: updated.status!,
      paymentMethod: updated.payment_method || undefined,
      transactionId: updated.transaction_id || undefined,
      receiptNumber: updated.receipt_number || undefined,
      createdAt: updated.created_at!,
      updatedAt: updated.updated_at!,
      remainingAmount: Number(updated.amount) - (updated.paid_amount ? Number(updated.paid_amount) : 0),
      lateFeeApplied: updated.late_fee ? Number(updated.late_fee) > 0 : false,
      daysOverdue: 0,
      remindersSent: Number(updated.reminders_sent || 0)
    };
  }

  async getPaymentById(paymentId: string): Promise<PaymentResponse> {
    const payment = await prisma.payments.findUnique({
      where: { id: paymentId },
      include: { users: true }
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    return formatPaymentResponse(payment);
  }

  async getMessPayments(
    messId: string,
    status: string | undefined,
    month: number | undefined,
    year: number | undefined,
    requester: ElevatedRequester
  ): Promise<PaymentResponse[]> {
    if (requester.role === 'manager') {
      if (!requester.messId || requester.messId !== messId) {
        throw new AppError('Managers can only view payments for their mess', 403);
      }
    }

    const whereConditions: any = { mess_id: messId };

    if (status) whereConditions.status = status;
    if (month) whereConditions.month = month;
    if (year) whereConditions.year = year;

    const payments = await prisma.payments.findMany({
      where: whereConditions,
      include: { users: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }, { created_at: 'desc' }]
    });

    return payments.map(payment => formatPaymentResponse(payment));
  }

  async getMemberPayments(
    memberId: string,
    requester: RequesterContext
  ): Promise<PaymentResponse[]> {
    if (requester.role === 'member' && requester.userId !== memberId) {
      throw new AppError('You can only view your own payments', 403);
    }

    if (requester.role === 'manager') {
      if (!requester.messId) {
        throw new AppError('Manager does not have an associated mess', 400);
      }

      const member = await prisma.users.findFirst({
        where: { id: memberId, mess_id: requester.messId }
      });

      if (!member) {
        throw new AppError('You do not have permission to view this member\'s payments', 403);
      }
    }

    const payments = await prisma.payments.findMany({
      where: { member_id: memberId },
      include: { users: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });

    return payments.map(payment => formatPaymentResponse(payment));
  }

  async getOverduePayments(
    messId: string,
    requester: ElevatedRequester
  ): Promise<PaymentResponse[]> {
    if (requester.role === 'manager') {
      if (!requester.messId || requester.messId !== messId) {
        throw new AppError('Managers can only view payments for their mess', 403);
      }
    }

    const today = new Date();

    const payments = await prisma.payments.findMany({
      where: {
        mess_id: messId,
        status: 'pending',
        due_date: { lte: today }
      },
      include: { users: true },
      orderBy: { due_date: 'asc' }
    });

    return payments.map(payment => formatPaymentResponse(payment));
  }

  async getPaymentStats(
    messId: string,
    month: number,
    year: number,
    requester: ElevatedRequester
  ) {
    if (requester.role === 'manager') {
      if (!requester.messId || requester.messId !== messId) {
        throw new AppError('Managers can only view payments for their mess', 403);
      }
    }

    const payments = await prisma.payments.findMany({
      where: { mess_id: messId, month, year }
    });

    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const collectedAmount = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
    const pendingAmount = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const overdueAmount = payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      totalPayments: payments.length,
      totalAmount,
      collectedAmount,
      pendingAmount,
      overdueAmount,
      paidCount: payments.filter(p => p.status === 'paid').length,
      pendingCount: payments.filter(p => p.status === 'pending').length,
      overdueCount: payments.filter(p => p.status === 'overdue').length,
      period: { month, year }
    };
  }
}
