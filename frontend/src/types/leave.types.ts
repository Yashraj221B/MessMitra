// Leave management type definitions

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  phone: string;
  room: string;
  startDate: string;
  endDate: string;
  reason: string;
  requestDate: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewNotes?: string;
}

export interface LeaveFormData {
  startDate: string;
  endDate: string;
  reason: string;
}
