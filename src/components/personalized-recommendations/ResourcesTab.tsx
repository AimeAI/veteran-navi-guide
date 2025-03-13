
import React from 'react';
import { BookOpen } from 'lucide-react';
import ResourceItem from './ResourceItem';
import EmptyState from './EmptyState';
import SeeAllLink from './SeeAllLink';

interface RecommendedResource {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  relevanceScore: number;
}

interface ResourcesTabProps {
  isLoading: boolean;
  resources?: RecommendedResource[];
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({ isLoading, resources }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="h-12 w-12" />}
        title="No resource recommendations yet"
        description="Complete your profile to get relevant resources"
        actionLink="/profile"
        actionText="Update Profile"
      />
    );
  }

  return (
    <>
      {resources.map((resource) => (
        <ResourceItem
          key={resource.id}
          id={resource.id}
          title={resource.title}
          category={resource.category}
          description={resource.description}
          url={resource.url}
          relevanceScore={resource.relevanceScore}
        />
      ))}
      <SeeAllLink url="/resources" text="See all resources" />
    </>
  );
};

export default ResourcesTab;
