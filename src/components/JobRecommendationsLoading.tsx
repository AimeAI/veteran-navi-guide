
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const JobRecommendationsLoading = () => {
  return (
    <div 
      className="space-y-4" 
      role="status" 
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-20" />
      </div>
      
      {[1, 2, 3].map((i) => (
        <Card key={i} className="w-full border border-gray-200">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex space-x-2 items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
            <div className="flex justify-between mt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
      <span className="sr-only">Loading job recommendations</span>
    </div>
  );
};

export default JobRecommendationsLoading;
