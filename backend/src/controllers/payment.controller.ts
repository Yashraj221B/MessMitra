import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { CreatePaymentDTO, RecordPaymentDTO } from '../types/payment.types';

const paymentService = new PaymentService();

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const data: CreatePaymentDTO = req.body;

  const payment = await paymentService.createPayment(data);
  res.status(201).json(successResponse('Payment created successfully', payment));
});

export const recordPayment = asyncHandler(async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const data: RecordPaymentDTO = req.body;

  const payment = await paymentService.recordPayment(paymentId, data);
  res.json(successResponse('Payment recorded successfully', payment));
});

export const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const { paymentId } = req.params;

  const payment = await paymentService.getPaymentById(paymentId);
  res.json(successResponse('Payment retrieved successfully', payment));
});

export const getMessPayments = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { status, month, year } = req.query;

  const payments = await paymentService.getMessPayments(
    messId,
    status as string,
    month ? parseInt(month as string) : undefined,
    year ? parseInt(year as string) : undefined
  );
  res.json(successResponse('Mess payments retrieved successfully', payments));
});

export const getMemberPayments = asyncHandler(async (req: Request, res: Response) => {
  const { memberId } = req.params;

  const payments = await paymentService.getMemberPayments(memberId);
  res.json(successResponse('Member payments retrieved successfully', payments));
});

export const getOverduePayments = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;

  const payments = await paymentService.getOverduePayments(messId);
  res.json(successResponse('Overdue payments retrieved successfully', payments));
});

export const getPaymentStats = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { month, year } = req.query;

  const stats = await paymentService.getPaymentStats(
    messId,
    parseInt(month as string),
    parseInt(year as string)
  );
  res.json(successResponse('Payment statistics retrieved successfully', stats));
});
