
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/UserContext';

const NavLinks = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <div className="hidden md:flex space-x-6">
      <NavLink
        to="/job-search"
        className={({ isActive }) =>
          `text-sm font-medium ${
            isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
          }`
        }
      >
        {t('navigation.jobSearch')}
      </NavLink>
      
      <NavLink
        to="/vetted-jobs"
        className={({ isActive }) =>
          `text-sm font-medium ${
            isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
          }`
        }
      >
        {t('navigation.vettedJobs')}
      </NavLink>
      
      <NavLink
        to="/mentorship"
        className={({ isActive }) =>
          `text-sm font-medium ${
            isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
          }`
        }
      >
        {t('navigation.mentorship')}
      </NavLink>
      
      <NavLink
        to="/resources"
        className={({ isActive }) =>
          `text-sm font-medium ${
            isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
          }`
        }
      >
        {t('navigation.resources')}
      </NavLink>
      
      {user?.role === 'employer' && (
        <NavLink
          to="/post-job"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
            }`
          }
        >
          {t('navigation.postJob')}
        </NavLink>
      )}
      
      {user?.role === 'veteran' && (
        <NavLink
          to="/learning"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
            }`
          }
        >
          {t('navigation.learning')}
        </NavLink>
      )}
    </div>
  );
};

export default NavLinks;
