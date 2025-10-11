import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';

interface PlatformStats {
  totalMesses: number;
  activeMesses: number;
  pendingMesses: number;
  suspendedMesses: number;
  totalManagers: number;
  totalMembers: number;
  activeMembers: number;
  totalUsers: number;
  totalRevenue: number;
  pendingPayments: number;
  averageRating: number;
  totalFeedbacks: number;
}

interface MessData {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  capacity: number;
  currentMembers: number;
  monthlyFee: number;
  status: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: Date;
}

interface UserData {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  role: string;
  messId: string | null;
  messName: string | null;
  joinStatus: string | null;
  status: string;
  createdAt: Date;
  lastLogin: Date | null;
}

export class AdminService {
  /**
   * Get platform-wide statistics
   */
  async getPlatformStats(): Promise<PlatformStats> {
    const [
      totalMesses,
      activeMesses,
      totalManagers,
      totalMembers,
      activeMembers,
      totalUsers,
      totalRevenueResult,
      pendingPaymentsResult,
      avgRatingResult,
      totalFeedbacks
    ] = await Promise.all([
      // Total messes
      prisma.messes.count(),
      // Active messes
      prisma.messes.count({ where: { is_active: true } }),
      // Total managers
      prisma.users.count({ where: { role: 'manager' } }),
      // Total members
      prisma.users.count({ where: { role: 'member' } }),
      // Active members (approved join status)
      prisma.users.count({ 
        where: { 
          role: 'member',
          join_status: 'approved',
          is_active: true
        } 
      }),
      // Total users
      prisma.users.count(),
      // Total revenue (sum of paid amounts)
      prisma.payments.aggregate({
        _sum: { paid_amount: true },
        where: { status: 'paid' }
      }),
      // Pending payments (sum of amounts where status is pending)
      prisma.payments.aggregate({
        _sum: { amount: true },
        where: { status: 'pending' }
      }),
      // Average rating
      prisma.feedbacks.aggregate({
        _avg: { rating: true }
      }),
      // Total feedbacks
      prisma.feedbacks.count()
    ]);

    // Calculate pending and suspended messes
    const pendingMesses = 0; // No status field yet, will be 0
    const suspendedMesses = totalMesses - activeMesses;

    return {
      totalMesses,
      activeMesses,
      pendingMesses,
      suspendedMesses,
      totalManagers,
      totalMembers,
      activeMembers,
      totalUsers,
      totalRevenue: Number(totalRevenueResult._sum.paid_amount || 0),
      pendingPayments: Number(pendingPaymentsResult._sum.amount || 0),
      averageRating: Number(avgRatingResult._avg.rating || 0),
      totalFeedbacks
    };
  }

  /**
   * Get all messes with owner details
   */
  async getAllMesses(): Promise<MessData[]> {
    const messes = await prisma.messes.findMany({
      include: {
        users_messes_owner_idTousers: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return messes.map(mess => ({
      id: mess.id,
      name: mess.name,
      address: mess.address,
      phone: mess.phone,
      email: mess.email,
      capacity: mess.capacity,
      currentMembers: mess.current_members || 0,
      monthlyFee: Number(mess.monthly_fee),
      status: mess.is_active ? 'active' : 'suspended',
      ownerName: mess.users_messes_owner_idTousers.name,
      ownerPhone: mess.users_messes_owner_idTousers.phone,
      createdAt: mess.created_at || new Date()
    }));
  }

  /**
   * Approve a pending mess
   */
  async approveMess(messId: string): Promise<void> {
    const mess = await prisma.messes.findUnique({
      where: { id: messId }
    });

    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    await prisma.messes.update({
      where: { id: messId },
      data: { is_active: true }
    });
  }

  /**
   * Suspend an active mess
   */
  async suspendMess(messId: string): Promise<void> {
    const mess = await prisma.messes.findUnique({
      where: { id: messId }
    });

    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    await prisma.messes.update({
      where: { id: messId },
      data: { is_active: false }
    });
  }

  /**
   * Activate a suspended mess
   */
  async activateMess(messId: string): Promise<void> {
    const mess = await prisma.messes.findUnique({
      where: { id: messId }
    });

    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    await prisma.messes.update({
      where: { id: messId },
      data: { is_active: true }
    });
  }

  /**
   * Get all users with mess details
   */
  async getAllUsers(): Promise<UserData[]> {
    const users = await prisma.users.findMany({
      include: {
        messes_users_mess_idTomesses: {
          select: {
            name: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return users.map(user => ({
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      role: user.role,
      messId: user.mess_id,
      messName: user.messes_users_mess_idTomesses?.name || null,
      joinStatus: user.join_status,
      status: user.is_active ? 'active' : 'suspended',
      createdAt: user.created_at || new Date(),
      lastLogin: user.last_login
    }));
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserData> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        messes_users_mess_idTomesses: {
          select: {
            name: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      role: user.role,
      messId: user.mess_id,
      messName: user.messes_users_mess_idTomesses?.name || null,
      joinStatus: user.join_status,
      status: user.is_active ? 'active' : 'suspended',
      createdAt: user.created_at || new Date(),
      lastLogin: user.last_login
    };
  }

  /**
   * Suspend a user
   */
  async suspendUser(userId: string): Promise<void> {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow suspending admin users
    if (user.role === 'admin') {
      throw new AppError('Cannot suspend admin users', 403);
    }

    await prisma.users.update({
      where: { id: userId },
      data: { 
        is_active: false,
        token_version: (user.token_version || 0) + 1 // Invalidate existing tokens
      }
    });
  }

  /**
   * Activate a suspended user
   */
  async activateUser(userId: string): Promise<void> {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await prisma.users.update({
      where: { id: userId },
      data: { is_active: true }
    });
  }

  /**
   * Delete a user permanently
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      throw new AppError('Cannot delete admin users', 403);
    }

    // Check if user is a mess owner
    const ownedMesses = await prisma.messes.count({
      where: { owner_id: userId }
    });

    if (ownedMesses > 0) {
      throw new AppError('Cannot delete user who owns messes. Transfer ownership first.', 400);
    }

    await prisma.users.delete({
      where: { id: userId }
    });
  }

  /**
   * Change user role
   */
  async changeUserRole(userId: string, newRole: string): Promise<void> {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow changing admin role
    if (user.role === 'admin' || newRole === 'admin') {
      throw new AppError('Cannot change admin role through this endpoint', 403);
    }

    // Validate role
    if (!['manager', 'member'].includes(newRole)) {
      throw new AppError('Invalid role. Must be manager or member', 400);
    }

    await prisma.users.update({
      where: { id: userId },
      data: { 
        role: newRole as any,
        token_version: (user.token_version || 0) + 1 // Invalidate existing tokens
      }
    });
  }
}
