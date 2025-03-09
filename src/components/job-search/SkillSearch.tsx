
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SkillSearchProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

const SkillSearch: React.FC<SkillSearchProps> = ({ 
  selectedSkills, 
  onSkillsChange 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available skills from database or use a predefined list
  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        // Try to get skills from Supabase
        const { data, error } = await supabase
          .from('skills')
          .select('skill_name')
          .order('skill_name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setAvailableSkills(data.map(skill => skill.skill_name));
        } else {
          // Fallback to predefined list if no skills in database
          setAvailableSkills([
            'JavaScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'Go', 'TypeScript',
            'SQL', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django',
            'Spring Boot', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps',
            'Machine Learning', 'Artificial Intelligence', 'Data Science',
            'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication',
            'Problem Solving', 'Critical Thinking', 'Teamwork', 'Time Management',
            'Customer Service', 'Sales', 'Marketing', 'Accounting', 'Finance',
            'Human Resources', 'Operations', 'Supply Chain', 'Logistics'
          ]);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        // Fallback to common skills
        setAvailableSkills([
          'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Node.js',
          'Project Management', 'Leadership', 'Communication'
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSkills();
  }, []);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = availableSkills
      .filter(skill => 
        skill.toLowerCase().includes(query) && 
        !selectedSkills.includes(skill)
      )
      .slice(0, 5); // Limit to 5 suggestions
    
    setSuggestions(filtered);
  }, [searchQuery, availableSkills, selectedSkills]);

  const handleAddSkill = (skill: string) => {
    if (skill.trim() === '' || selectedSkills.includes(skill)) {
      return;
    }
    
    const updatedSkills = [...selectedSkills, skill];
    onSkillsChange(updatedSkills);
    setSearchQuery('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    onSkillsChange(updatedSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleAddSkill(suggestions[0]);
      } else {
        handleAddSkill(searchQuery);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for skills (e.g. Java, Project Management)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={() => handleAddSkill(searchQuery)}
            disabled={searchQuery.trim() === '' || isLoading}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1 max-h-60 overflow-auto">
            {suggestions.map((skill, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
            {skill}
            <X
              className="ml-1 h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveSkill(skill)}
            />
          </Badge>
        ))}
        
        {selectedSkills.length === 0 && (
          <div className="text-sm text-gray-500 italic">
            No skills selected. Add skills to find matching jobs.
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillSearch;
