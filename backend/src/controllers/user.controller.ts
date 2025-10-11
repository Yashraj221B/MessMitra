import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { successResponse } from '../utils/response.util';
import { UpdateProfileDTO, ChangePasswordDTO } from '../types/user.types';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

export class UserController {
  private userService = new UserService();

  getProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const result = await this.userService.getProfile(userId);
    res.json(successResponse('Profile fetched successfully', result));
  });

  updateProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const data: UpdateProfileDTO = req.body;
    const result = await this.userService.updateProfile(userId, data);
    res.json(successResponse('Profile updated successfully', result));
  });

  changePassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const data: ChangePasswordDTO = req.body;
    await this.userService.changePassword(userId, data);
    res.json(successResponse('Password changed successfully'));
  });

  getAllUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.query.role as string | undefined;
    const result = await this.userService.getAllUsers(role);
    res.json(successResponse('Users fetched successfully', result));
  });
}
