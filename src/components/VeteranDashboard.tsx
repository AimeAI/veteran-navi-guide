
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useJobs } from '@/context/JobContext';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCardGroup from './StatsCardGroup';
import { VeteranBadge } from '@/components/ui/veteran-badge';
import VeteranBadges from './VeteranBadges';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import { Eye, Calendar, Bookmark, ArrowRight, FileText, MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const VeteranDashboard = () => {
  const { user } = useUser();
  const { savedJobs, jobs, appliedJobs } = useJobs();
  
  const { data, isLoading } = useQuery({
    queryKey: ['veteranDashboard'],
    queryFn: async () => {
      console.log('Fetching veteran dashboard data...');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        stats: {
          applications: appliedJobs.length,
          saved: savedJobs.length,
          recommendations: 7,
          forumPosts: 3
        },
        earnedBadges: [
          {
            id: "badge1",
            type: "profile-complete",
            name: "Profile Master",
            description: "Completed your profile with all required information",
            earnedDate: new Date().toISOString(),
            icon: "badge",
            level: 1
          },
          {
            id: "badge2",
            type: "first-application",
            name: "Job Seeker",
            description: "Applied to your first job on the platform",
            earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            icon: "briefcase",
            level: 1
          }
        ],
        recentApplications: appliedJobs.slice(0, 3).map(id => {
          const job = jobs.find(j => j.id === id) || savedJobs.find(j => j.id === id);
          return {
            id,
            jobTitle: job?.title || 'Unknown Position',
            company: job?.company || 'Unknown Company',
            appliedDate: new Date(),
            status: Math.random() > 0.5 ? 'reviewing' : 'pending'
          };
        }),
        recommendedJobs: savedJobs.slice(0, 3).map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          matchScore: Math.floor(Math.random() * 30) + 70
        })),
        forumActivity: [
          {
            id: '1',
            title: 'Tips for transitioning to civilian IT roles',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            replies: 5
          },
          {
            id: '2',
            title: 'Resume help for logistics experience',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            replies: 3
          }
        ]
      };
    }
  });

  const welcomeMessage = user?.name 
    ? `Welcome back, ${user.name.split(' ')[0]}!` 
    : 'Welcome to your dashboard!';

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{welcomeMessage}</h2>
        <p className="text-gray-600">
          Track your job search progress and get personalized recommendations.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-12 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <StatsCardGroup stats={data?.stats || { applications: 0, saved: 0, recommendations: 0, forumPosts: 0 }} />
      )}

      {/* Personalized Recommendations Section */}
      <div className="mb-8">
        <PersonalizedRecommendations />
      </div>

      {/* Earned Badges Section */}
      {!isLoading && data?.earnedBadges && (
        <div className="mb-8">
          <VeteranBadges 
            earnedBadges={data.earnedBadges} 
            className="animate-fade-in"
          />
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Applications</h3>
          <Link to="/history" className="text-primary text-sm font-medium flex items-center hover:underline">
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-24 mb-1" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.recentApplications && data.recentApplications.length > 0 ? (
          <div className="space-y-4">
            {data.recentApplications.map((application) => (
              <Card key={application.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{application.jobTitle}</h4>
                      <p className="text-sm text-gray-600">{application.company}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Applied {application.appliedDate.toLocaleDateString()}
                      </div>
                    </div>
                    <Badge 
                      className={cn(
                        "px-3 py-1 capitalize",
                        application.status === 'reviewing' ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : 
                        application.status === 'pending' ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""
                      )}
                    >
                      {application.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h4 className="text-gray-900 font-medium mb-1">No applications yet</h4>
              <p className="text-gray-600 text-sm mb-4">Start applying to jobs to track your progress</p>
              <Button asChild size="sm">
                <Link to="/job-search">Browse Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recommended For You</h3>
          <Link to="/recommendations" className="text-primary text-sm font-medium flex items-center hover:underline">
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-24 mb-1" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.recommendedJobs && data.recommendedJobs.length > 0 ? (
          <div className="space-y-4">
            {data.recommendedJobs.map(job => (
              <Card key={job.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {job.matchScore}% Match
                      </Badge>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h4 className="text-gray-900 font-medium mb-1">No recommendations yet</h4>
              <p className="text-gray-600 text-sm mb-4">Complete your profile to get personalized job matches</p>
              <Button asChild size="sm">
                <Link to="/profile">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Community Activity</h3>
          <Link to="/resources/forums" className="text-primary text-sm font-medium flex items-center hover:underline">
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.forumActivity && data.forumActivity.length > 0 ? (
          <div className="space-y-4">
            {data.forumActivity.map(post => (
              <Card key={post.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <MessageSquare className="h-10 w-10 text-primary/60 mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900">{post.title}</h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date.toLocaleDateString()}
                        <span className="mx-2">•</span>
                        <Eye className="h-3 w-3 mr-1" />
                        {post.replies} {post.replies === 1 ? 'reply' : 'replies'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h4 className="text-gray-900 font-medium mb-1">No forum activity yet</h4>
              <p className="text-gray-600 text-sm mb-4">Join the community to connect with other veterans</p>
              <Button asChild size="sm">
                <Link to="/resources/forums">Browse Forums</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VeteranDashboard;
