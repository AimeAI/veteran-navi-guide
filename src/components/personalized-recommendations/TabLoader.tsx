
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TabLoaderProps {
  error: Error | null;
  isLoading: boolean;
  children: React.ReactNode;
}

const TabLoader: React.FC<TabLoaderProps> = ({ error, isLoading, children }) => {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <Info className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium mb-2">Unable to load recommendations</h3>
          <p className="text-sm text-gray-600 mb-4">
            We encountered an error while loading your personalized recommendations.
          </p>
          <Button variant="outline" size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default TabLoader;
