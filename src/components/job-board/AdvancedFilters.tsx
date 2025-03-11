
import React from 'react';
import { cn } from '@/lib/utils';

interface AdvancedFiltersProps {
  isOpen: boolean;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 animate-fade-in">
      <p className="text-sm text-gray-500">Advanced filters coming soon</p>
    </div>
  );
};

export default AdvancedFilters;
