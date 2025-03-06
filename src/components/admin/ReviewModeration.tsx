
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ThumbsUp, 
  Eye, 
  EyeOff, 
  Search 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployerReview } from '@/types/review';
import EmployerRating from '../EmployerRating';
import { toast } from 'sonner';

// Mock data for reviews pending moderation
const MOCK_REVIEWS: EmployerReview[] = [
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
    status: 'pending'
  },
  {
    id: 'review2',
    employerId: 'emp2',
    reviewerId: 'user2',
    reviewerName: 'Jane Smith',
    rating: 2,
    title: 'Disappointing experience',
    comment: 'Despite claiming to be veteran-friendly, there was little support for transitioning military personnel.',
    datePosted: '2023-10-12T09:15:00Z',
    isVerified: false,
    isHidden: false,
    position: 'Project Manager',
    pros: 'Good salary',
    cons: 'Poor management, high turnover, little support for veterans',
    status: 'pending'
  },
  {
    id: 'review3',
    employerId: 'emp3',
    reviewerId: 'user3',
    reviewerName: 'Mike Johnson',
    rating: 5,
    title: 'Excellent transition support',
    comment: 'This company truly understands the value of military experience. They provided excellent training and mentoring.',
    datePosted: '2023-10-10T16:45:00Z',
    isVerified: true,
    isHidden: false,
    position: 'Operations Lead',
    pros: 'Military skills highly valued, great team environment, career growth',
    cons: 'None to mention',
    status: 'pending'
  }
];

const ReviewModeration: React.FC = () => {
  const [reviews, setReviews] = useState<EmployerReview[]>(MOCK_REVIEWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  
  // Filter reviews based on search term and status
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle review approval
  const handleApprove = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status: 'approved' as const } : review
    ));
    toast.success('Review approved and published');
  };
  
  // Handle review rejection
  const handleReject = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status: 'rejected' as const } : review
    ));
    toast.success('Review rejected');
  };
  
  // Handle toggling review visibility
  const handleToggleVisibility = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, isHidden: !review.isHidden } : review
    ));
    
    const review = reviews.find(r => r.id === reviewId);
    toast.success(review?.isHidden ? 'Review is now visible' : 'Review is now hidden');
  };
  
  // Get counts by status
  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Review Moderation</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={statusFilter === 'pending' ? 'bg-yellow-50' : ''}
            onClick={() => setStatusFilter('pending')}
          >
            <AlertCircle className="h-4 w-4 mr-1.5 text-yellow-500" />
            Pending ({statusCounts.pending})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={statusFilter === 'approved' ? 'bg-green-50' : ''}
            onClick={() => setStatusFilter('approved')}
          >
            <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />
            Approved ({statusCounts.approved})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={statusFilter === 'rejected' ? 'bg-red-50' : ''}
            onClick={() => setStatusFilter('rejected')}
          >
            <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
            Rejected ({statusCounts.rejected})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={statusFilter === 'all' ? 'bg-gray-100' : ''}
            onClick={() => setStatusFilter('all')}
          >
            All ({statusCounts.all})
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-[180px]">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredReviews.length === 0 ? (
        <Card className="bg-gray-50 border border-dashed">
          <CardContent className="pt-6 text-center py-10">
            <p className="text-gray-500">No reviews match your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className={review.isHidden ? 'border-dashed opacity-75' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <EmployerRating rating={review.rating} />
                    {review.isVerified && (
                      <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      review.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ID: {review.id.substring(0, 8)}
                  </span>
                </div>
                
                <CardTitle className="text-lg">{review.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <span>by {review.reviewerName}</span>
                  {review.position && (
                    <>
                      <span className="mx-1.5">•</span>
                      <span>{review.position}</span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-500">Review</Label>
                    <p className="text-gray-700 mt-1">{review.comment}</p>
                  </div>
                  
                  {(review.pros || review.cons) && (
                    <div className="grid grid-cols-2 gap-4">
                      {review.pros && (
                        <div>
                          <Label className="text-sm text-gray-500">Pros</Label>
                          <p className="text-gray-700 mt-1">{review.pros}</p>
                        </div>
                      )}
                      
                      {review.cons && (
                        <div>
                          <Label className="text-sm text-gray-500">Cons</Label>
                          <p className="text-gray-700 mt-1">{review.cons}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
                    onClick={() => handleToggleVisibility(review.id)}
                  >
                    {review.isHidden ? (
                      <>
                        <Eye className="h-4 w-4 mr-1.5" />
                        <span>Show</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 mr-1.5" />
                        <span>Hide</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  {review.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(review.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        <span>Reject</span>
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-green-200 text-green-600 hover:bg-green-50"
                        onClick={() => handleApprove(review.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        <span>Approve</span>
                      </Button>
                    </>
                  )}
                  
                  {review.status === 'rejected' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-600 hover:bg-green-50"
                      onClick={() => handleApprove(review.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1.5" />
                      <span>Approve Instead</span>
                    </Button>
                  )}
                  
                  {review.status === 'approved' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(review.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1.5" />
                      <span>Reject Instead</span>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewModeration;
