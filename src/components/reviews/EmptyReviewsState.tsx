
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const EmptyReviewsState: React.FC = () => {
  return (
    <Card className="bg-gray-50 border border-dashed">
      <CardContent className="pt-6 text-center py-10">
        <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No reviews yet. Be the first to review this employer!</p>
      </CardContent>
    </Card>
  );
};

export default EmptyReviewsState;
