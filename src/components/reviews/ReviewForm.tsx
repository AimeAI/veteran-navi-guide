
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import FormErrorMessage from '@/components/ui/form-error-message';
import RatingInput from './RatingInput';

interface ReviewFormProps {
  rating: number;
  setRating: (rating: number) => void;
  title: string;
  setTitle: (title: string) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  name: string;
  setName: (name: string) => void;
  position: string;
  setPosition: (position: string) => void;
  pros: string;
  setPros: (pros: string) => void;
  cons: string;
  setCons: (cons: string) => void;
  errors: {[key: string]: string};
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  rating, setRating,
  title, setTitle,
  reviewText, setReviewText,
  name, setName,
  position, setPosition,
  pros, setPros,
  cons, setCons,
  errors
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="rating">Overall Rating <span className="text-red-500">*</span></Label>
        <div className="pt-1">
          <RatingInput 
            rating={rating}
            onChange={setRating} 
            size="lg"
          />
        </div>
        {errors.rating && <FormErrorMessage message={errors.rating} />}
      </div>
      
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="title">Review Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          placeholder="Summarize your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
        />
        {errors.title && <FormErrorMessage message={errors.title} />}
      </div>
      
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Your Name <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          placeholder="How you want to appear (e.g., John S. or Anonymous Veteran)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={50}
        />
        {errors.name && <FormErrorMessage message={errors.name} />}
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
        <Label htmlFor="review-text">Your Review <span className="text-red-500">*</span></Label>
        <Textarea
          id="review-text"
          placeholder="Please share your overall experience working with this employer"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="min-h-[100px]"
          required
          maxLength={2000}
        />
        {errors.comment && <FormErrorMessage message={errors.comment} />}
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
  );
};

export default ReviewForm;
