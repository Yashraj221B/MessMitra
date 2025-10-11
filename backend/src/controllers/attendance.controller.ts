import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { MarkAttendanceDTO, AttendanceReportQuery } from '../types/attendance.types';

const attendanceService = new AttendanceService();

export const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  const data: MarkAttendanceDTO = req.body;

  const attendance = await attendanceService.markAttendance(data);
  res.status(201).json(successResponse('Attendance marked successfully', attendance));
});

export const getAttendanceById = asyncHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.params;

  const attendance = await attendanceService.getAttendanceById(attendanceId);
  res.json(successResponse('Attendance retrieved successfully', attendance));
});

export const getAttendanceReport = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const query = { ...req.query, messId } as AttendanceReportQuery;

  const report = await attendanceService.getAttendanceReport(messId, query);
  res.json(successResponse('Attendance report retrieved successfully', report));
});

export const getMemberAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { messId, memberId } = req.params;
  const { month, year } = req.query;

  const attendance = await attendanceService.getMemberAttendance(
    messId,
    memberId,
    parseInt(month as string),
    parseInt(year as string)
  );
  res.json(successResponse('Member attendance retrieved successfully', attendance));
});

export const getAttendanceStats = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { startDate, endDate } = req.query;

  const stats = await attendanceService.getAttendanceStats(
    messId,
    startDate as string,
    endDate as string
  );
  res.json(successResponse('Attendance statistics retrieved successfully', stats));
});
