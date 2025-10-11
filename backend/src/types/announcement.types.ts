export interface CreateAnnouncementDTO {
  messId: string;
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience?: 'all' | 'members' | 'managers';
  expiresAt?: string; // ISO date string
}

export interface UpdateAnnouncementDTO extends Partial<CreateAnnouncementDTO> {
  isActive?: boolean;
}

export interface AnnouncementResponse {
  id: string;
  messId: string;
  title: string;
  content: string;
  priority: string;
  targetAudience: string;
  isActive: boolean;
  expiresAt?: Date;
  createdBy: string;
  createdByName?: string;
  createdAt: Date;
  updatedAt: Date;
}
