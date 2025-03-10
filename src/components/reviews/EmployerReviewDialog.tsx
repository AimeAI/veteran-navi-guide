
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import EmployerRating from '@/components/EmployerRating';
import { Loader2 } from 'lucide-react';
import { submitEmployerReview } from '@/services/reviewService';
import { getCurrentUserId, hasUserReviewedEmployer } from '@/utils/supabaseHelpers';
import { toast } from 'sonner';

interface EmployerReviewDialogProps {
  employerId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EmployerReviewDialog: React.FC<EmployerReviewDialogProps> = ({
  employerId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [position, setPosition] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);

  // Check if user has already reviewed this employer
  React.useEffect(() => {
    if (isOpen) {
      const checkReviewStatus = async () => {
        const hasReviewed = await hasUserReviewedEmployer(employerId);
        setHasAlreadyReviewed(hasReviewed);
      };
      
      checkReviewStatus();
    }
  }, [isOpen, employerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    if (!title.trim() || !reviewText.trim() || !name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('You must be logged in to submit a review');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare the review data
      const reviewData = {
        employerId,
        reviewerId: userId,
        reviewerName: name,
        rating,
        title,
        comment: reviewText,
        position,
        pros,
        cons,
        status: 'pending'
      };
      
      // Convert to snake_case for database submission
      const { success, error } = await submitEmployerReview(reviewData);
      
      if (success) {
        toast.success('Review submitted successfully! It will be visible after moderation.');
        onSuccess?.();
        handleClose();
      } else {
        toast.error(`Failed to submit review: ${error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting your review');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    // Reset form state
    setRating(0);
    setTitle('');
    setReviewText('');
    setPros('');
    setCons('');
    setPosition('');
    setName('');
    setIsSubmitting(false);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        
        {hasAlreadyReviewed ? (
          <div className="py-6 text-center">
            <p className="text-amber-600 font-medium mb-2">You've already submitted a review for this employer</p>
            <p className="text-gray-500 text-sm">You can only submit one review per employer</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rating">Overall Rating</Label>
                <div className="pt-1">
                  <EmployerRating 
                    rating={rating}
                    onChange={setRating} 
                    size="lg"
                    interactive
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="How you want to appear (e.g., John S. or Anonymous Veteran)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={50}
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="position" className="flex justify-between">
                  <span>Position (optional)</span>
                </Label>
                <Input
                  id="position"
                  placeholder="Your role or position at this company"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  maxLength={100}
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="review-text">Your Review</Label>
                <Textarea
                  id="review-text"
                  placeholder="Please share your overall experience working with this employer"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-[100px]"
                  required
                  maxLength={2000}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="pros">Pros (optional)</Label>
                  <Textarea
                    id="pros"
                    placeholder="What did you like about working here?"
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                    className="min-h-[80px]"
                    maxLength={500}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="cons">Cons (optional)</Label>
                  <Textarea
                    id="cons"
                    placeholder="What didn't you like about working here?"
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                    className="min-h-[80px]"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || rating === 0}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployerReviewDialog;
