import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { MarkAttendanceDTO, AttendanceResponse, AttendanceReportQuery } from '../types/attendance.types';

export class AttendanceService {

  async markAttendance(data: MarkAttendanceDTO): Promise<AttendanceResponse> {
    // Verify mess exists
    const mess = await prisma.messes.findUnique({
      where: { id: data.messId, is_active: true }
    });
    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    // Verify member exists and belongs to mess
    const member = await prisma.users.findFirst({
      where: { id: data.memberId, mess_id: data.messId, join_status: 'approved' }
    });
    if (!member) {
      throw new AppError('Member not found or not approved in this mess', 404);
    }

    // Check if attendance already marked for this meal
    const dateObj = new Date(data.date);
    const existingAttendance = await prisma.attendances.findFirst({
      where: {
        mess_id: data.messId,
        member_id: data.memberId,
        date: dateObj,
        meal_type: data.mealType
      }
    });

    if (existingAttendance) {
      throw new AppError('Attendance already marked for this meal', 400);
    }

    const attendance = await prisma.attendances.create({
      data: {
        mess_id: data.messId,
        member_id: data.memberId,
        date: dateObj,
        meal_type: data.mealType,
        status: (data.status?.replace('-', '_') as any) || 'present',
        scan_method: data.scanMethod || 'manual',
        scanned_at: new Date()
      }
    });

    return {
      id: attendance.id,
      messId: attendance.mess_id,
      memberId: attendance.member_id,
      memberName: member.name,
      date: attendance.date.toISOString().split('T')[0],
      mealType: attendance.meal_type,
      status: attendance.status,
      scanMethod: attendance.scan_method || undefined,
      scannedAt: attendance.scanned_at || undefined,
      scannedBy: attendance.scanned_by || undefined,
      createdAt: attendance.created_at || new Date()
    };
  }

  async getAttendanceById(attendanceId: string): Promise<AttendanceResponse> {
    const attendance = await prisma.attendances.findUnique({
      where: { id: attendanceId },
      include: { users_attendances_member_idTousers: true }
    });

    if (!attendance) {
      throw new AppError('Attendance record not found', 404);
    }

    return {
      id: attendance.id,
      messId: attendance.mess_id,
      memberId: attendance.member_id,
      memberName: attendance.users_attendances_member_idTousers?.name || 'Unknown',
      date: attendance.date.toISOString().split('T')[0],
      mealType: attendance.meal_type,
      status: attendance.status,
      scanMethod: attendance.scan_method || undefined,
      scannedAt: attendance.scanned_at || undefined,
      scannedBy: attendance.scanned_by || undefined,
      createdAt: attendance.created_at!
    };
  }

  async getAttendanceReport(messId: string, query: AttendanceReportQuery): Promise<AttendanceResponse[]> {
    const whereConditions: any = { mess_id: messId };

    if (query.memberId) {
      whereConditions.member_id = query.memberId;
    }

    if (query.startDate && query.endDate) {
      whereConditions.date = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate)
      };
    }

    if (query.mealType) {
      whereConditions.meal_type = query.mealType;
    }

    if (query.status) {
      whereConditions.status = query.status;
    }

    const attendances = await prisma.attendances.findMany({
      where: whereConditions,
      include: { users_attendances_member_idTousers: true },
      orderBy: [{ date: 'desc' }, { scanned_at: 'desc' }]
    });

    return attendances.map(attendance => ({
      id: attendance.id,
      messId: attendance.mess_id,
      memberId: attendance.member_id,
      memberName: attendance.users_attendances_member_idTousers?.name || 'Unknown',
      date: attendance.date.toISOString().split('T')[0],
      mealType: attendance.meal_type,
      status: attendance.status,
      scanMethod: attendance.scan_method || undefined,
      scannedAt: attendance.scanned_at || undefined,
      scannedBy: attendance.scanned_by || undefined,
      createdAt: attendance.created_at!
    }));
  }

  async getMemberAttendance(messId: string, memberId: string, month: number, year: number): Promise<AttendanceResponse[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await prisma.attendances.findMany({
      where: {
        mess_id: messId,
        member_id: memberId,
        date: { gte: startDate, lte: endDate }
      },
      include: { users_attendances_member_idTousers: true },
      orderBy: [{ date: 'asc' }, { scanned_at: 'asc' }]
    });

    return attendances.map(attendance => ({
      id: attendance.id,
      messId: attendance.mess_id,
      memberId: attendance.member_id,
      memberName: attendance.users_attendances_member_idTousers?.name || 'Unknown',
      date: attendance.date.toISOString().split('T')[0],
      mealType: attendance.meal_type,
      status: attendance.status,
      scanMethod: attendance.scan_method || undefined,
      scannedAt: attendance.scanned_at || undefined,
      scannedBy: attendance.scanned_by || undefined,
      createdAt: attendance.created_at!
    }));
  }

  async getAttendanceStats(messId: string, startDate: string, endDate: string) {
    const attendances = await prisma.attendances.findMany({
      where: {
        mess_id: messId,
        date: { gte: new Date(startDate), lte: new Date(endDate) }
      }
    });

    const totalScans = attendances.length;
    const uniqueMembers = new Set(attendances.map(a => a.member_id)).size;
    const mealTypeCounts = attendances.reduce((acc, curr) => {
      acc[curr.meal_type] = (acc[curr.meal_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalScans,
      uniqueMembers,
      mealTypeCounts,
      period: { startDate, endDate }
    };
  }
}
