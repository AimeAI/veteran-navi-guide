
import React, { useState, useEffect } from 'react';
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
import { supabase } from "@/integrations/supabase/client";

const ReviewModeration: React.FC = () => {
  const [reviews, setReviews] = useState<EmployerReview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);
  
  const fetchReviews = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase.from('employer_reviews').select('*');
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query.order('date_posted', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setReviews(data as EmployerReview[]);
    } catch (error) {
      console.error('Error fetching reviews for moderation:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter reviews based on search term
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesSearch;
  });
  
  // Handle review approval
  const handleApprove = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('employer_reviews')
        .update({ status: 'approved' })
        .eq('id', reviewId);
        
      if (error) throw error;
      
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, status: 'approved' } : review
      ));
      
      toast.success('Review approved and published');
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  };
  
  // Handle review rejection
  const handleReject = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('employer_reviews')
        .update({ status: 'rejected' })
        .eq('id', reviewId);
        
      if (error) throw error;
      
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, status: 'rejected' } : review
      ));
      
      toast.success('Review rejected');
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error('Failed to reject review');
    }
  };
  
  // Handle toggling review visibility
  const handleToggleVisibility = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      
      if (!review) return;
      
      const { error } = await supabase
        .from('employer_reviews')
        .update({ is_hidden: !review.isHidden })
        .eq('id', reviewId);
        
      if (error) throw error;
      
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, isHidden: !r.isHidden } : r
      ));
      
      toast.success(review.isHidden ? 'Review is now visible' : 'Review is now hidden');
    } catch (error) {
      console.error('Error updating review visibility:', error);
      toast.error('Failed to update review visibility');
    }
  };
  
  // Get counts by status
  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Review Moderation</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
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
