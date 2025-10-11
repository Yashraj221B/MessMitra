export interface CreateLeaveDTO {
  messId: string;
  memberId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  category?: 'personal' | 'medical' | 'vacation' | 'other';
}

export interface UpdateLeaveStatusDTO {
  status: 'approved' | 'rejected' | 'cancelled';
  reviewNotes?: string;
}

export interface LeaveResponse {
  id: string;
  messId: string;
  memberId: string;
  memberName?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  category: string;
  status: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
