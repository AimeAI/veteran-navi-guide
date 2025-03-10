
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ReviewsLoading: React.FC = () => (
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
);

export default ReviewsLoading;
