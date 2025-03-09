
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import FormErrorMessage from '@/components/ui/form-error-message';
import { submitEmployerReview } from '@/services/reviewService';
import { hasUserReviewedEmployer, getCurrentUserId } from '@/utils/supabaseHelpers';

interface EmployerReviewDialogProps {
  employerId: string;
  employerName: string;
  onReviewSubmitted?: () => void;
}

const EmployerReviewDialog: React.FC<EmployerReviewDialogProps> = ({
  employerId,
  employerName,
  onReviewSubmitted
}) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [position, setPosition] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [hasReviewed, setHasReviewed] = useState(false);
  
  useEffect(() => {
    // Check if user has already reviewed this employer
    const checkReviewStatus = async () => {
      if (user) {
        const reviewed = await hasUserReviewedEmployer(employerId);
        setHasReviewed(reviewed);
      }
    };
    
    checkReviewStatus();
  }, [employerId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {[key: string]: string} = {};
    if (rating === 0) newErrors.rating = 'Please select a rating';
    if (!title.trim()) newErrors.title = 'Please enter a review title';
    if (!comment.trim()) newErrors.comment = 'Please enter review comments';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user ID from Supabase
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('You must be logged in to submit a review');
        setIsSubmitting(false);
        return;
      }
      
      const reviewData = {
        employer_id: employerId,
        reviewer_id: userId,
        reviewer_name: user?.name || 'Anonymous User',
        rating,
        title,
        comment,
        position,
        pros,
        cons,
        status: 'pending'
      };
      
      const result = await submitEmployerReview(reviewData);
      
      if (result.success) {
        toast.success('Review submitted successfully!', {
          description: 'Your review will be visible after moderation approval.'
        });
        
        // Reset form
        setRating(0);
        setTitle('');
        setComment('');
        setPosition('');
        setPros('');
        setCons('');
        setErrors({});
        setHasReviewed(true);
        
        // Close dialog
        setOpen(false);
        
        // Notify parent
        if (onReviewSubmitted) onReviewSubmitted();
      } else {
        toast.error('Failed to submit review', {
          description: result.error || 'Please try again later.'
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full"
          disabled={hasReviewed}
        >
          {hasReviewed ? 'You have reviewed this employer' : 'Write a Review'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review {employerName}</DialogTitle>
          <DialogDescription>
            Share your experience working with this employer to help other veterans.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rating" className="block">Overall Rating <span className="text-red-500">*</span></Label>
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-7 w-7 cursor-pointer",
                    (hoverRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating > 0 ? [
                  'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'
                ][rating - 1] : 'Select rating'}
              </span>
            </div>
            {errors.rating && <FormErrorMessage message={errors.rating} />}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position at Company</Label>
            <Input
              id="position"
              name="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Software Developer, Project Manager"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Review Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              required
            />
            {errors.title && <FormErrorMessage message={errors.title} />}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Review Comments <span className="text-red-500">*</span></Label>
            <Textarea
              id="comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details of your experience working with this employer"
              className="min-h-[100px]"
              required
            />
            {errors.comment && <FormErrorMessage message={errors.comment} />}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pros">Pros</Label>
            <Textarea
              id="pros"
              name="pros"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              placeholder="What did you like about working here?"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cons">Cons</Label>
            <Textarea
              id="cons"
              name="cons"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              placeholder="What could be improved?"
              className="min-h-[80px]"
            />
          </div>
          
          <p className="text-xs text-gray-500 italic mt-6">
            Your review will be moderated before it appears publicly. Please ensure your review follows our community guidelines.
          </p>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployerReviewDialog;
