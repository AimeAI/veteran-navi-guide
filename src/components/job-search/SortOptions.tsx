
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

interface SortOptionsProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortBy, onSortChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sortBy" className="text-sm whitespace-nowrap">
        {t('Sort by')}:
      </Label>
      <Select 
        value={sortBy} 
        onValueChange={onSortChange}
      >
        <SelectTrigger id="sortBy" className="w-[180px] h-9">
          <SelectValue placeholder={t('Most Relevant')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevant">{t('Most Relevant')}</SelectItem>
          <SelectItem value="date">{t('Newest')}</SelectItem>
          <SelectItem value="salary-high">{t('Salary (High to Low)')}</SelectItem>
          <SelectItem value="salary-low">{t('Salary (Low to High)')}</SelectItem>
          <SelectItem value="skills">{t('Skills Match')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortOptions;
