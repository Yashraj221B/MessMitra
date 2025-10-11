import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreateFeedbackDTO, FeedbackResponse, FeedbackStatsResponse } from '../types/feedback.types';

export class FeedbackService {

  async createFeedback(memberId: string, data: CreateFeedbackDTO): Promise<FeedbackResponse> {
    const member = await prisma.users.findFirst({
      where: { id: memberId, join_status: 'approved' }
    });
    if (!member || !member.mess_id) {
      throw new AppError('Member not found or not approved in any mess', 404);
    }

    const feedback = await prisma.feedbacks.create({
      data: {
        mess_id: member.mess_id,
        member_id: data.isAnonymous ? null : memberId,
        rating: data.rating,
        comment: data.comment || null,
        category: (data.category === 'pricing' ? 'other' : data.category) as any || 'other',
        is_anonymous: data.isAnonymous || false
      }
    });

    return {
      id: feedback.id,
      messId: feedback.mess_id,
      memberId: feedback.member_id || undefined,
      memberName: data.isAnonymous ? undefined : member.name,
      rating: feedback.rating,
      comment: feedback.comment || undefined,
      category: feedback.category || 'other',
      isAnonymous: feedback.is_anonymous || false,
      createdAt: feedback.created_at || new Date()
    };
  }

  async getFeedbackById(feedbackId: string): Promise<FeedbackResponse> {
    const feedback = await prisma.feedbacks.findUnique({
      where: { id: feedbackId },
      include: {
        users_feedbacks_member_idTousers: true
      }
    });

    if (!feedback) {
      throw new AppError('Feedback not found', 404);
    }

    return {
      id: feedback.id,
      messId: feedback.mess_id,
      memberId: feedback.member_id || undefined,
      memberName: feedback.is_anonymous ? undefined : feedback.users_feedbacks_member_idTousers?.name,
      rating: feedback.rating,
      comment: feedback.comment || undefined,
      category: feedback.category || 'other',
      isAnonymous: feedback.is_anonymous || false,
      createdAt: feedback.created_at || new Date()
    };
  }

  async getMessFeedback(messId: string, category?: string): Promise<FeedbackResponse[]> {
    const whereConditions: any = { mess_id: messId };
    if (category) {
      whereConditions.category = category;
    }

    const feedbacks = await prisma.feedbacks.findMany({
      where: whereConditions,
      include: {
        users_feedbacks_member_idTousers: true
      },
      orderBy: { created_at: 'desc' }
    });

    return feedbacks.map(feedback => ({
      id: feedback.id,
      messId: feedback.mess_id,
      memberId: feedback.member_id || undefined,
      memberName: feedback.is_anonymous ? undefined : feedback.users_feedbacks_member_idTousers?.name,
      rating: feedback.rating,
      comment: feedback.comment || undefined,
      category: feedback.category || 'other',
      isAnonymous: feedback.is_anonymous || false,
      createdAt: feedback.created_at || new Date()
    }));
  }

  async getFeedbackStats(messId: string): Promise<FeedbackStatsResponse> {
    const feedbacks = await prisma.feedbacks.findMany({
      where: { mess_id: messId }
    });

    const totalFeedback = feedbacks.length;
    const averageRating = totalFeedback > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;

    const ratingDistribution = {
      '1': feedbacks.filter(f => f.rating === 1).length,
      '2': feedbacks.filter(f => f.rating === 2).length,
      '3': feedbacks.filter(f => f.rating === 3).length,
      '4': feedbacks.filter(f => f.rating === 4).length,
      '5': feedbacks.filter(f => f.rating === 5).length
    };

    const categoryBreakdown: Record<string, number> = {};
    feedbacks.forEach(f => {
      categoryBreakdown[f.category || 'other'] = (categoryBreakdown[f.category || 'other'] || 0) + 1;
    });

    return {
      totalFeedbacks: totalFeedback,
      averageRating: parseFloat(averageRating.toFixed(2)),
      ratingDistribution,
      categoryBreakdown
    };
  }
}
