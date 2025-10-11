// Feedback/Rating Service - Real backend API calls
import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface FoodRating {
  id: string;
  userId: string;
  messId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  rating: number;
  comment?: string;
  date: string;
  createdAt: string;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingsByMeal: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
}

class FeedbackService {
  /**
   * Submit food rating
   */
  async submitRating(data: {
    messId: string;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    rating: number;
    comment?: string;
    date?: string;
  }) {
    const response = await api.post(API_ENDPOINTS.FEEDBACK.CREATE, {
      ...data,
      date: data.date || new Date().toISOString().split('T')[0]
    });
    return response.data;
  }

  /**
   * Get user's own ratings
   */
  async getMyRatings(messId: string) {
    const response = await api.get(API_ENDPOINTS.FEEDBACK.GET_MY_FEEDBACK, {
      params: { messId }
    });
    return response.data.data || [];
  }

  /**
   * Get all ratings for a mess (Manager view)
   */
  async getMessRatings(messId: string) {
    const response = await api.get(API_ENDPOINTS.FEEDBACK.GET_MESS_FEEDBACK(messId));
    return response.data.data || [];
  }

  /**
   * Get rating statistics
   */
  async getRatingStats(messId: string): Promise<RatingStats> {
    try {
      const response = await api.get(API_ENDPOINTS.FEEDBACK.GET_STATS(messId));
      return response.data.data || {
        averageRating: 0,
        totalRatings: 0,
        ratingsByMeal: {
          breakfast: 0,
          lunch: 0,
          dinner: 0
        }
      };
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingsByMeal: {
          breakfast: 0,
          lunch: 0,
          dinner: 0
        }
      };
    }
  }

  /**
   * Get food ratings statistics with meal breakdown
   */
  async getFoodRatingsStats(messId: string, filter?: 'today' | 'week' | 'month') {
    try {
      const response = await api.get(API_ENDPOINTS.FEEDBACK.GET_FOOD_RATINGS(messId), {
        params: { filter }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching food ratings stats:', error);
      return {
        overall: {
          average: 0,
          total: 0,
          todayAverage: 0,
          todayTotal: 0,
          trend: 0
        },
        mealStats: {
          breakfast: { average: 0, total: 0 },
          lunch: { average: 0, total: 0 },
          dinner: { average: 0, total: 0 }
        },
        recentComments: []
      };
    }
  }
}

export const feedbackService = new FeedbackService();
