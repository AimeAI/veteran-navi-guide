
export interface EmployerReview {
  id: string;
  employerId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  datePosted: string;
  isVerified: boolean;
  isHidden: boolean;
  workExperience?: string;
  position?: string;
  pros?: string;
  cons?: string;
  helpfulCount?: number;
  // For moderation
  status: 'pending' | 'approved' | 'rejected';
}

export interface EmployerRatingSummary {
  avgRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
