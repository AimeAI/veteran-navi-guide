
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, BookOpen, Building, ChevronDown, Shield, Map } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from '@/context/UserContext';
import NavDropdown from './NavDropdown';
import MessageNavItem from './messaging/MessageNavItem';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  
  // Navigation data - ONLY working features shown
  const navSections = [
    {
      title: 'Jobs',
      icon: <Briefcase className="h-4 w-4" aria-hidden="true" />,
      items: [
        { label: 'Defense Employers', href: '/defense-jobs' },
        { label: 'Job Search', href: '/job-search' },
        { label: 'Job Fairs & Events', href: '/events' },
      ],
    },
    {
      title: t('navigation.resources'),
      icon: <BookOpen className="h-4 w-4" aria-hidden="true" />,
      items: [
        { label: 'Military Job Translator', href: '/military-translator' },
        { label: t('navigation.careerCounseling'), href: '/resources/career-counseling' },
        { label: t('navigation.resumeAssistance'), href: '/resources/resume-assistance' },
        { label: t('navigation.interviewPrep'), href: '/resources/interview-prep' },
        { label: t('navigation.militaryTransition'), href: '/resources/military-transition' },
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

            {/* Auth buttons removed - feature not yet implemented */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
