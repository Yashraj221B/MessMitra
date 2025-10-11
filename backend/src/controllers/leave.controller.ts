import { Request, Response } from 'express';
import { LeaveService } from '../services/leave.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { CreateLeaveDTO, UpdateLeaveStatusDTO } from '../types/leave.types';

const leaveService = new LeaveService();

export const createLeave = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const data: CreateLeaveDTO = req.body;

  const leave = await leaveService.createLeave(userId, data);
  res.status(201).json(successResponse('Leave request created successfully', leave));
});

export const getLeaveById = asyncHandler(async (req: Request, res: Response) => {
  const { leaveId } = req.params;

  const leave = await leaveService.getLeaveById(leaveId);
  res.json(successResponse('Leave request retrieved successfully', leave));
});

export const getMessLeaves = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { status } = req.query;

  const leaves = await leaveService.getMessLeaves(messId, status as string);
  res.json(successResponse('Mess leaves retrieved successfully', leaves));
});

export const getMemberLeaves = asyncHandler(async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const { status } = req.query;

  const leaves = await leaveService.getMemberLeaves(memberId, status as string);
  res.json(successResponse('Member leaves retrieved successfully', leaves));
});

export const getMyLeaves = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { status } = req.query;

  const leaves = await leaveService.getMemberLeaves(userId, status as string);
  res.json(successResponse('Your leaves retrieved successfully', leaves));
});

export const updateLeaveStatus = asyncHandler(async (req: Request, res: Response) => {
  const { leaveId } = req.params;
  const { userId } = req.user!;
  const data: UpdateLeaveStatusDTO = req.body;

  const leave = await leaveService.updateLeaveStatus(leaveId, userId, data);
  res.json(successResponse('Leave status updated successfully', leave));
});

export const cancelLeave = asyncHandler(async (req: Request, res: Response) => {
  const { leaveId } = req.params;
  const { userId } = req.user!;

  const leave = await leaveService.cancelLeave(leaveId, userId);
  res.json(successResponse('Leave cancelled successfully', leave));
});

export const getLeaveStats = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { month, year } = req.query;

  const stats = await leaveService.getLeaveStats(
    messId,
    parseInt(month as string),
    parseInt(year as string)
  );
  res.json(successResponse('Leave statistics retrieved successfully', stats));
});
