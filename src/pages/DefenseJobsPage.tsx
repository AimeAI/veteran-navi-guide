/**
 * Canadian Defense Contractors Directory
 * Direct links to company career pages - NO fake job listings
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  MapPin,
  ExternalLink,
  Shield,
  Star,
  Search,
  Users,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { veteranEmployers, type EmployerSector } from '@/data/veteranEmployers';

// Reference to all employers
const defenseContractors = veteranEmployers;

export default function DefenseJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState<EmployerSector | 'all'>('all');

  // Filter companies
  const filteredCompanies = useMemo(() => {
    let companies = [...defenseContractors];

    // Filter by sector
    if (sectorFilter !== 'all') {
      companies = companies.filter(c => c.sector === sectorFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      companies = companies.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term)
      );
    }

    // Filter by location
    if (locationFilter) {
      const loc = locationFilter.toLowerCase();
      companies = companies.filter(c =>
        c.locations.some(l => l.toLowerCase().includes(loc))
      );
    }

    return companies;
  }, [searchTerm, locationFilter, sectorFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Beta Access Banner */}
      <Alert className="mb-6 border-green-500 bg-green-50">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900 font-semibold">BETA ACCESS</AlertTitle>
        <AlertDescription className="text-green-800">
          The Canadian Veteran Employment Directory is live. Indexing {defenseContractors.length}+ Defense & GovTech employers.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Canadian Veteran Employment Directory</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Direct links to {defenseContractors.length} employers across all sectors hiring Canadian veterans
        </p>
        <Badge variant="secondary" className="gap-1">
          <Building2 className="h-4 w-4" />
          {defenseContractors.length} Employers Indexed
        </Badge>
      </div>

      {/* Sector Selector */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Filter by Sector:</label>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={sectorFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectorFilter('all')}
          >
            All Sectors
          </Button>
          <Button
            variant={sectorFilter === 'defense' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectorFilter('defense')}
          >
            Defense
          </Button>
          <Button
            variant={sectorFilter === 'public-safety' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectorFilter('public-safety')}
          >
            Public Safety
          </Button>
          <Button
            variant={sectorFilter === 'logistics-transportation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectorFilter('logistics-transportation')}
          >
            Logistics & Transportation
          </Button>
          <Button
            variant={sectorFilter === 'construction-trades' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectorFilter('construction-trades')}
          >
            Construction & Trades
          </Button>
          <Button
            variant={sectorFilter === 'government' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectorFilter('government')}
          >
            Government
          </Button>
          <Button
            variant={sectorFilter === 'tech-cybersecurity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectorFilter('tech-cybersecurity')}
          >
            Tech & Cybersecurity
          </Button>
          <Button
            variant={sectorFilter === 'utilities-energy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectorFilter('utilities-energy')}
          >
            Utilities & Energy
          </Button>
          <Button
            variant={sectorFilter === 'manufacturing' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectorFilter('manufacturing')}
          >
            Manufacturing
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by city..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredCompanies.length} of {defenseContractors.length} employers
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{company.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {company.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </CardDescription>
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {company.veteranOwned && (
                    <Badge variant="default" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Veteran-Owned
                    </Badge>
                  )}
                  {company.veteranFriendly && !company.veteranOwned && (
                    <Badge variant="secondary" className="text-xs">
                      Veteran-Friendly
                    </Badge>
                  )}
                  {company.securityClearanceJobs && (
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Clearance
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {company.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {company.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                {company.locations.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{company.locations.join(', ')}</span>
                  </div>
                )}
                {company.employees && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{company.employees} employees</span>
                  </div>
                )}
                {company.clearanceLevel && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">
                      Clearance: {company.clearanceLevel === 'top-secret' ? 'Top Secret' :
                                  company.clearanceLevel === 'secret' ? 'Secret' :
                                  company.clearanceLevel === 'reliability' ? 'Reliability' :
                                  'Various Levels'}
                    </span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{company.phone}</span>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${company.email}`} className="text-muted-foreground hover:text-primary">
                      {company.email}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href={company.careersUrl} target="_blank" rel="noopener noreferrer">
                    View Jobs
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search filters
            </p>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
