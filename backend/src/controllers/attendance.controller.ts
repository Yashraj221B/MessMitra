import { Response } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { MarkAttendanceDTO, AttendanceReportQuery } from '../types/attendance.types';
import { AuthRequest } from '../middleware/auth.middleware';

const attendanceService = new AttendanceService();

export const markAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data: MarkAttendanceDTO = { ...req.body };
  const { role, userId, messId: requesterMessId } = req.user!;

  if (!data.messId) {
    throw new AppError('Mess ID is required', 400);
  }

  if (role === 'member') {
    data.memberId = userId;
    if (req.user!.messId && req.user!.messId !== data.messId) {
      throw new AppError('You can only mark attendance for your own mess', 403);
    }
  } else {
    if (!data.memberId) {
      throw new AppError('Member ID is required', 400);
    }
    if (role === 'manager' && requesterMessId && requesterMessId !== data.messId) {
      throw new AppError('Managers can only mark attendance for their mess', 403);
    }
  }

  const attendance = await attendanceService.markAttendance(data);
  res.status(201).json(successResponse('Attendance marked successfully', attendance));
});

export const getAttendanceById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { attendanceId } = req.params;

  const attendance = await attendanceService.getAttendanceById(attendanceId);
  res.json(successResponse('Attendance retrieved successfully', attendance));
});

export const getAttendanceReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { messId } = req.params;
  const query = { ...req.query, messId } as AttendanceReportQuery;
  const { role, messId: requesterMessId } = req.user!;

  if (role === 'manager' && requesterMessId && requesterMessId !== messId) {
    throw new AppError('Managers can only view attendance for their mess', 403);
  }

  const report = await attendanceService.getAttendanceReport(messId, query);
  res.json(successResponse('Attendance report retrieved successfully', report));
});

export const getMemberAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { messId, memberId } = req.params;
  const { month, year } = req.query;
  const { role, userId, messId: requesterMessId } = req.user!;

  if (role === 'member' && userId !== memberId) {
    throw new AppError('Members can only view their own attendance', 403);
  }

  if (role === 'member' && req.user!.messId && req.user!.messId !== messId) {
    throw new AppError('Members can only view attendance for their mess', 403);
  }

  if (role === 'manager' && requesterMessId && requesterMessId !== messId) {
    throw new AppError('Managers can only view attendance for their mess', 403);
  }

  const attendance = await attendanceService.getMemberAttendance(
    messId,
    memberId,
    parseInt(month as string),
    parseInt(year as string)
  );
  res.json(successResponse('Member attendance retrieved successfully', attendance));
});

export const getAttendanceStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { messId } = req.params;
  const { startDate, endDate } = req.query;
  const { role, messId: requesterMessId } = req.user!;

  if (role === 'manager' && requesterMessId && requesterMessId !== messId) {
    throw new AppError('Managers can only view attendance for their mess', 403);
  }

  const stats = await attendanceService.getAttendanceStats(
    messId,
    startDate as string,
    endDate as string
  );
  res.json(successResponse('Attendance statistics retrieved successfully', stats));
});
