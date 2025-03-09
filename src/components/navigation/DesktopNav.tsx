
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/UserContext';
import NavLink from './NavLink';
import NavDropdown from './NavDropdown';
import { Home, Search, Book, Briefcase, Building } from 'lucide-react';

const DesktopNav: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  
  return (
    <div className="hidden md:flex items-center space-x-1">
      <NavLink to="/" icon={Home}>
        {t('common:home')}
      </NavLink>
      
      <NavLink to="/job-search" icon={Search}>
        {t('navigation:jobSearch')}
      </NavLink>
      
      <NavLink to="/resources/career-counseling" icon={Book}>
        {t('navigation:resources')}
      </NavLink>
      
      {user?.role === 'employer' && (
        <>
          <NavLink to="/employer-profile" icon={Building}>
            Company Profile
          </NavLink>
          
          <NavLink to="/post-job" icon={Briefcase}>
            Post a Job
          </NavLink>
        </>
      )}
      
      <NavLink to="/employers" icon={Building}>
        Employers
      </NavLink>
      
      {user ? (
        <NavDropdown />
      ) : (
        <>
          <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary px-3 py-2 rounded-md">
            {t('common:login')}
          </Link>
          <Link to="/signup" className="inline-flex items-center justify-center text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 shadow-sm">
            {t('common:signup')}
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopNav;
