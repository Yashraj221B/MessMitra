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
  description?: string | null;
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
      description: mess.description,
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
   * Get all managers (users with role='manager')
   */
  async getManagers(): Promise<UserData[]> {
    const managers = await prisma.users.findMany({
      where: {
        role: 'manager'
      },
      include: {
        messes_users_mess_idTomesses: {
          select: {
            name: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return managers.map(user => ({
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

  /**
   * Update user details (name, email)
   */
  async updateUser(userId: string, updateData: { name?: string; email?: string }): Promise<void> {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow updating admin users through this endpoint
    if (user.role === 'admin') {
      throw new AppError('Cannot update admin users through this endpoint', 403);
    }

    // Prepare update data
    const data: any = {};
    if (updateData.name !== undefined && updateData.name.trim()) {
      data.name = updateData.name.trim();
    }
    if (updateData.email !== undefined) {
      // Allow setting to null or empty string to clear email
      data.email = updateData.email.trim() || null;
    }

    // Only update if there's something to update
    if (Object.keys(data).length > 0) {
      await prisma.users.update({
        where: { id: userId },
        data
      });
    }
  }

  /**
   * Create a new mess
   */
  async createMess(data: {
    name: string;
    ownerId: string;
    address: string;
    capacity: number;
    monthlyFee: number;
    phone?: string | null;
    email?: string | null;
    description?: string | null;
    securityDeposit?: number | null;
  }): Promise<MessData> {
    // Verify owner exists and is a manager
    const owner = await prisma.users.findUnique({
      where: { id: data.ownerId }
    });

    if (!owner) {
      throw new AppError('Owner user not found', 404);
    }

    if (owner.role !== 'manager') {
      throw new AppError('Only managers can own a mess', 400);
    }

    // Check if manager already owns a mess
    const existingMess = await prisma.messes.findFirst({
      where: { owner_id: data.ownerId }
    });

    if (existingMess) {
      throw new AppError('This manager already owns a mess', 400);
    }

    // Create the mess
    const mess = await prisma.messes.create({
      data: {
        name: data.name,
        owner_id: data.ownerId,
        address: data.address,
        capacity: data.capacity,
        monthly_fee: data.monthlyFee,
        phone: data.phone || null,
        email: data.email || null,
        description: data.description || null,
        security_deposit: data.securityDeposit || 0,
        current_members: 0,
        is_active: false, // Pending approval by admin
      },
      include: {
        users_messes_owner_idTousers: {
          select: {
            name: true,
            phone: true
          }
        }
      }
    });

    // Update owner's mess_id
    await prisma.users.update({
      where: { id: data.ownerId },
      data: { mess_id: mess.id }
    });

    return {
      id: mess.id,
      name: mess.name,
      address: mess.address,
      phone: mess.phone,
      email: mess.email,
      description: mess.description,
      capacity: mess.capacity,
      currentMembers: mess.current_members || 0,
      monthlyFee: parseFloat(mess.monthly_fee.toString()),
      status: mess.is_active ? 'active' : 'pending',
      ownerName: mess.users_messes_owner_idTousers.name,
      ownerPhone: mess.users_messes_owner_idTousers.phone,
      createdAt: mess.created_at || new Date()
    };
  }

  /**
   * Create a new user (manager/member)
   */
  async createUser(data: {
    name: string;
    phone: string;
    email?: string | null;
    password: string;
    role: 'manager' | 'member';
    messId?: string | null;
  }): Promise<UserData> {
    // Check if phone already exists
    const existingUser = await prisma.users.findUnique({
      where: { phone: data.phone }
    });

    if (existingUser) {
      throw new AppError('User with this phone number already exists', 400);
    }

    // Validate role
    if (!['manager', 'member'].includes(data.role)) {
      throw new AppError('Invalid role. Must be manager or member', 400);
    }

    // If messId provided, verify it exists
    if (data.messId) {
      const mess = await prisma.messes.findUnique({
        where: { id: data.messId }
      });

      if (!mess) {
        throw new AppError('Mess not found', 404);
      }
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        password: hashedPassword,
        role: data.role,
        mess_id: data.messId || null,
        join_status: data.messId ? 'approved' : null,
        is_active: true
      },
      include: {
        messes_users_mess_idTomesses: {
          select: {
            name: true
          }
        }
      }
    });

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
}
