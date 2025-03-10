
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useJobSearchState } from '@/hooks/useJobSearchState';
import { useTranslation } from 'react-i18next';
import JobSearchHeader from '@/components/job-search/JobSearchHeader';
import SearchTabs from '@/components/job-search/SearchTabs';
import { useUser } from '@/context/UserContext'; 
import { getUserSkills } from '@/utils/skillMatching';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, BookOpen, Check, UserCheck, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ProfileCompletionProgress from '@/components/ProfileCompletionProgress';
import SkillBadge from '@/components/SkillBadge';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/context/JobContext';
import { ClearanceLevel, MilitaryBranch, EducationLevel, SalaryRange } from '@/types/badges';
import { toast } from 'sonner';

const JobSearch: React.FC = () => {
  const { t } = useTranslation();
  const { user, supabaseUser } = useUser();
  const { savedFilters, saveFilter } = useJobs();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  
  const {
    jobs,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalJobs,
    setPage,
    refreshJobs
  } = useJobSearch({
    keywords: '',
    location: '',
    radius: 50,
    jobType: '',
    industry: '',
    experienceLevel: '',
    educationLevel: '',
    remote: false,
    country: 'canada',
    page: 1,
  });
  
  const {
    filters,
    activeTab,
    isRefreshing,
    setActiveTab,
    handleFilterChange,
    handleKeywordSearch,
    handleLocationSearch,
    handleRemoteToggle,
    handleCountryChange,
    handleMilitarySkillsChange,
    handleSkillsChange,
    handleClearFilters,
    handleClearCacheAndRefresh,
    handleClearanceLevelChange,
    handleMilitaryBranchChange,
    handleEducationLevelChange,
    handleSalaryRangeChange,
    handleYearsOfServiceChange,
  } = useJobSearchState(refreshJobs);
  
  const handleSaveFilter = (name: string) => {
    saveFilter(name, filters);
    toast.success(t('Search filter saved successfully!'));
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (user && supabaseUser) {
      const requiredFields = ['name', 'email', 'location', 'militaryBranch', 'rank', 'yearsOfService', 'bio'];
      const filledFields = requiredFields.filter(field => Boolean((user as any)[field]));
      const completionPercentage = (filledFields.length / requiredFields.length) * 100;
      
      setShowOnboarding(completionPercentage < 70);
    }
  }, [user, supabaseUser]);
  
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (supabaseUser?.id) {
        try {
          const skills = await getUserSkills(supabaseUser.id);
          setUserSkills(skills);
          if (skills.length > 0) {
            handleSkillsChange(skills);
          }
        } catch (error) {
          console.error("Error fetching user skills:", error);
        }
      }
    };
    
    fetchUserSkills();
  }, [supabaseUser, handleSkillsChange]);
  
  useEffect(() => {
    refreshJobs();
  }, [
    filters.keywords,
    filters.location,
    filters.remote,
    filters.radius,
    filters.industry,
    filters.experienceLevel,
    filters.educationLevel,
    filters.jobType,
    filters.country,
    filters.skills,
    filters.clearanceLevel,
    filters.militaryBranch,
    filters.salaryRange,
    filters.yearsOfService,
  ]);
  
  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingDismissed', 'true');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('Job Search - Veteran Career Compass')}</title>
        <meta name="description" content="Search for veteran-friendly jobs that match your military skills and experience" />
      </Helmet>
      
      {/* Skip to content link for keyboard users */}
      <a href="#job-results" className="skip-link">
        {t('accessibility.skipToContent')}
      </a>
      
      {showOnboarding && supabaseUser && (
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-blue-800">
                <UserPlus className="h-5 w-5 mr-2" aria-hidden="true" />
                {t('Welcome to Job Search')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-blue-200 bg-white">
                  <AlertCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  <AlertTitle>{t('Complete your profile to get better job matches')}</AlertTitle>
                  <AlertDescription>
                    {t('Your profile information helps us match you with relevant jobs based on your military experience and skills.')}
                  </AlertDescription>
                </Alert>
                
                <div className="bg-white p-4 rounded-md">
                  <ProfileCompletionProgress className="mb-4" />
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">{t('Your Current Skills')}:</h3>
                    <div className="flex flex-wrap gap-2">
                      {userSkills && userSkills.length > 0 ? (
                        userSkills.map((skill, index) => (
                          <SkillBadge 
                            key={index} 
                            skill={skill} 
                            type={index % 3 === 0 ? 'military' : (index % 2 === 0 ? 'technical' : 'soft')}
                            level={index % 4 === 0 ? 'expert' : (index % 3 === 0 ? 'advanced' : (index % 2 === 0 ? 'intermediate' : 'beginner'))}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">{t('No skills added yet. Update your profile to add skills.')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4 bg-white rounded-b-lg">
              <Button 
                variant="outline" 
                onClick={dismissOnboarding}
                aria-label={t('Dismiss onboarding and continue to job search')}
              >
                <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('I\'ll do this later')}
              </Button>
              <Button asChild>
                <Link to="/profile" aria-label={t('Go to profile to complete your information')}>
                  <UserCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t('Complete Profile')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      <JobSearchHeader 
        onRefresh={handleClearCacheAndRefresh}
        isRefreshing={isRefreshing}
        isLoading={isLoading}
      />
      
      <div id="job-results" tabIndex={-1}>
        <SearchTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filters={filters}
          onKeywordChange={handleKeywordSearch}
          onLocationChange={handleLocationSearch}
          onRemoteToggle={handleRemoteToggle}
          onCountryChange={handleCountryChange}
          onClearFilters={handleClearFilters}
          onFilterChange={handleFilterChange}
          onMilitarySkillsChange={handleMilitarySkillsChange}
          onSkillsChange={handleSkillsChange}
          onClearanceLevelChange={handleClearanceLevelChange}
          onMilitaryBranchChange={handleMilitaryBranchChange}
          onEducationLevelChange={handleEducationLevelChange}
          onSalaryRangeChange={handleSalaryRangeChange}
          onYearsOfServiceChange={handleYearsOfServiceChange}
          onSaveFilter={handleSaveFilter}
          jobs={jobs}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalJobs={totalJobs}
          onPageChange={handlePageChange}
          savedFilters={savedFilters}
        />
      </div>
      
      {userSkills.length > 0 && !showOnboarding && (
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex flex-wrap items-center mb-2 sm:mb-0">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2" aria-hidden="true" />
            <span className="text-sm font-medium">{t('Job matches are based on your skills')}:</span>
            <div className="flex flex-wrap gap-1.5 ml-2 max-w-md overflow-hidden mt-1 sm:mt-0">
              {userSkills.slice(0, 3).map((skill, index) => (
                <SkillBadge 
                  key={index} 
                  skill={skill} 
                  type="military"
                  level="intermediate"
                  className="text-xs"
                />
              ))}
              {userSkills.length > 3 && (
                <Badge variant="outline" className="bg-gray-100 text-gray-700 text-xs">
                  +{userSkills.length - 3} {t('more')}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link to="/profile" aria-label={t('Go to profile page to update your skills')}>
              {t('Update skills')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobSearch;
