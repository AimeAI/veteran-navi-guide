
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/UserContext';

export interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[250px] bg-white z-50">
        <nav className="flex flex-col gap-4 mt-8">
          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={() => {
              navigate('/');
              onOpenChange(false);
            }}
          >
            {t('navigation.home', 'Home')}
          </Button>
          
          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={() => {
              navigate('/job-search');
              onOpenChange(false);
            }}
          >
            {t('navigation.jobSearch', 'Job Search')}
          </Button>
          
          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={() => {
              navigate('/vetted-jobs');
              onOpenChange(false);
            }}
          >
            {t('navigation.vettedJobs', 'Vetted Jobs')}
          </Button>
          
          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={() => {
              navigate('/find-mentors');
              onOpenChange(false);
            }}
          >
            {t('navigation.mentorship', 'Mentorship')}
          </Button>
          
          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={() => {
              navigate('/resources/career-counseling');
              onOpenChange(false);
            }}
          >
            {t('navigation.resources', 'Resources')}
          </Button>
          
          {user?.role === 'employer' && (
            <Button
              variant="ghost"
              className="justify-start cursor-pointer"
              onClick={() => {
                navigate('/post-job');
                onOpenChange(false);
              }}
            >
              {t('navigation.postJob', 'Post Job')}
            </Button>
          )}
          
          {user?.role === 'veteran' && (
            <Button
              variant="ghost"
              className="justify-start cursor-pointer"
              onClick={() => {
                navigate('/learning');
                onOpenChange(false);
              }}
            >
              {t('navigation.learning', 'Learning')}
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
