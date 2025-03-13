
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLink: string;
  actionText: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLink,
  actionText
}) => {
  return (
    <div className="text-center py-8">
      <div className="h-12 w-12 text-gray-400 mx-auto mb-3">{icon}</div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <Button asChild size="sm">
        <Link to={actionLink}>{actionText}</Link>
      </Button>
    </div>
  );
};

export default EmptyState;
