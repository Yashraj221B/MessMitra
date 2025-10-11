import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreateLeaveDTO, UpdateLeaveStatusDTO, LeaveResponse } from '../types/leave.types';

export class LeaveService {

  async createLeave(memberId: string, data: CreateLeaveDTO): Promise<LeaveResponse> {
    // Verify member exists
    const member = await prisma.users.findFirst({
      where: { id: memberId, join_status: 'approved' }
    });
    if (!member || !member.mess_id) {
      throw new AppError('Member not found or not approved in any mess', 404);
    }

    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (endDate < startDate) {
      throw new AppError('End date must be after start date', 400);
    }

    // Calculate total days
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Check for overlapping leaves
    const overlappingLeave = await prisma.leaves.findFirst({
      where: {
        member_id: memberId,
        status: { not: 'cancelled' },
        OR: [
          {
            start_date: { lte: endDate },
            end_date: { gte: startDate }
          }
        ]
      }
    });

    if (overlappingLeave) {
      throw new AppError('You already have a leave request for these dates', 400);
    }

    const leave = await prisma.leaves.create({
      data: {
        mess_id: member.mess_id,
        member_id: memberId,
        start_date: startDate,
        end_date: endDate,
        total_days: totalDays,
        reason: data.reason,
        category: data.category || 'personal',
        status: 'pending'
      }
    });

    return {
      id: leave.id,
      messId: leave.mess_id,
      memberId: leave.member_id,
      memberName: member.name,
      startDate: leave.start_date.toISOString().split('T')[0],
      endDate: leave.end_date.toISOString().split('T')[0],
      totalDays: leave.total_days,
      reason: leave.reason,
      category: leave.category || 'personal',
      status: leave.status || 'pending',
      createdAt: leave.created_at!,
      updatedAt: leave.updated_at!
    };
  }

  async getLeaveById(leaveId: string): Promise<LeaveResponse> {
    const leave = await prisma.leaves.findUnique({
      where: { id: leaveId },
      include: { users_leaves_member_idTousers: true }
    });

    if (!leave) {
      throw new AppError('Leave request not found', 404);
    }

    return {
      id: leave.id,
      messId: leave.mess_id,
      memberId: leave.member_id,
      memberName: leave.users_leaves_member_idTousers?.name || 'Unknown',
      startDate: leave.start_date.toISOString().split('T')[0],
      endDate: leave.end_date.toISOString().split('T')[0],
      totalDays: leave.total_days,
      reason: leave.reason,
      category: leave.category!,
      status: leave.status!,
      reviewedBy: leave.reviewed_by || undefined,
      reviewedAt: leave.reviewed_at || undefined,
      reviewNotes: leave.review_notes || undefined,
      createdAt: leave.created_at!,
      updatedAt: leave.updated_at!
    };
  }

  async getMessLeaves(messId: string, status?: string): Promise<LeaveResponse[]> {
    const whereConditions: any = { mess_id: messId };
    if (status) {
      whereConditions.status = status;
    }

    const leaves = await prisma.leaves.findMany({
      where: whereConditions,
      include: { users_leaves_member_idTousers: true },
      orderBy: { created_at: 'desc' }
    });

    return leaves.map(leave => ({
      id: leave.id,
      messId: leave.mess_id,
      memberId: leave.member_id,
      memberName: leave.users_leaves_member_idTousers?.name || 'Unknown',
      startDate: leave.start_date.toISOString().split('T')[0],
      endDate: leave.end_date.toISOString().split('T')[0],
      totalDays: leave.total_days,
      reason: leave.reason,
      category: leave.category!,
      status: leave.status!,
      reviewedBy: leave.reviewed_by || undefined,
      reviewedAt: leave.reviewed_at || undefined,
      reviewNotes: leave.review_notes || undefined,
      createdAt: leave.created_at!,
      updatedAt: leave.updated_at!
    }));
  }

  async getMemberLeaves(memberId: string, status?: string): Promise<LeaveResponse[]> {
    const whereConditions: any = { member_id: memberId };
    if (status) {
      whereConditions.status = status;
    }

    const leaves = await prisma.leaves.findMany({
      where: whereConditions,
      include: { users_leaves_member_idTousers: true },
      orderBy: { created_at: 'desc' }
    });

    return leaves.map(leave => ({
      id: leave.id,
      messId: leave.mess_id,
      memberId: leave.member_id,
      memberName: leave.users_leaves_member_idTousers?.name || 'Unknown',
      startDate: leave.start_date.toISOString().split('T')[0],
      endDate: leave.end_date.toISOString().split('T')[0],
      totalDays: leave.total_days,
      reason: leave.reason,
      category: leave.category!,
      status: leave.status!,
      reviewedBy: leave.reviewed_by || undefined,
      reviewedAt: leave.reviewed_at || undefined,
      reviewNotes: leave.review_notes || undefined,
      createdAt: leave.created_at!,
      updatedAt: leave.updated_at!
    }));
  }

  async updateLeaveStatus(
    leaveId: string,
    managerId: string,
    data: UpdateLeaveStatusDTO
  ): Promise<LeaveResponse> {
    const leave = await prisma.leaves.findUnique({
      where: { id: leaveId },
      include: { users_leaves_member_idTousers: true }
    });

    if (!leave) {
      throw new AppError('Leave request not found', 404);
    }

    if (leave.status !== 'pending') {
      throw new AppError('Only pending leave requests can be updated', 400);
    }

    const updated = await prisma.leaves.update({
      where: { id: leaveId },
      data: {
        status: data.status,
        reviewed_by: managerId,
        reviewed_at: new Date(),
        review_notes: data.reviewNotes || undefined
      },
      include: { users_leaves_member_idTousers: true }
    });

    return {
      id: updated.id,
      messId: updated.mess_id,
      memberId: updated.member_id,
      memberName: updated.users_leaves_member_idTousers?.name || 'Unknown',
      startDate: updated.start_date.toISOString().split('T')[0],
      endDate: updated.end_date.toISOString().split('T')[0],
      totalDays: updated.total_days,
      reason: updated.reason,
      category: updated.category!,
      status: updated.status!,
      reviewedBy: updated.reviewed_by || undefined,
      reviewedAt: updated.reviewed_at || undefined,
      reviewNotes: updated.review_notes || undefined,
      createdAt: updated.created_at!,
      updatedAt: updated.updated_at!
    };
  }

  async cancelLeave(leaveId: string, memberId: string): Promise<LeaveResponse> {
    const leave = await prisma.leaves.findFirst({
      where: { id: leaveId, member_id: memberId },
      include: { users_leaves_member_idTousers: true }
    });

    if (!leave) {
      throw new AppError('Leave request not found', 404);
    }

    if (leave.status === 'cancelled') {
      throw new AppError('Leave request is already cancelled', 400);
    }

    const cancelled = await prisma.leaves.update({
      where: { id: leaveId },
      data: {
        status: 'cancelled',
        cancelled_at: new Date()
      },
      include: { users_leaves_member_idTousers: true }
    });

    return {
      id: cancelled.id,
      messId: cancelled.mess_id,
      memberId: cancelled.member_id,
      memberName: cancelled.users_leaves_member_idTousers?.name || 'Unknown',
      startDate: cancelled.start_date.toISOString().split('T')[0],
      endDate: cancelled.end_date.toISOString().split('T')[0],
      totalDays: cancelled.total_days,
      reason: cancelled.reason,
      category: cancelled.category!,
      status: cancelled.status!,
      reviewedBy: cancelled.reviewed_by || undefined,
      reviewedAt: cancelled.reviewed_at || undefined,
      reviewNotes: cancelled.review_notes || undefined,
      createdAt: cancelled.created_at!,
      updatedAt: cancelled.updated_at!
    };
  }

  async getLeaveStats(messId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const leaves = await prisma.leaves.findMany({
      where: {
        mess_id: messId,
        start_date: { gte: startDate, lte: endDate }
      }
    });

    const totalLeaves = leaves.length;
    const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
    const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length;
    const totalDaysOnLeave = leaves
      .filter(l => l.status === 'approved')
      .reduce((sum, l) => sum + l.total_days, 0);

    return {
      totalLeaves,
      approvedLeaves,
      pendingLeaves,
      rejectedLeaves,
      totalDaysOnLeave,
      period: { month, year }
    };
  }
}
