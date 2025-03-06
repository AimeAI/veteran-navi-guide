
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, MessageSquare, Calendar, Star, Info, ExternalLink, ArrowRight } from 'lucide-react';
import { calculateMatchScore, Job } from '@/utils/recommendationAlgorithm';
import { cn } from '@/lib/utils';
import JobRecommendationsLoading from './JobRecommendationsLoading';

interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  location: string;
  remote?: boolean;
}

interface RecommendedResource {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  relevanceScore: number;
}

interface RecommendedForumTopic {
  id: string;
  title: string;
  category: string;
  replies: number;
  relevanceScore: number;
}

interface RecommendedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  virtual: boolean;
  relevanceScore: number;
}

const PersonalizedRecommendations = () => {
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ['personalizedRecommendations', user?.email],
    queryFn: async () => {
      console.log('Fetching personalized recommendations for:', user?.email);
      
      // This would be replaced with actual Supabase fetch
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock data for demonstration
      return {
        jobs: [
          {
            id: "job1",
            title: "Security Specialist",
            company: "TechDefense Solutions",
            matchScore: 95,
            location: "Ottawa, ON",
            remote: false
          },
          {
            id: "job2",
            title: "Logistics Coordinator",
            company: "Supply Chain Enterprises",
            matchScore: 87,
            location: "Remote",
            remote: true
          },
          {
            id: "job3",
            title: "Project Manager",
            company: "Veterans Construction Group",
            matchScore: 82,
            location: "Toronto, ON",
            remote: false
          }
        ],
        resources: [
          {
            id: "res1",
            title: "Resume Building for Veterans",
            category: "Career Development",
            description: "Learn how to translate military experience to civilian terms",
            url: "/resources/resume-building",
            relevanceScore: 90
          },
          {
            id: "res2",
            title: "Military Benefits Guide",
            category: "Benefits",
            description: "Comprehensive guide to veteran benefits in Canada",
            url: "/resources/benefits-guide",
            relevanceScore: 85
          }
        ],
        forumTopics: [
          {
            id: "forum1",
            title: "Transitioning to IT Careers",
            category: "Career Transition",
            replies: 24,
            relevanceScore: 88
          },
          {
            id: "forum2",
            title: "Networking Tips for Veterans",
            category: "Networking",
            replies: 15,
            relevanceScore: 82
          }
        ],
        events: [
          {
            id: "event1",
            title: "Veterans Career Fair",
            date: "2023-11-15T10:00:00",
            location: "Ottawa Convention Center",
            virtual: false,
            relevanceScore: 94
          },
          {
            id: "event2",
            title: "Military to Civilian Resume Workshop",
            date: "2023-11-08T14:00:00",
            location: "Virtual",
            virtual: true,
            relevanceScore: 89
          }
        ]
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    console.error('Error fetching recommendations:', error);
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

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          <Star className="h-5 w-5 mr-2 text-primary" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="forum" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Forum</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="space-y-4">
            {isLoading ? (
              <JobRecommendationsLoading />
            ) : data?.jobs && data.jobs.length > 0 ? (
              <>
                {data.jobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary/40 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{job.title}</h3>
                        <p className="text-gray-600 text-sm">{job.company}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500 space-x-3">
                          <span>{job.location}</span>
                          {job.remote && <Badge variant="outline">Remote</Badge>}
                        </div>
                      </div>
                      <Badge className={cn(
                        "bg-green-100 text-green-800 border-green-200",
                        job.matchScore >= 90 ? "bg-green-100 text-green-800 border-green-200" :
                        job.matchScore >= 80 ? "bg-blue-100 text-blue-800 border-blue-200" :
                        "bg-gray-100 text-gray-800 border-gray-200"
                      )}>
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" className="mr-2">
                        Save
                      </Button>
                      <Button asChild size="sm">
                        <Link to={`/job-details/${job.id}`}>
                          View Job
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-right mt-2">
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <Link to="/recommendations" className="flex items-center">
                      See all recommendations
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No job recommendations yet</h3>
                <p className="text-gray-600 text-sm mb-4">Complete your profile to get personalized job matches</p>
                <Button asChild size="sm">
                  <Link to="/profile">Update Profile</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            {isLoading ? (
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
            ) : data?.resources && data.resources.length > 0 ? (
              <>
                {data.resources.map((resource) => (
                  <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary/40 transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{resource.title}</h3>
                        <Badge variant="outline" className="mt-1 mb-2">{resource.category}</Badge>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 h-fit">
                        {resource.relevanceScore}% Relevant
                      </Badge>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button asChild size="sm">
                        <Link to={resource.url} className="flex items-center">
                          View Resource
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-right mt-2">
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <Link to="/resources" className="flex items-center">
                      See all resources
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No resource recommendations yet</h3>
                <p className="text-gray-600 text-sm mb-4">Complete your profile to get relevant resources</p>
                <Button asChild size="sm">
                  <Link to="/profile">Update Profile</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="forum" className="space-y-4">
            {isLoading ? (
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
            ) : data?.forumTopics && data.forumTopics.length > 0 ? (
              <>
                {data.forumTopics.map((topic) => (
                  <div key={topic.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary/40 transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{topic.title}</h3>
                        <div className="flex items-center mt-1 space-x-3">
                          <Badge variant="outline">{topic.category}</Badge>
                          <span className="text-sm text-gray-500">{topic.replies} replies</span>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 h-fit">
                        {topic.relevanceScore}% Relevant
                      </Badge>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button asChild size="sm">
                        <Link to={`/resources/forums/${topic.id}`}>
                          Join Discussion
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-right mt-2">
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <Link to="/resources/forums" className="flex items-center">
                      See all topics
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No forum recommendations yet</h3>
                <p className="text-gray-600 text-sm mb-4">Join the community to get relevant forum topics</p>
                <Button asChild size="sm">
                  <Link to="/resources/forums">Browse Forums</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                      <div className="flex justify-end">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.events && data.events.length > 0 ? (
              <>
                {data.events.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary/40 transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(event.date).toLocaleDateString(undefined, { 
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                          {' · '}
                          {new Date(event.date).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="mt-1">
                          <Badge variant={event.virtual ? "outline" : "secondary"}>
                            {event.virtual ? "Virtual" : event.location}
                          </Badge>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 h-fit">
                        {event.relevanceScore}% Relevant
                      </Badge>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button asChild size="sm">
                        <Link to={`/events/${event.id}`}>
                          View Event
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-right mt-2">
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <Link to="/events" className="flex items-center">
                      See all events
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No event recommendations yet</h3>
                <p className="text-gray-600 text-sm mb-4">Complete your profile to get relevant events</p>
                <Button asChild size="sm">
                  <Link to="/profile">Update Profile</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
