
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobContext, Job } from '@/context/JobContext';
import { useUser } from '@/context/UserContext';
import { 
  ClipboardList, 
  Briefcase, 
  BookmarkCheck, 
  Bookmark,
  CheckCircle2,
  Clock,
  Calendar,
  Ban
} from 'lucide-react';
import StatsCardGroup from './StatsCardGroup';
import StatsCard from './StatsCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const VeteranDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { savedJobs, appliedJobs } = useJobContext();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  
  useEffect(() => {
    // Fetch recent job listings
    const fetchRecentJobs = async () => {
      try {
        const response = await fetch('/api/jobs/recent');
        const data = await response.json();
        setRecentJobs(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recent jobs:', error);
        // Use mock data if fetch fails
        setRecentJobs([
          {
            id: '1',
            title: 'Software Engineer',
            company: 'TechCorp',
            location: 'Toronto, ON',
            description: 'Develop and maintain software applications using modern technologies',
            jobType: 'fulltime',
            date: new Date().toISOString(),
            category: 'technology',
            salaryRange: 'range4',
            remote: false,
            clearanceLevel: 'none',
            mosCode: '',
            requiredSkills: ['JavaScript', 'React', 'Node.js'],
            preferredSkills: ['TypeScript', 'AWS'],
            industry: 'technology',
            experienceLevel: 'mid',
            educationLevel: 'bachelors',
          },
          {
            id: '2',
            title: 'Logistics Coordinator',
            company: 'Supply Chain Inc',
            location: 'Vancouver, BC',
            description: 'Coordinate logistics operations and maintain efficiency',
            jobType: 'fulltime',
            date: new Date().toISOString(),
            category: 'logistics',
            salaryRange: 'range3',
            remote: false,
            clearanceLevel: 'confidential',
            mosCode: 'LOG01',
            requiredSkills: ['Logistics Management', 'Supply Chain', 'Inventory Control'],
            preferredSkills: ['SAP', 'Six Sigma'],
            industry: 'logistics',
            experienceLevel: 'mid',
            educationLevel: 'bachelors',
          },
          {
            id: '3',
            title: 'Security Analyst',
            company: 'DefenseTech',
            location: 'Ottawa, ON',
            description: 'Analyze security requirements and provide recommendations',
            jobType: 'fulltime',
            date: new Date().toISOString(),
            category: 'security',
            salaryRange: 'range4',
            remote: true,
            clearanceLevel: 'secret',
            mosCode: 'SEC02',
            requiredSkills: ['Risk Assessment', 'Security Analysis', 'Documentation'],
            preferredSkills: ['CISSP', 'Security+'],
            industry: 'defense',
            experienceLevel: 'senior',
            educationLevel: 'masters',
          }
        ]);
      }
    };
    
    fetchRecentJobs();
  }, []);
  
  // Get the job application status counts
  const statuses = {
    saved: savedJobs.length,
    applied: appliedJobs.length,
    interviews: 2, // Mock data - would come from a real API
    offers: 1, // Mock data - would come from a real API
  };
  
  // Get upcoming events/interviews
  const upcomingEvents = [
    {
      id: 'event1',
      title: 'Interview with TechCorp',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'interview'
    },
    {
      id: 'event2',
      title: 'Virtual Job Fair - Technology Sector',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'jobfair'
    },
    {
      id: 'event3',
      title: 'Follow-up with DefenseTech',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'followup'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'jobfair':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'followup':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Stats for StatsCardGroup component
  const dashboardStats = {
    saved: statuses.saved,
    applied: statuses.applied,
    interviews: statuses.interviews,
    offers: statuses.offers
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('Welcome back')}, {user?.name || 'Veteran'}</h1>
          <p className="text-gray-500">{t('Here\'s an overview of your job search progress')}</p>
        </div>
        <Button asChild>
          <Link to="/jobs/search">{t('Find New Jobs')}</Link>
        </Button>
      </div>
      
      <StatsCardGroup stats={dashboardStats}>
        <StatsCard 
          title={t('Saved Jobs')} 
          value={statuses.saved.toString()} 
          icon={Bookmark}
          description={t('Jobs you\'ve bookmarked')}
        />
        <StatsCard 
          title={t('Applications')} 
          value={statuses.applied.toString()} 
          icon={ClipboardList}
          description={t('Jobs you\'ve applied to')}
        />
        <StatsCard 
          title={t('Interviews')} 
          value={statuses.interviews.toString()} 
          icon={BookmarkCheck}
          description={t('Scheduled interviews')}
        />
        <StatsCard 
          title={t('Offers')} 
          value={statuses.offers.toString()} 
          icon={CheckCircle2}
          description={t('Job offers received')}
        />
      </StatsCardGroup>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>{t('Recent Job Opportunities')}</CardTitle>
            <CardDescription>
              {t('Jobs that match your profile and preferences')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">
                      <Link to={`/jobs/${job.id}`} className="hover:text-primary">
                        {job.title}
                      </Link>
                    </h3>
                    <Badge variant={job.remote ? "outline" : "secondary"}>
                      {job.remote ? t('Remote') : t('On-site')}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{job.company} • {job.location}</div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.requiredSkills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Ban className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium">{t('No jobs found')}</h3>
                <p className="mt-1 text-gray-500">
                  {t('Search for jobs to see recommendations here')}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/jobs/search">{t('View All Job Listings')}</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('Upcoming Events')}</CardTitle>
            <CardDescription>
              {t('Your scheduled interviews and job fairs')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Clock className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">
                    {t('No upcoming events')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/events">{t('View Calendar')}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t('Complete Your Profile')}</CardTitle>
          <CardDescription>
            {t('Improve your job match rate by completing your profile')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-1">{t('Military Service')}</h3>
                <p className="text-sm text-gray-500 mb-2">{t('Complete your service history')}</p>
                <Badge variant="outline" className="bg-green-50">Completed</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-1">{t('Skills Profile')}</h3>
                <p className="text-sm text-gray-500 mb-2">{t('Add your skills and expertise')}</p>
                <Badge variant="outline" className="bg-amber-50">In Progress</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-1">{t('Resume Upload')}</h3>
                <p className="text-sm text-gray-500 mb-2">{t('Upload your resume or CV')}</p>
                <Badge variant="outline" className="bg-amber-50">In Progress</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-1">{t('Job Preferences')}</h3>
                <p className="text-sm text-gray-500 mb-2">{t('Set your job search preferences')}</p>
                <Badge variant="outline" className="bg-red-50">Not Started</Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/profile">{t('Complete Profile')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VeteranDashboard;
