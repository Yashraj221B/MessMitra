import { Request, Response } from 'express';
import { AnnouncementService } from '../services/announcement.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { CreateAnnouncementDTO, UpdateAnnouncementDTO } from '../types/announcement.types';

const announcementService = new AnnouncementService();

export const createAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { userId } = req.user!;
  const data: CreateAnnouncementDTO = { ...req.body, messId };

  const announcement = await announcementService.createAnnouncement(userId, data);
  res.status(201).json(successResponse('Announcement created successfully', announcement));
});

export const getAnnouncementById = asyncHandler(async (req: Request, res: Response) => {
  const { announcementId } = req.params;

  const announcement = await announcementService.getAnnouncementById(announcementId);
  res.json(successResponse('Announcement retrieved successfully', announcement));
});

export const getMessAnnouncements = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { activeOnly } = req.query;

  const announcements = await announcementService.getMessAnnouncements(
    messId,
    activeOnly !== 'false'
  );
  res.json(successResponse('Announcements retrieved successfully', announcements));
});

export const updateAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const { announcementId } = req.params;
  const data: UpdateAnnouncementDTO = req.body;

  const announcement = await announcementService.updateAnnouncement(announcementId, data);
  res.json(successResponse('Announcement updated successfully', announcement));
});

export const deleteAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const { announcementId } = req.params;

  await announcementService.deleteAnnouncement(announcementId);
  res.json(successResponse('Announcement deleted successfully', null));
});
