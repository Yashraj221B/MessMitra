import prisma from '../config/prisma';
import { CreateMessDTO, UpdateMessDTO, MessResponse, JoinMessDTO, MessMemberResponse } from '../types/mess.types';
import { AppError } from '../middleware/error.middleware';
import { generateJoinQRCode, generateQRCodeImage, getQRCodeExpiry, isQRCodeExpired } from '../utils/qrcode.util';

export class MessService {

  /**
   * Create a new mess (Manager only)
   */
  async createMess(ownerId: string, data: CreateMessDTO): Promise<MessResponse> {
    // Generate QR code
    const joinQRCode = generateJoinQRCode();
    const qrCodeImage = await generateQRCodeImage(joinQRCode);
    const qrCodeExpiry = getQRCodeExpiry(30); // 30 days

    const mess = await prisma.messes.create({
      data: {
        name: data.name,
        address: data.address,
        owner_id: ownerId,
        monthly_fee: data.monthlyFee,
        capacity: data.maxMembers || 100,
        current_members: 0,
        qr_code: joinQRCode,
        qr_code_expiry: qrCodeExpiry,
        is_active: true
      },
      include: {
        users_messes_owner_idTousers: true
      }
    });

    // Update user's mess_id
    await prisma.users.update({
      where: { id: ownerId },
      data: { mess_id: mess.id }
    });

    return this.formatMessResponse(mess);
  }

  /**
   * Get mess by ID
   */
  async getMessById(messId: string): Promise<MessResponse> {
    const mess = await prisma.messes.findUnique({
      where: { id: messId },
      include: {
        users_messes_owner_idTousers: true
      }
    });

    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    return this.formatMessResponse(mess);
  }

  /**
   * Get all messes (with pagination)
   */
  async getAllMesses(page: number = 1, limit: number = 10): Promise<{ data: MessResponse[]; total: number }> {
    const [messes, total] = await Promise.all([
      prisma.messes.findMany({
        where: { is_active: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          users_messes_owner_idTousers: true
        }
      }),
      prisma.messes.count({
        where: { is_active: true }
      })
    ]);

    return {
      data: messes.map((mess: any) => this.formatMessResponse(mess)),
      total
    };
  }

  /**
   * Update mess
   */
  async updateMess(messId: string, ownerId: string, data: UpdateMessDTO): Promise<MessResponse> {
    const mess = await prisma.messes.findUnique({
      where: { id: messId }
    });

    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    if (mess.owner_id !== ownerId) {
      throw new AppError('You do not have permission to update this mess', 403);
    }

    // Build update data
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.address) updateData.address = data.address;
    if (data.monthlyFee !== undefined) updateData.monthly_fee = data.monthlyFee;
    if (data.maxMembers !== undefined) updateData.capacity = data.maxMembers;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    const updatedMess = await prisma.messes.update({
      where: { id: messId },
      data: updateData,
      include: {
        users_messes_owner_idTousers: true
      }
    });

    return this.formatMessResponse(updatedMess);
  }

  /**
   * Delete mess (soft delete)
   */
  async deleteMess(messId: string, ownerId: string): Promise<void> {
    const mess = await prisma.messes.findUnique({
      where: { id: messId }
    });

    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    if (mess.owner_id !== ownerId) {
      throw new AppError('You do not have permission to delete this mess', 403);
    }

    await prisma.messes.update({
      where: { id: messId },
      data: { is_active: false }
    });
  }

  /**
   * Regenerate QR code
   */
  async regenerateQRCode(messId: string, ownerId: string, validityDays: number = 30): Promise<MessResponse> {
    const mess = await prisma.messes.findUnique({
      where: { id: messId }
    });

    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    if (mess.owner_id !== ownerId) {
      throw new AppError('You do not have permission to regenerate QR code', 403);
    }

    const joinQRCode = generateJoinQRCode();
    const qrCodeImage = await generateQRCodeImage(joinQRCode);
    const qrCodeExpiry = getQRCodeExpiry(validityDays);

    const updatedMess = await prisma.messes.update({
      where: { id: messId },
      data: {
        qr_code: joinQRCode,
        qr_code_expiry: qrCodeExpiry
      },
      include: {
        users_messes_owner_idTousers: true
      }
    });

    return this.formatMessResponse(updatedMess);
  }

  /**
   * Join mess using QR code
   */
  async joinMess(memberId: string, data: JoinMessDTO): Promise<void> {
    let mess = null;

    if (data.qrCode) {
      // Join using QR code
      mess = await prisma.messes.findFirst({
        where: { qr_code: data.qrCode }
      });

      if (!mess) {
        throw new AppError('Invalid QR code', 404);
      }

      // Check if QR code is expired
      if (mess.qr_code_expiry && isQRCodeExpired(mess.qr_code_expiry)) {
        throw new AppError('QR code has expired. Please ask the manager for a new one.', 400);
      }
    } else if (data.messId) {
      // Join using mess ID (direct join)
      mess = await prisma.messes.findUnique({
        where: { id: data.messId }
      });

      if (!mess) {
        throw new AppError('Mess not found', 404);
      }
    } else {
      throw new AppError('Either qrCode or messId is required', 400);
    }

    // Check if mess is full
    if (mess.current_members && mess.current_members >= mess.capacity) {
      throw new AppError('Mess is full. Cannot accept new members.', 400);
    }

    // Update user
    const user = await prisma.users.findUnique({
      where: { id: memberId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.mess_id) {
      throw new AppError('You are already a member of a mess', 400);
    }

    await prisma.users.update({
      where: { id: memberId },
      data: {
        mess_id: mess.id,
        join_status: 'pending'
      }
    });

    // Update mess member count
    await prisma.messes.update({
      where: { id: mess.id },
      data: {
        current_members: (mess.current_members || 0) + 1
      }
    });
  }

  /**
   * Get mess members
   */
  async getMessMembers(messId: string): Promise<MessMemberResponse[]> {
    const members = await prisma.users.findMany({
      where: { mess_id: messId, role: 'member' },
      orderBy: { created_at: 'desc' }
    });

    return members.map((member: any) => ({
      id: member.id,
      name: member.name,
      phone: member.phone,
      memberId: undefined, // Not in schema
      room: undefined, // Not in schema
      hostel: undefined, // Not in schema
      joinStatus: member.join_status || 'pending',
      joinedAt: member.created_at || undefined
    }));
  }

  /**
   * Approve/Reject join request
   */
  async updateJoinRequest(messId: string, memberId: string, managerId: string, status: 'approved' | 'rejected'): Promise<void> {
    const mess = await prisma.messes.findUnique({
      where: { id: messId }
    });

    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    if (mess.owner_id !== managerId) {
      throw new AppError('Only mess owner can approve/reject join requests', 403);
    }

    const member = await prisma.users.findFirst({
      where: { id: memberId, mess_id: messId }
    });

    if (!member) {
      throw new AppError('Member not found', 404);
    }

    if (member.join_status !== 'pending') {
      throw new AppError(`Join request has already been ${member.join_status}`, 400);
    }

    if (status === 'approved') {
      await prisma.users.update({
        where: { id: memberId },
        data: { join_status: status }
      });
    } else {
      // If rejected, remove from mess
      await prisma.users.update({
        where: { id: memberId },
        data: {
          mess_id: null,
          join_status: status
        }
      });

      // Decrease mess member count
      await prisma.messes.update({
        where: { id: messId },
        data: {
          current_members: Math.max(0, (mess.current_members || 0) - 1)
        }
      });
    }
  }

  /**
   * Format mess response
   */
  private formatMessResponse(mess: any): MessResponse {
    return {
      id: mess.id,
      name: mess.name,
      description: undefined,
      address: mess.address,
      ownerId: mess.owner_id,
      monthlyFee: Number(mess.monthly_fee),
      currency: 'INR',
      securityDeposit: Number(mess.security_deposit || 0),
      maxMembers: mess.capacity,
      currentMembers: mess.current_members || 0,
      activeMembers: 0,
      totalRevenue: 0,
      joinQRCode: mess.qr_code || undefined,
      qrCodeImage: undefined,
      qrCodeExpiry: mess.qr_code_expiry || undefined,
      timings: undefined,
      features: undefined,
      settings: undefined,
      coverImage: undefined,
      images: [],
      isActive: mess.is_active || false,
      createdAt: mess.created_at || new Date(),
      updatedAt: mess.updated_at || new Date()
    };
  }
}
