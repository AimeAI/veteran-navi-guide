import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ExternalLink,
  Building2,
  Shield,
  RefreshCw
} from 'lucide-react';
import { type EmployerSector } from '@/data/veteranEmployers';
import { searchJobs } from '@/services/UnifiedJobService';
import { Job } from '@/types/job';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Helper function to format date
const formatPostedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export default function ActiveJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [clearanceFilter, setClearanceFilter] = useState<'all' | 'clearance-required'>('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [sources, setSources] = useState({ jobBank: 0, directory: 0 });

  // Fetch employers on mount
  useEffect(() => {
    const fetchEmployers = async () => {
      setLoading(true);
      try {
        const result = await searchJobs({
          keywords: searchTerm || undefined,
          location: locationFilter || undefined,
          industry: sectorFilter !== 'all' ? sectorFilter : undefined,
        });
        setJobs(result.jobs);
        setTotalJobs(result.totalJobs);
        setSources(result.sources);
      } catch (error) {
        console.error('Error fetching employers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []); // Only fetch on mount

  // Handle manual search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await searchJobs({
        keywords: searchTerm || undefined,
        location: locationFilter || undefined,
        industry: sectorFilter !== 'all' ? sectorFilter : undefined,
      });
      setJobs(result.jobs);
      setTotalJobs(result.totalJobs);
      setSources(result.sources);
    } catch (error) {
      console.error('Error fetching employers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    // Filter by clearance
    if (clearanceFilter === 'clearance-required') {
      filtered = filtered.filter(j =>
        j.clearanceLevel && j.clearanceLevel !== 'N/A'
      );
    }

    return filtered;
  }, [jobs, clearanceFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Employer Directory Search</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Search {filteredJobs.length}+ veteran-friendly employers with direct links to their career pages
        </p>
        <div className="flex gap-4 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <Building2 className="h-4 w-4" />
            {filteredJobs.length} Employers
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-4 w-4" />
            Defense & GovTech
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <div>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
              >
                <option value="all">All Sectors</option>
                <option value="defense">Defense</option>
                <option value="public-safety">Public Safety</option>
                <option value="logistics-transportation">Logistics & Transportation</option>
                <option value="construction-trades">Construction & Trades</option>
                <option value="government">Government</option>
                <option value="tech-cybersecurity">Tech & Cybersecurity</option>
                <option value="healthcare">Healthcare</option>
                <option value="utilities-energy">Utilities & Energy</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail-hospitality">Retail & Hospitality</option>
              </select>
            </div>
            <div>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={clearanceFilter}
                onChange={(e) => setClearanceFilter(e.target.value as 'all' | 'clearance-required')}
              >
                <option value="all">All Jobs</option>
                <option value="clearance-required">Clearance Required</option>
              </select>
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Jobs
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Searching jobs..." />
        </div>
      )}

      {/* Jobs List */}
      {!loading && (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {job.source && (
                      <Badge variant="secondary" className="text-xs">
                        {job.source}
                      </Badge>
                    )}
                    {job.clearanceLevel && job.clearanceLevel !== 'N/A' && (
                      <Badge variant="outline" className="gap-1">
                        <Shield className="h-3 w-3" />
                        {job.clearanceLevel}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {job.jobType}
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">{job.salaryRange}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Posted {formatPostedDate(job.date)}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {job.description}
                </p>

                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button className="w-full" asChild>
                  <a href={job.url || '#'} target="_blank" rel="noopener noreferrer">
                    {job.source === 'Direct Employer' ? 'View Career Page' : 'View Job'}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters or search terms
            </p>
            <Button onClick={handleSearch} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Search Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
