import { Response, NextFunction } from 'express';
import { MessService } from '../services/mess.service';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { CreateMessDTO, UpdateMessDTO, JoinMessDTO } from '../types/mess.types';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

export class MessController {
  private messService = new MessService();

  createMess = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const ownerId = req.user!.userId;
    const data: CreateMessDTO = req.body;
    const result = await this.messService.createMess(ownerId, data);
    res.status(201).json(successResponse('Mess created successfully', result));
  });

  getMessById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { messId } = req.params;
    const result = await this.messService.getMessById(messId);
    res.json(successResponse('Mess fetched successfully', result));
  });

  getAllMesses = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { data, total } = await this.messService.getAllMesses(page, limit);
    res.json(paginatedResponse('Messes fetched successfully', data, page, limit, total));
  });

  updateMess = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { messId } = req.params;
    const ownerId = req.user!.userId;
    const data: UpdateMessDTO = req.body;
    const result = await this.messService.updateMess(messId, ownerId, data);
    res.json(successResponse('Mess updated successfully', result));
  });

  deleteMess = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { messId } = req.params;
    const ownerId = req.user!.userId;
    await this.messService.deleteMess(messId, ownerId);
    res.json(successResponse('Mess deleted successfully'));
  });

  regenerateQRCode = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { messId } = req.params;
    const ownerId = req.user!.userId;
    const validityDays = req.body.validityDays || 30;
    const result = await this.messService.regenerateQRCode(messId, ownerId, validityDays);
    res.json(successResponse('QR code regenerated successfully', result));
  });

  joinMess = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const memberId = req.user!.userId;
    const data: JoinMessDTO = req.body;
    await this.messService.joinMess(memberId, data);
    res.json(successResponse('Join request submitted successfully'));
  });

  getMessMembers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { messId } = req.params;
    const result = await this.messService.getMessMembers(messId);
    res.json(successResponse('Mess members fetched successfully', result));
  });

  updateJoinRequest = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { messId, memberId } = req.params;
    const managerId = req.user!.userId;
    const { status } = req.body;
    await this.messService.updateJoinRequest(messId, memberId, managerId, status);
    res.json(successResponse(`Join request ${status} successfully`));
  });
}
