
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px]">
        <nav className="flex flex-col gap-4 mt-8">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              navigate('/');
              onOpenChange(false);
            }}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              navigate('/job-search');
              onOpenChange(false);
            }}
          >
            Find Jobs
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              navigate('/resources');
              onOpenChange(false);
            }}
          >
            Resources
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              navigate('/dashboard');
              onOpenChange(false);
            }}
          >
            Dashboard
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
