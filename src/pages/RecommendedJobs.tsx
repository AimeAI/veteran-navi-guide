
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import JobListing from '@/components/JobListing';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import JobRecommendationsLoading from '@/components/JobRecommendationsLoading';
import { mockJobs } from '@/data/mockJobs';
import { currentUserProfile, getJobRecommendations, RecommendationResult } from '@/utils/recommendationAlgorithm';

const RecommendedJobs = () => {
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a small delay
    const timer = setTimeout(() => {
      const recommendations = getJobRecommendations(currentUserProfile, mockJobs);
      setRecommendedJobs(recommendations);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Recommended Jobs</h1>
          <p className="text-gray-600">
            Personalized job recommendations based on your military background, skills, and preferences.
          </p>
        </div>

        {/* User profile summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Your Profile</CardTitle>
            <CardDescription>The recommendation algorithm uses this information to find the best matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentUserProfile.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="bg-blue-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Military Background</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Branch:</span> {currentUserProfile.militaryBranch}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Rank:</span> {currentUserProfile.rank}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">MOS Code:</span>{" "}
                  {currentUserProfile.mosId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Security Clearance:</span>{" "}
                  {currentUserProfile.securityClearance || "None"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading state */}
        {isLoading ? (
          <JobRecommendationsLoading />
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Found {recommendedJobs.length} job{recommendedJobs.length !== 1 && 's'} that match your profile
            </p>
            
            {recommendedJobs.map(({ job, matchScore, matchDetails }) => (
              <div key={job.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Match Score</h3>
                    <span className="text-sm font-medium">{Math.round(matchScore)}%</span>
                  </div>
                  <Progress value={matchScore} className="h-2 mt-2" />
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1.5 ${matchDetails.skillMatches.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>{matchDetails.skillMatches.length} skill matches</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1.5 ${matchDetails.mosCodeMatches.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>{matchDetails.mosCodeMatches.length} MOS matches</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1.5 ${matchDetails.locationMatch ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Location match</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1.5 ${matchDetails.clearanceMatch ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Clearance match</span>
                    </div>
                  </div>
                </div>
                
                <JobListing
                  jobId={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  description={job.description}
                  date={job.date || new Date().toISOString()} // Add fallback date if not present
                  matchScore={matchScore}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedJobs;
