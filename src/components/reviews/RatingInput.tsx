
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingInputProps {
  rating: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RatingInput: React.FC<RatingInputProps> = ({
  rating,
  onChange,
  size = 'md',
  className
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7'
  };

  const starSize = sizeClasses[size];
  
  const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              "cursor-pointer transition-colors",
              (hoverRating || rating) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}
      </div>
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-500">
          {ratingLabels[rating - 1]}
        </span>
      )}
    </div>
  );
};

export default RatingInput;
