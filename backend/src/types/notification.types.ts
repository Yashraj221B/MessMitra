export interface CreateNotificationDTO {
  userId: string;
  messId?: string;
  type: 
    | 'announcement'
    | 'payment_reminder'
    | 'payment_received'
    | 'leave_approved'
    | 'leave_rejected'
    | 'join_request_approved'
    | 'join_request_rejected'
    | 'menu_updated'
    | 'general';
  title: string;
  message: string;
  actionUrl?: string;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  messId?: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}
