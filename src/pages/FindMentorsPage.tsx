
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRound, Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useMentorship } from '@/hooks/useMentorship';
import { useUser } from '@/context/UserContext';
import MentorCard from '@/components/mentorship/MentorCard';
import { MentorshipProfile } from '@/services/mentorshipService';

const FindMentorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { 
    isLoading, 
    userProfile, 
    availableMentors, 
    connections,
    loadMentors, 
    requestMentorConnection 
  } = useMentorship();

  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [filteredMentors, setFilteredMentors] = useState<MentorshipProfile[]>([]);

  useEffect(() => {
    loadMentors();
  }, [loadMentors]);

  useEffect(() => {
    let results = [...availableMentors];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      results = results.filter(mentor => 
        mentor.full_name?.toLowerCase().includes(lowerSearchTerm) ||
        mentor.mentor_bio?.toLowerCase().includes(lowerSearchTerm) ||
        mentor.mentoring_topics?.some(topic => topic.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    if (industryFilter) {
      results = results.filter(mentor => mentor.industry === industryFilter);
    }
    
    setFilteredMentors(results);
  }, [searchTerm, industryFilter, availableMentors]);

  const isMentorRequested = (mentorId: string) => {
    return connections.some(
      connection => connection.mentor_id === mentorId && ['pending', 'active'].includes(connection.status)
    );
  };

  // Extract unique industries for the filter
  const industries = Array.from(new Set(availableMentors.map(mentor => mentor.industry).filter(Boolean))) as string[];

  if (!user) {
    return (
      <div className="container py-10">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Find Mentors</CardTitle>
            <CardDescription>
              You need to be logged in to access the mentorship program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Find Mentors</h1>
            <p className="text-gray-500 mt-1">Connect with experienced veterans to help with your career transition</p>
          </div>
          <Button
            onClick={() => navigate('/mentorship')}
            variant="outline"
            className="whitespace-nowrap"
          >
            <UserRound className="mr-2 h-4 w-4" />
            My Mentorships
          </Button>
        </div>

        {!userProfile ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-center text-gray-500 mb-4">
                You need to create a mentorship profile before connecting with mentors
              </p>
              <Button onClick={() => navigate('/mentorship')}>
                Create Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, bio, or skills..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex-shrink-0 w-full md:w-48">
                    <Select value={industryFilter} onValueChange={setIndustryFilter}>
                      <SelectTrigger>
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Industry" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Industries</SelectItem>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                      </div>
                      <Skeleton className="h-9 w-full mt-4" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredMentors.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-500 text-lg mb-2">No mentors found</p>
                  <p className="text-gray-400">Try adjusting your filters or search term</p>
                </div>
              ) : (
                filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    onRequestMentorship={requestMentorConnection}
                    isRequested={isMentorRequested(mentor.id)}
                    disabled={userProfile.is_mentor && mentor.user_id === user.email}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FindMentorsPage;
