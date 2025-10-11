import { Request, Response } from 'express';
import { FeedbackService } from '../services/feedback.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { CreateFeedbackDTO } from '../types/feedback.types';

const feedbackService = new FeedbackService();

export const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const data: CreateFeedbackDTO = req.body;

  const feedback = await feedbackService.createFeedback(userId, data);
  res.status(201).json(successResponse('Feedback submitted successfully', feedback));
});

export const getFeedbackById = asyncHandler(async (req: Request, res: Response) => {
  const { feedbackId } = req.params;

  const feedback = await feedbackService.getFeedbackById(feedbackId);
  res.json(successResponse('Feedback retrieved successfully', feedback));
});

export const getMessFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { category } = req.query;

  const feedbacks = await feedbackService.getMessFeedback(messId, category as string);
  res.json(successResponse('Mess feedback retrieved successfully', feedbacks));
});

export const getFeedbackStats = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;

  const stats = await feedbackService.getFeedbackStats(messId);
  res.json(successResponse('Feedback statistics retrieved successfully', stats));
});
