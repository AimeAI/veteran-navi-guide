import React from 'react';
import { Users, Briefcase, FileCheck, MessageSquare } from 'lucide-react';

export interface StatsCardGroupProps {
  stats?: {
    users?: number;
    applications?: number;
    jobs?: number;
    forum?: number;
    saved?: number;
    interviews?: number;
    offers?: number;
    recommendations?: number;
    forumPosts?: number;
  };
  loading?: boolean;
  children?: React.ReactNode;
}

const StatsCardGroup: React.FC<StatsCardGroupProps> = ({ stats = {}, loading = false, children }) => {
  if (children) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {children}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Users card */}
      {stats.users !== undefined && (
        <StatsCard
          title="Users"
          value={stats.users}
          icon={Users}
          description="Total registered users"
          trend={{ value: 8, isPositive: true }}
          className="bg-white"
        />
      )}
      
      {/* Applications card */}
      {stats.applications !== undefined && (
        <StatsCard
          title="Applications"
          value={stats.applications}
          icon={Briefcase}
          description="Total job applications"
          trend={stats.users !== undefined ? { value: 12, isPositive: true } : undefined}
          className="bg-white"
        />
      )}
      
      {/* Jobs card */}
      {stats.jobs !== undefined && (
        <StatsCard
          title="Active Jobs"
          value={stats.jobs}
          icon={FileCheck}
          description="Jobs available on platform"
          trend={stats.users !== undefined ? { value: 5, isPositive: true } : undefined}
          className="bg-white"
        />
      )}
      
      {/* Forum card */}
      {stats.forum !== undefined && (
        <StatsCard
          title="Forum Activity"
          value={stats.forum}
          icon={MessageSquare}
          description="Total posts and topics"
          trend={stats.users !== undefined ? { value: 15, isPositive: true } : undefined}
          className="bg-white"
        />
      )}
      
      {/* Saved Jobs card - for veteran dashboard */}
      {stats.saved !== undefined && (
        <StatsCard
          title="Saved Jobs"
          value={stats.saved}
          icon={Briefcase}
          description="Jobs you've bookmarked"
          className="bg-white"
        />
      )}
      
      {/* Recommendations card - for veteran dashboard */}
      {stats.recommendations !== undefined && (
        <StatsCard
          title="Recommendations"
          value={stats.recommendations}
          icon={FileCheck}
          description="New job matches"
          trend={{ value: 5, isPositive: true }}
          className="bg-white"
        />
      )}
      
      {/* Forum Posts card - for veteran dashboard */}
      {stats.forumPosts !== undefined && (
        <StatsCard
          title="Forum Activity"
          value={stats.forumPosts}
          icon={MessageSquare}
          description="Posts and replies"
          trend={{ value: 8, isPositive: true }}
          className="bg-white"
        />
      )}
    </div>
  );
};

export default StatsCardGroup;
