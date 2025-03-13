
import React from 'react';
import { MessageSquare } from 'lucide-react';
import ForumTopicItem from './ForumTopicItem';
import EmptyState from './EmptyState';
import SeeAllLink from './SeeAllLink';

interface RecommendedForumTopic {
  id: string;
  title: string;
  category: string;
  replies: number;
  relevanceScore: number;
}

interface ForumTabProps {
  isLoading: boolean;
  forumTopics?: RecommendedForumTopic[];
}

const ForumTab: React.FC<ForumTabProps> = ({ isLoading, forumTopics }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="flex justify-end">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!forumTopics || forumTopics.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-12 w-12" />}
        title="No forum recommendations yet"
        description="Join the community to get relevant forum topics"
        actionLink="/resources/forums"
        actionText="Browse Forums"
      />
    );
  }

  return (
    <>
      {forumTopics.map((topic) => (
        <ForumTopicItem
          key={topic.id}
          id={topic.id}
          title={topic.title}
          category={topic.category}
          replies={topic.replies}
          relevanceScore={topic.relevanceScore}
        />
      ))}
      <SeeAllLink url="/resources/forums" text="See all topics" />
    </>
  );
};

export default ForumTab;
