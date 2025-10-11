import prisma from '../config/prisma';
import { UpdateProfileDTO, ChangePasswordDTO, UserProfileResponse } from '../types/user.types';
import { hashPassword, comparePassword, validatePassword } from '../utils/password.util';
import { AppError } from '../middleware/error.middleware';

export class UserService {

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        messes_users_mess_idTomesses: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email || undefined,
      role: user.role,
      profilePicture: user.profile_picture || undefined,
      messId: user.mess_id || undefined,
      messName: user.messes_users_mess_idTomesses?.name,
      joinStatus: user.join_status || undefined,
      memberId: undefined, // Not in schema
      room: undefined, // Not in schema
      hostel: undefined, // Not in schema
      messAddress: user.messes_users_mess_idTomesses?.address,
      language: user.language || undefined,
      theme: user.theme || undefined,
      createdAt: user.created_at || new Date(),
      lastLogin: user.last_login || undefined
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileDTO): Promise<UserProfileResponse> {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Build update data
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.profilePicture !== undefined) updateData.profile_picture = data.profilePicture || null;
    if (data.language) updateData.language = data.language;
    if (data.theme) updateData.theme = data.theme;

    await prisma.users.update({
      where: { id: userId },
      data: updateData
    });

    return this.getProfile(userId);
  }

  /**
   * Change password
   */
  async changePassword(userId: string, data: ChangePasswordDTO): Promise<void> {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isValid = await comparePassword(data.currentPassword, user.password);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Validate new password
    const validation = validatePassword(data.newPassword);
    if (!validation.valid) {
      throw new AppError(validation.message || 'Invalid password', 400);
    }

    // Update password
    const newHashedPassword = await hashPassword(data.newPassword);
    await prisma.users.update({
      where: { id: userId },
      data: {
        password: newHashedPassword,
        token_version: (user.token_version || 0) + 1 // Invalidate existing tokens
      }
    });
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(role?: string): Promise<UserProfileResponse[]> {
    const users = await prisma.users.findMany({
      where: role ? { role: role as any } : {},
      include: {
        messes_users_mess_idTomesses: true
      }
    });

    return users.map(user => ({
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email || undefined,
      role: user.role,
      profilePicture: user.profile_picture || undefined,
      messId: user.mess_id || undefined,
      messName: user.messes_users_mess_idTomesses?.name,
      joinStatus: user.join_status || undefined,
      memberId: undefined, // Not in schema
      room: undefined, // Not in schema
      hostel: undefined, // Not in schema
      messAddress: user.messes_users_mess_idTomesses?.address,
      language: user.language || undefined,
      theme: user.theme || undefined,
      createdAt: user.created_at || new Date(),
      lastLogin: user.last_login || undefined
    }));
  }
}
