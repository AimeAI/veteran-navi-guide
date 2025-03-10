import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { submitEmployerReview } from '@/services/reviewService';
import { getCurrentUserId, hasUserReviewedEmployer } from '@/utils/supabaseHelpers';
import { toast } from 'sonner';
import ReviewForm from './ReviewForm';

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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
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
    
    const newErrors: {[key: string]: string} = {};
    if (rating === 0) newErrors.rating = 'Please provide a rating';
    if (!title.trim()) newErrors.title = 'Please enter a review title';
    if (!reviewText.trim()) newErrors.comment = 'Please enter review comments';
    if (!name.trim()) newErrors.name = 'Please enter your name';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        status: 'pending' as const
      };
      
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
    setRating(0);
    setTitle('');
    setReviewText('');
    setPros('');
    setCons('');
    setPosition('');
    setName('');
    setIsSubmitting(false);
    setErrors({});
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
            <ReviewForm
              rating={rating}
              setRating={setRating}
              title={title}
              setTitle={setTitle}
              reviewText={reviewText}
              setReviewText={setReviewText}
              name={name}
              setName={setName}
              position={position}
              setPosition={setPosition}
              pros={pros}
              setPros={setPros}
              cons={cons}
              setCons={setCons}
              errors={errors}
            />
            
            <p className="text-xs text-gray-500 italic mt-6">
              Your review will be moderated before it appears publicly. Please ensure your review follows our community guidelines.
            </p>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
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
