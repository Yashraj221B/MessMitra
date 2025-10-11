import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/response.util';
import { RegisterDTO, LoginDTO, RefreshTokenDTO } from '../types/auth.types';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

export class AuthController {
  private authService = new AuthService();

  register = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const data: RegisterDTO = req.body;
    const result = await this.authService.register(data);
    res.status(201).json(successResponse('Registration successful', result));
  });

  login = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const data: LoginDTO = req.body;
    const result = await this.authService.login(data);
    res.json(successResponse('Login successful', result));
  });

  refreshToken = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { refreshToken }: RefreshTokenDTO = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    res.json(successResponse('Token refreshed successfully', result));
  });

  logout = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    await this.authService.logout(userId);
    res.json(successResponse('Logout successful'));
  });
}
