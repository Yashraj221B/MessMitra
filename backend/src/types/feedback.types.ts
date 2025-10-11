export interface CreateFeedbackDTO {
  messId: string;
  memberId: string;
  rating: number; // 1-5
  comment?: string;
  category?: 'food_quality' | 'service' | 'cleanliness' | 'pricing' | 'other';
  date?: string; // YYYY-MM-DD
  mealType?: 'breakfast' | 'lunch' | 'dinner';
  isAnonymous?: boolean;
}

export interface FeedbackResponse {
  id: string;
  messId: string;
  memberId: string;
  memberName?: string;
  rating: number;
  comment?: string;
  category: string;
  date?: string;
  mealType?: string;
  isAnonymous: boolean;
  createdAt: Date;
}

export interface FeedbackStatsResponse {
  averageRating: number;
  totalFeedbacks: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryBreakdown: Record<string, number>;
}
