export interface MarkAttendanceDTO {
  messId: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner';
  status?: 'present' | 'absent' | 'on-leave';
  scanMethod?: 'qr' | 'manual';
  location?: any;
  deviceInfo?: any;
}

export interface AttendanceResponse {
  id: string;
  messId: string;
  memberId: string;
  memberName?: string;
  date: string;
  mealType: string;
  status: string;
  scanMethod?: string;
  scannedAt?: Date;
  scannedBy?: string;
  createdAt: Date;
}

export interface AttendanceReportQuery {
  messId: string;
  startDate?: string;
  endDate?: string;
  memberId?: string;
  mealType?: string;
  status?: string;
}
