/**
 * Job Fair Resources List
 * Displays real Canadian veteran job fair and career event resources
 */

import React from 'react';
import { ExternalLink, Building2, Globe, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { jobFairResources } from '@/data/events';

const JobFairEventsList: React.FC = () => {
  // Group resources by type
  const governmentResources = jobFairResources.filter(r => r.type === 'government');
  const organizationResources = jobFairResources.filter(r => r.type === 'organization');
  const jobBoardResources = jobFairResources.filter(r => r.type === 'job-board');
  const eventPlatformResources = jobFairResources.filter(r => r.type === 'event-platform');

  const renderResourceSection = (title: string, resources: typeof jobFairResources, icon: React.ReactNode) => {
    if (resources.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{resource.name}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button asChild className="w-full">
                  <a href={resource.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Job Fair & Career Event Resources</h2>
        <p className="text-lg text-muted-foreground">
          Official organizations and platforms that host job fairs and career events for Canadian Veterans
        </p>
      </div>

      {/* Important Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Globe className="h-5 w-5" />
            Finding Current Job Fairs
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p className="mb-2">
            Job fairs and career events are scheduled throughout the year by various organizations.
            Visit the websites below to find current and upcoming events in your area.
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Check official government career transition services first</li>
            <li>Sign up for email alerts on job board platforms</li>
            <li>Connect with veteran organizations for local networking events</li>
            <li>Follow LinkedIn groups for virtual career fair announcements</li>
          </ul>
        </CardContent>
      </Card>

      {/* Government Resources */}
      {renderResourceSection(
        'Official Government Services',
        governmentResources,
        <Building2 className="h-5 w-5 text-blue-600" />
      )}

      {/* Veteran Organizations */}
      {renderResourceSection(
        'Veteran Support Organizations',
        organizationResources,
        <Globe className="h-5 w-5 text-green-600" />
      )}

      {/* Job Boards */}
      {renderResourceSection(
        'Job Board Platforms',
        jobBoardResources,
        <Tag className="h-5 w-5 text-purple-600" />
      )}

      {/* Event Platforms */}
      {renderResourceSection(
        'Event & Networking Platforms',
        eventPlatformResources,
        <ExternalLink className="h-5 w-5 text-orange-600" />
      )}

      {/* Additional Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tips for Job Fair Success</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>• Prepare your "elevator pitch" highlighting your military experience and transferable skills</p>
          <p>• Bring multiple copies of your resume tailored to civilian positions</p>
          <p>• Research participating employers beforehand</p>
          <p>• Dress professionally and arrive early for in-person events</p>
          <p>• Follow up with contacts within 24-48 hours after the event</p>
          <p>• For virtual events, test your technology and ensure a professional background</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobFairEventsList;
