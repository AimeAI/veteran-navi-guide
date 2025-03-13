
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ForumTopicItemProps {
  id: string;
  title: string;
  category: string;
  replies: number;
  relevanceScore: number;
}

const ForumTopicItem: React.FC<ForumTopicItemProps> = ({
  id,
  title,
  category,
  replies,
  relevanceScore
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary/40 transition-colors">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="flex items-center mt-1 space-x-3">
            <Badge variant="outline">{category}</Badge>
            <span className="text-sm text-gray-500">{replies} replies</span>
          </div>
        </div>
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 h-fit">
          {relevanceScore}% Relevant
        </Badge>
      </div>
      <div className="flex justify-end mt-4">
        <Button asChild size="sm">
          <Link to={`/resources/forums/${id}`}>
            Join Discussion
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ForumTopicItem;
