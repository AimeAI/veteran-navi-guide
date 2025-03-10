
import React from 'react';
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
  ThumbsUp, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { EmployerReview } from '@/types/review';
import EmployerRating from '@/components/EmployerRating';

interface ReviewCardProps {
  review: EmployerReview;
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
  onToggleVisibility: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onApprove,
  onReject,
  onToggleVisibility
}) => {
  return (
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
            onClick={() => onToggleVisibility(review.id)}
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
                onClick={() => onReject(review.id)}
              >
                <XCircle className="h-4 w-4 mr-1.5" />
                <span>Reject</span>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="border-green-200 text-green-600 hover:bg-green-50"
                onClick={() => onApprove(review.id)}
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
              onClick={() => onApprove(review.id)}
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
              onClick={() => onReject(review.id)}
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              <span>Reject Instead</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
