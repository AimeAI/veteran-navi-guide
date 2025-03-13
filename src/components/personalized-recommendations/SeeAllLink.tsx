
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SeeAllLinkProps {
  url: string;
  text: string;
}

const SeeAllLink: React.FC<SeeAllLinkProps> = ({ url, text }) => {
  return (
    <div className="text-right mt-2">
      <Button asChild variant="ghost" size="sm" className="text-primary">
        <Link to={url} className="flex items-center">
          {text}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default SeeAllLink;
