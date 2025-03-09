
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, BookOpen, Building, ChevronDown, Shield } from 'lucide-react';
import MobileMenu from '../navigation/MobileMenu';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../language/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from '@/context/UserContext';
import NavDropdown from '../navigation/NavDropdown';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  
  // Navigation data
  const navSections = [
    {
      title: t('navigation.jobSearch'),
      icon: <Briefcase className="h-4 w-4" aria-hidden="true" />,
      items: [
        { label: t('navigation.jobSearch'), href: '/job-search' },
        { label: t('navigation.savedJobs'), href: '/saved' },
        { label: t('navigation.recommendedJobs'), href: '/recommended' },
        { label: t('navigation.jobAlerts'), href: '/job-alerts' },
        { label: t('navigation.jobFairs'), href: '/events' },
        { label: t('navigation.vettedJobs'), href: '/vetted-jobs', icon: <Shield className="h-3 w-3 ml-1 text-primary" /> },
      ],
    },
    {
      title: t('navigation.profile'),
      icon: <User className="h-4 w-4" aria-hidden="true" />,
      items: [
        { label: t('navigation.profile'), href: '/profile' },
        { label: t('navigation.resume'), href: '/profile/resume' },
        { label: t('navigation.applicationHistory'), href: '/history' },
        { label: t('navigation.settings'), href: '/profile/settings' },
      ],
    },
    {
      title: t('navigation.resources'),
      icon: <BookOpen className="h-4 w-4" aria-hidden="true" />,
      items: [
        { label: t('navigation.careerCounseling'), href: '/resources/career-counseling' },
        { label: t('navigation.resumeAssistance'), href: '/resources/resume-assistance' },
        { label: t('navigation.interviewPrep'), href: '/resources/interview-prep' },
        { label: t('navigation.militaryTransition'), href: '/resources/military-transition' },
        { label: t('navigation.communityForums'), href: '/resources/forums' },
      ],
    },
    {
      title: t('navigation.employers'),
      icon: <Building className="h-4 w-4" aria-hidden="true" />,
      items: [
        { label: t('navigation.postJob'), href: '/employer/post-job' },
        { label: t('navigation.manageApplications'), href: '/employer/manage-applications' },
        { label: t('navigation.searchVeterans'), href: '/employer/search-veterans' },
      ],
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur supports-backdrop-blur:bg-nav/80">
      <div className="border-b border-nav-border bg-nav/85 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center" aria-label="VeteranJobBoard Home">
                <span className="text-lg sm:text-xl font-semibold tracking-tight truncate">VeteranJobBoard</span>
              </Link>
            </div>
            
            <nav aria-label="Main Navigation" className="hidden lg:flex lg:items-center lg:space-x-4 xl:space-x-6">
              {navSections.map((section) => (
                <div key={section.title} className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-nav-hover transition-colors duration-200">
                      {section.icon}
                      <span className="ml-2">{section.title}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {section.items.map((item) => (
                        <DropdownMenuItem key={item.label} asChild>
                          <Link to={item.href} className="flex items-center">
                            {item.label}
                            {item.icon && item.icon}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              <LanguageSelector />
            </nav>

            <MobileMenu sections={navSections} />

            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              {user ? (
                <NavDropdown />
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-nav-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    aria-label="Log in to your account"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/auth?tab=signup"
                    className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    aria-label="Create a new account"
                  >
                    {t('common.signup')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
