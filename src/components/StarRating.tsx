
import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  onChange,
  readOnly = false,
  size = 20,
  className
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (newRating: number) => {
    if (readOnly) return;
    setRating(newRating);
    onChange?.(newRating);
  };

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  // Logic for rendering stars
  const renderStars = () => {
    const stars = [];
    const activeRating = hoverRating || rating;

    for (let i = 1; i <= 5; i++) {
      const starValue = i;
      const halfStarValue = i - 0.5;
      
      // Full star case
      if (activeRating >= starValue) {
        stars.push(
          <Star
            key={`star-${i}`}
            className={cn("star fill-soccer-score text-soccer-score", readOnly ? "cursor-default" : "cursor-pointer")}
            size={size}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            fill="currentColor"
          />
        );
      } 
      // Half star case
      else if (activeRating >= halfStarValue) {
        stars.push(
          <div
            key={`star-${i}`}
            className="relative"
            onClick={() => handleClick(halfStarValue)}
            onMouseEnter={() => handleMouseEnter(halfStarValue)}
            onMouseLeave={handleMouseLeave}
          >
            <Star className={cn("star absolute text-gray-300", readOnly ? "cursor-default" : "cursor-pointer")} size={size} />
            <div className="overflow-hidden w-1/2">
              <Star className={cn("star fill-soccer-score text-soccer-score", readOnly ? "cursor-default" : "cursor-pointer")} size={size} fill="currentColor" />
            </div>
          </div>
        );
      } 
      // Empty star case
      else {
        stars.push(
          <Star
            key={`star-${i}`}
            className={cn("star text-gray-300", readOnly ? "cursor-default" : "cursor-pointer")}
            size={size}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className={cn("star-rating flex items-center gap-1", className)}>
      {renderStars()}
      {!readOnly && (
        <span className="ml-2 text-sm text-gray-500">
          {hoverRating || rating || 0}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
