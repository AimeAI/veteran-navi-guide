
import React from 'react';
import StatsCard from './StatsCard';
import { Briefcase, Star, Bookmark, MessageSquare } from 'lucide-react';

interface StatsCardGroupProps {
  stats: {
    applications: number;
    saved: number;
    recommendations: number;
    forumPosts: number;
  };
  loading?: boolean;
}

const StatsCardGroup: React.FC<StatsCardGroupProps> = ({ stats, loading = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Applications"
        value={stats.applications}
        icon={Briefcase}
        description="Total job applications"
        trend={{ value: 12, isPositive: true }}
        className="bg-white"
      />
      
      <StatsCard
        title="Saved Jobs"
        value={stats.saved}
        icon={Bookmark}
        description="Jobs you've bookmarked"
        className="bg-white"
      />
      
      <StatsCard
        title="Recommendations"
        value={stats.recommendations}
        icon={Star}
        description="New job matches"
        trend={{ value: 5, isPositive: true }}
        className="bg-white"
      />
      
      <StatsCard
        title="Forum Activity"
        value={stats.forumPosts}
        icon={MessageSquare}
        description="Posts and replies"
        trend={{ value: 8, isPositive: true }}
        className="bg-white"
      />
    </div>
  );
};

export default StatsCardGroup;
