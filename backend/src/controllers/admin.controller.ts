import { Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { successResponse } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

export class AdminController {
  private adminService = new AdminService();

  /**
   * Get platform statistics
   * GET /api/admin/stats
   */
  getPlatformStats = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const result = await this.adminService.getPlatformStats();
    res.json(successResponse('Platform statistics fetched successfully', result));
  });

  /**
   * Get all messes
   * GET /api/admin/messes
   */
  getAllMesses = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const result = await this.adminService.getAllMesses();
    res.json(successResponse('Messes fetched successfully', result));
  });

  /**
   * Approve a pending mess
   * POST /api/admin/messes/:messId/approve
   */
  approveMess = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { messId } = req.params;
    await this.adminService.approveMess(messId);
    res.json(successResponse('Mess approved successfully'));
  });

  /**
   * Suspend an active mess
   * POST /api/admin/messes/:messId/suspend
   */
  suspendMess = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { messId } = req.params;
    await this.adminService.suspendMess(messId);
    res.json(successResponse('Mess suspended successfully'));
  });

  /**
   * Activate a suspended mess
   * POST /api/admin/messes/:messId/activate
   */
  activateMess = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { messId } = req.params;
    await this.adminService.activateMess(messId);
    res.json(successResponse('Mess activated successfully'));
  });

  /**
   * Get all users
   * GET /api/admin/users
   */
  getAllUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const result = await this.adminService.getAllUsers();
    res.json(successResponse('Users fetched successfully', result));
  });

  /**
   * Get user by ID
   * GET /api/admin/users/:userId
   */
  getUserById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const result = await this.adminService.getUserById(userId);
    res.json(successResponse('User fetched successfully', result));
  });

  /**
   * Suspend a user
   * POST /api/admin/users/:userId/suspend
   */
  suspendUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    await this.adminService.suspendUser(userId);
    res.json(successResponse('User suspended successfully'));
  });

  /**
   * Activate a suspended user
   * POST /api/admin/users/:userId/activate
   */
  activateUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    await this.adminService.activateUser(userId);
    res.json(successResponse('User activated successfully'));
  });

  /**
   * Delete a user
   * DELETE /api/admin/users/:userId
   */
  deleteUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    await this.adminService.deleteUser(userId);
    res.json(successResponse('User deleted successfully'));
  });

  /**
   * Change user role
   * PATCH /api/admin/users/:userId/role
   */
  changeUserRole = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { role } = req.body;
    await this.adminService.changeUserRole(userId, role);
    res.json(successResponse('User role changed successfully'));
  });
}
