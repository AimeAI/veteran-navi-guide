
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tag, X } from 'lucide-react';

interface MilitarySkillsFilterProps {
  selectedSkills: string[];
  onSelectSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
}

// List of common military skills
const militarySkills = [
  { id: 'leadership', name: 'Leadership' },
  { id: 'logistics', name: 'Logistics & Supply Chain' },
  { id: 'security', name: 'Security Operations' },
  { id: 'communications', name: 'Communications' },
  { id: 'intelligence', name: 'Intelligence Analysis' },
  { id: 'medical', name: 'Medical & First Aid' },
  { id: 'engineering', name: 'Combat Engineering' },
  { id: 'aviation', name: 'Aviation Operations' },
  { id: 'technology', name: 'Information Technology' },
  { id: 'mechanical', name: 'Mechanical Maintenance' },
  { id: 'administrative', name: 'Administrative Management' },
  { id: 'weapons', name: 'Weapons Systems' },
];

const MilitarySkillsFilter: React.FC<MilitarySkillsFilterProps> = ({
  selectedSkills,
  onSelectSkill,
  onRemoveSkill,
}) => {
  return (
    <div className="space-y-3">
      <Label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
        <Tag className="h-4 w-4 mr-2 text-primary" />
        Military Skills
      </Label>
      
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSkills.map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {militarySkills.find(s => s.id === skill)?.name || skill}
              <button
                onClick={() => onRemoveSkill(skill)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                aria-label={`Remove ${skill} skill`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
          {militarySkills.map((skill) => (
            <div key={skill.id} className="flex items-start">
              <button
                onClick={() => onSelectSkill(skill.id)}
                disabled={selectedSkills.includes(skill.id)}
                className={`text-sm text-left px-2 py-1 rounded-md w-full ${
                  selectedSkills.includes(skill.id)
                    ? 'bg-primary/10 text-primary cursor-not-allowed'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {skill.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilitarySkillsFilter;
