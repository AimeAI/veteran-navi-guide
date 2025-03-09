
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/UserContext';
import NavLink from './NavLink';
import NavDropdown from './NavDropdown';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Search, Book, Building, Briefcase } from 'lucide-react';

interface MobileNavProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ mobileMenuOpen, toggleMobileMenu }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  
  return (
    <div className="md:hidden flex items-center">
      <Button variant="ghost" size="sm" className="mr-2" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      
      {user ? (
        <NavDropdown />
      ) : (
        <div className="flex items-center space-x-2">
          <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary px-3 py-2 rounded-md">
            {t('common:login')}
          </Link>
          <Link to="/signup" className="inline-flex items-center justify-center text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 shadow-sm">
            {t('common:signup')}
          </Link>
        </div>
      )}
      
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 pt-2 pb-3 border-t bg-white shadow-md z-20">
          <div className="container px-4 sm:px-6 md:px-8 max-w-screen-2xl mx-auto">
            <NavLink to="/" icon={Home} onClick={() => toggleMobileMenu()}>
              {t('common:home')}
            </NavLink>
            
            <NavLink to="/job-search" icon={Search} onClick={() => toggleMobileMenu()}>
              {t('navigation:jobSearch')}
            </NavLink>
            
            <NavLink to="/resources/career-counseling" icon={Book} onClick={() => toggleMobileMenu()}>
              {t('navigation:resources')}
            </NavLink>
            
            {user?.role === 'employer' && (
              <>
                <NavLink to="/employer-profile" icon={Building} onClick={() => toggleMobileMenu()}>
                  Company Profile
                </NavLink>
                
                <NavLink to="/post-job" icon={Briefcase} onClick={() => toggleMobileMenu()}>
                  Post a Job
                </NavLink>
              </>
            )}
            
            <NavLink to="/employers" icon={Building} onClick={() => toggleMobileMenu()}>
              Employers
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
