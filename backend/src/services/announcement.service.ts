import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreateAnnouncementDTO, UpdateAnnouncementDTO, AnnouncementResponse } from '../types/announcement.types';

export class AnnouncementService {

  async createAnnouncement(managerId: string, data: CreateAnnouncementDTO): Promise<any> {
    const mess = await prisma.messes.findFirst({
      where: { id: data.messId, is_active: true }
    });
    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    const announcement = await prisma.announcements.create({
      data: {
        mess_id: data.messId,
        title: data.title,
        message: data.content,
        priority: data.priority || 'medium',
        target_audience: data.targetAudience || 'all',
        created_by: managerId,
        expires_at: data.expiresAt ? new Date(data.expiresAt) : null
      }
    });

    return {
      id: announcement.id,
      messId: announcement.mess_id,
      title: announcement.title,
      content: announcement.message,
      priority: announcement.priority || 'medium',
      targetAudience: announcement.target_audience || 'all',
      createdBy: announcement.created_by,
      expiresAt: announcement.expires_at as any,
      isActive: announcement.is_active || false,
      createdAt: announcement.created_at || new Date(),
      updatedAt: announcement.updated_at || new Date()
    };
  }

  async getAnnouncementById(announcementId: string): Promise<any> {
    const announcement = await prisma.announcements.findUnique({
      where: { id: announcementId }
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    return {
      id: announcement.id,
      messId: announcement.mess_id,
      title: announcement.title,
      content: announcement.message,
      priority: announcement.priority || 'medium',
      targetAudience: announcement.target_audience || 'all',
      createdBy: announcement.created_by,
      expiresAt: announcement.expires_at as any,
      isActive: announcement.is_active || false,
      createdAt: announcement.created_at || new Date(),
      updatedAt: announcement.updated_at || new Date()
    };
  }

  async getMessAnnouncements(messId: string, activeOnly: boolean = true): Promise<any[]> {
    const whereConditions: any = { mess_id: messId };
    
    if (activeOnly) {
      whereConditions.is_active = true;
    }

    const announcements = await prisma.announcements.findMany({
      where: whereConditions,
      orderBy: [
        { priority: 'desc' },
        { created_at: 'desc' }
      ]
    });

    // Filter out expired announcements if activeOnly
    const filteredAnnouncements = activeOnly
      ? announcements.filter((a: any) => !a.expires_at || a.expires_at > new Date())
      : announcements;

    return filteredAnnouncements.map((announcement: any) => ({
      id: announcement.id,
      messId: announcement.mess_id,
      title: announcement.title,
      content: announcement.message,
      priority: announcement.priority || 'medium',
      targetAudience: announcement.target_audience || 'all',
      createdBy: announcement.created_by,
      expiresAt: announcement.expires_at as any,
      isActive: announcement.is_active || false,
      createdAt: announcement.created_at || new Date(),
      updatedAt: announcement.updated_at || new Date()
    }));
  }

  async updateAnnouncement(announcementId: string, data: UpdateAnnouncementDTO): Promise<any> {
    const announcement = await prisma.announcements.findUnique({
      where: { id: announcementId }
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.message = data.content;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.targetAudience !== undefined) updateData.target_audience = data.targetAudience;
    if (data.expiresAt !== undefined) updateData.expires_at = data.expiresAt ? new Date(data.expiresAt) : null;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    const updatedAnnouncement = await prisma.announcements.update({
      where: { id: announcementId },
      data: updateData
    });

    return {
      id: updatedAnnouncement.id,
      messId: updatedAnnouncement.mess_id,
      title: updatedAnnouncement.title,
      content: updatedAnnouncement.message,
      priority: updatedAnnouncement.priority || 'medium',
      targetAudience: updatedAnnouncement.target_audience || 'all',
      createdBy: updatedAnnouncement.created_by,
      expiresAt: updatedAnnouncement.expires_at as any,
      isActive: updatedAnnouncement.is_active || false,
      createdAt: updatedAnnouncement.created_at || new Date(),
      updatedAt: updatedAnnouncement.updated_at || new Date()
    };
  }

  async deleteAnnouncement(announcementId: string): Promise<void> {
    const announcement = await prisma.announcements.findUnique({
      where: { id: announcementId }
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    // Soft delete
    await prisma.announcements.update({
      where: { id: announcementId },
      data: { is_active: false }
    });
  }
}
