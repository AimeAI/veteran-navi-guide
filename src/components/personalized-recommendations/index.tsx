import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Briefcase, BookOpen, MessageSquare, Calendar } from 'lucide-react';
import TabLoader from './TabLoader';
import JobsTab from './JobsTab';
import ResourcesTab from './ResourcesTab';
import ForumTab from './ForumTab';
import EventsTab from './EventsTab';
import { mapSupabaseJobToJobModel } from '@/utils/jobMapping';

/**
 * A card component that displays personalized recommendations for jobs, resources,
 * forum topics, and events based on the user's profile and interests.
 */
const PersonalizedRecommendations = () => {
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ['personalizedRecommendations', user?.email],
    queryFn: async () => {
      console.log('Fetching personalized recommendations for:', user?.email);
      
      try {
        // Fetch jobs from Supabase
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
          throw new Error(jobsError.message);
        }
        
        const jobs = jobsData.map((job) => {
          const mappedJob = mapSupabaseJobToJobModel(job);
          // Add match score (this would typically be calculated based on user skills)
          return {
            id: mappedJob.id,
            title: mappedJob.title,
            company: mappedJob.company,
            matchScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100 for demo
            location: mappedJob.location,
            remote: mappedJob.remote
          };
        });
        
        // Note: These other data sections would typically be fetched from Supabase tables too
        // For this implementation, we'll keep the mock data for resources, forum and events
        
        return {
          jobs,
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
      } catch (error) {
        console.error("Error fetching personalized recommendations:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          <Star className="h-5 w-5 mr-2 text-primary" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TabLoader error={error as Error | null} isLoading={isLoading} children={
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
              <JobsTab isLoading={isLoading} jobs={data?.jobs} />
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-4">
              <ResourcesTab isLoading={isLoading} resources={data?.resources} />
            </TabsContent>
            
            <TabsContent value="forum" className="space-y-4">
              <ForumTab isLoading={isLoading} forumTopics={data?.forumTopics} />
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              <EventsTab isLoading={isLoading} events={data?.events} />
            </TabsContent>
          </Tabs>
        } />
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
