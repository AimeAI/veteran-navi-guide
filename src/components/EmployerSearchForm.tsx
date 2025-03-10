
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

// Add learning-related search filters to the employer search form
const EmployerSearchForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    militaryBranch: '',
    yearsOfExperience: '',
    skills: [] as string[],
    certifications: false,
    courses: false
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchQuery(value);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFilters(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    console.log('Filters:', filters);
    // Implement the search functionality
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Qualified Veterans</CardTitle>
        <CardDescription>
          Search for veterans with specific skills, experience, and qualifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="searchQuery">Search</Label>
            <div className="flex space-x-2">
              <Input
                id="searchQuery"
                name="searchQuery"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search by skills, keywords, or role..."
                className="flex-1"
              />
              <Button type="submit" className="whitespace-nowrap">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="City, state, or zip code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="militaryBranch">Military Branch</Label>
              <Select
                value={filters.militaryBranch}
                onValueChange={(value) => handleFilterChange('militaryBranch', value)}
              >
                <SelectTrigger id="militaryBranch">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="army">Army</SelectItem>
                  <SelectItem value="navy">Navy</SelectItem>
                  <SelectItem value="airForce">Air Force</SelectItem>
                  <SelectItem value="marines">Marines</SelectItem>
                  <SelectItem value="coastGuard">Coast Guard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Select
                value={filters.yearsOfExperience}
                onValueChange={(value) => handleFilterChange('yearsOfExperience', value)}
              >
                <SelectTrigger id="yearsOfExperience">
                  <SelectValue placeholder="Any experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="flex items-center w-fit pt-0"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showAdvancedFilters ? 'Hide advanced filters' : 'Show advanced filters'}
          </Button>

          {showAdvancedFilters && (
            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-medium">Learning & Development Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certifications"
                    checked={filters.certifications}
                    onCheckedChange={(checked) => handleCheckboxChange('certifications', !!checked)}
                  />
                  <Label htmlFor="certifications" className="cursor-pointer">
                    Has certifications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="courses"
                    checked={filters.courses}
                    onCheckedChange={(checked) => handleCheckboxChange('courses', !!checked)}
                  />
                  <Label htmlFor="courses" className="cursor-pointer">
                    Has completed courses
                  </Label>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployerSearchForm;
