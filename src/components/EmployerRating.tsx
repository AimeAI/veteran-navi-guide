
import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmployerRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const EmployerRating: React.FC<EmployerRatingProps> = ({
  rating,
  size = 'md',
  className,
  showText = false,
  interactive = false,
  onChange
}) => {
  // Convert rating to nearest half-star (e.g., 4.3 becomes 4.5, 4.1 becomes 4)
  const roundedRating = Math.round(rating * 2) / 2;
  
  // Size mapping for stars
  const sizeMap = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  // Generate stars based on the rating
  const renderStars = () => {
    const stars = [];
    const starSize = sizeMap[size];
    
    // Add full stars
    for (let i = 1; i <= Math.floor(roundedRating); i++) {
      stars.push(
        <Star 
          key={`star-${i}`} 
          className={cn(
            `${starSize} fill-yellow-400 text-yellow-400`,
            interactive && "cursor-pointer"
          )}
          aria-hidden="true"
          onClick={() => interactive && onChange && onChange(i)}
        />
      );
    }
    
    // Add half star if needed
    if (roundedRating % 1 !== 0) {
      stars.push(
        <StarHalf 
          key="star-half" 
          className={cn(
            `${starSize} fill-yellow-400 text-yellow-400`,
            interactive && "cursor-pointer"
          )}
          aria-hidden="true"
          onClick={() => interactive && onChange && onChange(Math.ceil(roundedRating))}
        />
      );
    }
    
    // Add empty stars
    for (let i = Math.ceil(roundedRating); i < 5; i++) {
      stars.push(
        <Star 
          key={`star-empty-${i}`} 
          className={cn(
            `${starSize} text-gray-300`,
            interactive && "cursor-pointer"
          )}
          aria-hidden="true"
          onClick={() => interactive && onChange && onChange(i + 1)}
        />
      );
    }
    
    return stars;
  };
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
        {renderStars()}
      </div>
      
      {showText && (
        <span className={cn(
          "ml-1.5 text-gray-700",
          size === 'sm' && "text-xs",
          size === 'md' && "text-sm",
          size === 'lg' && "text-base"
        )}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default EmployerRating;
