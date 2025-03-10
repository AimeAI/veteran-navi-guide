
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            {t('Home')}
          </Button>
          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={() => {
              navigate('/job-search');
              onOpenChange(false);
            }}
          >
            {t('Find Jobs')}
          </Button>
          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={() => {
              navigate('/resources');
              onOpenChange(false);
            }}
          >
            {t('Resources')}
          </Button>
          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={() => {
              navigate('/dashboard');
              onOpenChange(false);
            }}
          >
            {t('Dashboard')}
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
