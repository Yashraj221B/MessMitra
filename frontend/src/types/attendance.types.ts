// Attendance-related type definitions

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner';
  status: AttendanceStatus;
}

export interface DailyAttendance {
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  records: AttendanceRecord[];
}
