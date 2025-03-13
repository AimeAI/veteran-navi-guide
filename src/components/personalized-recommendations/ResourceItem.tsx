
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ResourceItemProps {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  relevanceScore: number;
}

const ResourceItem: React.FC<ResourceItemProps> = ({
  id,
  title,
  category,
  description,
  url,
  relevanceScore
}) => {
  return (
    <div key={id} className="border border-gray-200 rounded-lg p-4 hover:border-primary/40 transition-colors">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <Badge variant="outline" className="mt-1 mb-2">{category}</Badge>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 h-fit">
          {relevanceScore}% Relevant
        </Badge>
      </div>
      <div className="flex justify-end mt-4">
        <Button asChild size="sm">
          <Link to={url} className="flex items-center">
            View Resource
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ResourceItem;
