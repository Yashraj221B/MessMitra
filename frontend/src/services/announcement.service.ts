import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface Announcement {
  id: string;
  messId: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

class AnnouncementService {
  /**
   * Create a new announcement
   */
  async createAnnouncement(data: {
    messId: string;
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<Announcement> {
    const response = await api.post(API_ENDPOINTS.ANNOUNCEMENTS.CREATE, {
      ...data,
      priority: data.priority || 'medium'
    });
    return response.data.data;
  }

  /**
   * Get all announcements for a mess
   */
  async getMessAnnouncements(messId: string, limit?: number): Promise<Announcement[]> {
    const params = limit ? { limit } : {};
    const response = await api.get(API_ENDPOINTS.ANNOUNCEMENTS.GET_MESS_ANNOUNCEMENTS(messId), { params });
    return response.data.data || [];
  }

  /**
   * Get single announcement by ID
   */
  async getAnnouncementById(announcementId: string): Promise<Announcement> {
    const response = await api.get(API_ENDPOINTS.ANNOUNCEMENTS.GET_BY_ID(announcementId));
    return response.data.data;
  }

  /**
   * Update an announcement
   */
  async updateAnnouncement(
    announcementId: string,
    data: {
      title?: string;
      message?: string;
      priority?: 'low' | 'medium' | 'high';
    }
  ): Promise<Announcement> {
    const response = await api.put(API_ENDPOINTS.ANNOUNCEMENTS.UPDATE(announcementId), data);
    return response.data.data;
  }

  /**
   * Delete an announcement
   */
  async deleteAnnouncement(announcementId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.ANNOUNCEMENTS.DELETE(announcementId));
  }

  /**
   * Get recent announcements for member view
   */
  async getRecentAnnouncements(messId: string): Promise<Announcement[]> {
    return this.getMessAnnouncements(messId, 10);
  }
}

export const announcementService = new AnnouncementService();
