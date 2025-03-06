
import { EmployerReview, EmployerRatingSummary } from '@/types/review';

// Mock data for employer reviews
export const mockEmployerReviews: Record<string, EmployerReview[]> = {
  'emp1': [
    {
      id: 'review1',
      employerId: 'emp1',
      reviewerId: 'user1',
      reviewerName: 'John Doe',
      rating: 4.5,
      title: 'Great place to work for veterans',
      comment: 'The company has a great culture and really values military experience. They provide good mentoring and growth opportunities.',
      datePosted: '2023-10-15T14:30:00Z',
      isVerified: true,
      isHidden: false,
      position: 'Security Specialist',
      pros: 'Flexible hours, veteran-friendly policies, good benefits',
      cons: 'Some processes are still developing as they grow',
      helpfulCount: 5,
      status: 'approved'
    },
    {
      id: 'review2',
      employerId: 'emp1',
      reviewerId: 'user2',
      reviewerName: 'Jane Smith',
      rating: 5,
      title: 'Excellent transition support',
      comment: 'This company truly understands the value of military experience. They provided excellent training and mentoring to help me transition from military to civilian work life.',
      datePosted: '2023-09-25T09:15:00Z',
      isVerified: true,
      isHidden: false,
      position: 'Project Manager',
      pros: 'Supportive environment, great mentoring, good training programs',
      cons: 'Some roles require relocation',
      helpfulCount: 3,
      status: 'approved'
    },
    {
      id: 'review3',
      employerId: 'emp1',
      reviewerId: 'user3',
      reviewerName: 'Mike Johnson',
      rating: 4,
      title: 'Good work-life balance',
      comment: 'The company offers flexible working hours and respects personal time. Management is understanding of family commitments.',
      datePosted: '2023-08-10T16:45:00Z',
      isVerified: false,
      isHidden: false,
      position: 'Software Developer',
      pros: 'Flexible hours, remote work options, competitive pay',
      cons: 'Career advancement can be slow in some departments',
      helpfulCount: 2,
      status: 'approved'
    }
  ]
};

// Calculate rating summaries from reviews
export const getEmployerRatingSummary = (employerId: string): EmployerRatingSummary => {
  const reviews = mockEmployerReviews[employerId] || [];
  const approvedReviews = reviews.filter(r => r.status === 'approved' && !r.isHidden);
  
  if (approvedReviews.length === 0) {
    return {
      avgRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
  
  // Calculate average rating
  const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = totalRating / approvedReviews.length;
  
  // Calculate rating distribution
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  approvedReviews.forEach(review => {
    const roundedRating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
    ratingDistribution[roundedRating]++;
  });
  
  return {
    avgRating,
    totalReviews: approvedReviews.length,
    ratingDistribution
  };
};

// Get employer reviews
export const getEmployerReviews = (employerId: string): EmployerReview[] => {
  const reviews = mockEmployerReviews[employerId] || [];
  return reviews
    .filter(r => r.status === 'approved' && !r.isHidden)
    .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
};
