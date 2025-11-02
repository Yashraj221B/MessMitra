import { Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { CreatePaymentDTO, RecordPaymentDTO } from '../types/payment.types';
import { AuthRequest } from '../middleware/auth.middleware';

const paymentService = new PaymentService();

export const createPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data: CreatePaymentDTO = req.body;
  const requester = req.user!;

  if (requester.role === 'manager' && requester.messId && requester.messId !== data.messId) {
    throw new AppError('Managers can only create payments for their own mess', 403);
  }

  const payment = await paymentService.createPayment(data, {
    role: requester.role === 'admin' ? 'admin' : 'manager',
    userId: requester.userId,
    messId: requester.messId
  });
  res.status(201).json(successResponse('Payment created successfully', payment));
});

export const recordPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { paymentId } = req.params;
  const data: RecordPaymentDTO = req.body;
  const requester = req.user!;

  const payment = await paymentService.recordPayment(paymentId, data, {
    role: requester.role === 'admin' ? 'admin' : 'manager',
    userId: requester.userId,
    messId: requester.messId
  });
  res.json(successResponse('Payment recorded successfully', payment));
});

export const getPaymentById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { paymentId } = req.params;
  const requester = req.user!;

  const payment = await paymentService.getPaymentById(paymentId);

  if (requester.role === 'member' && payment.memberId !== requester.userId) {
    throw new AppError('Members can only view their own payments', 403);
  }

  if (requester.role === 'manager' && requester.messId && payment.messId !== requester.messId) {
    throw new AppError('Managers can only view payments for their mess', 403);
  }

  res.json(successResponse('Payment retrieved successfully', payment));
});

export const getMessPayments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { messId } = req.params;
  const { status, month, year } = req.query;
  const requester = req.user!;

  if (requester.role === 'manager' && requester.messId && requester.messId !== messId) {
    throw new AppError('Managers can only view payments for their mess', 403);
  }

  const payments = await paymentService.getMessPayments(
    messId,
    status as string,
    month ? parseInt(month as string) : undefined,
    year ? parseInt(year as string) : undefined,
    {
      role: requester.role === 'admin' ? 'admin' : 'manager',
      userId: requester.userId,
      messId: requester.messId
    }
  );
  res.json(successResponse('Mess payments retrieved successfully', payments));
});

export const getMemberPayments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { memberId } = req.params;
  const requester = req.user!;

  const payments = await paymentService.getMemberPayments(memberId, {
    role: requester.role,
    userId: requester.userId,
    messId: requester.messId
  });
  res.json(successResponse('Member payments retrieved successfully', payments));
});

export const getOverduePayments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { messId } = req.params;
  const requester = req.user!;

  if (requester.role === 'manager' && requester.messId && requester.messId !== messId) {
    throw new AppError('Managers can only view payments for their mess', 403);
  }

  const payments = await paymentService.getOverduePayments(messId, {
    role: requester.role === 'admin' ? 'admin' : 'manager',
    userId: requester.userId,
    messId: requester.messId
  });
  res.json(successResponse('Overdue payments retrieved successfully', payments));
});

export const getPaymentStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { messId } = req.params;
  const { month, year } = req.query;
  const requester = req.user!;

  if (requester.role === 'manager' && requester.messId && requester.messId !== messId) {
    throw new AppError('Managers can only view payments for their mess', 403);
  }

  const stats = await paymentService.getPaymentStats(
    messId,
    parseInt(month as string),
    parseInt(year as string),
    {
      role: requester.role === 'admin' ? 'admin' : 'manager',
      userId: requester.userId,
      messId: requester.messId
    }
  );
  res.json(successResponse('Payment statistics retrieved successfully', stats));
});
