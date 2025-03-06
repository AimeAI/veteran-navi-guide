
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, BookOpen, Building, ChevronDown } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';
import NavDropdown from './NavDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Navigation data
const navSections = [
  {
    title: 'Job Search',
    icon: <Briefcase className="h-4 w-4" aria-hidden="true" />,
    items: [
      { label: 'Search Jobs', href: '/job-search' },
      { label: 'Saved Jobs', href: '/saved' },
      { label: 'Recommended Jobs', href: '/recommended' },
      { label: 'Job Alerts', href: '/job-alerts' },
    ],
  },
  {
    title: 'Profile',
    icon: <User className="h-4 w-4" aria-hidden="true" />,
    items: [
      { label: 'My Profile', href: '/profile' },
      { label: 'Resume/CV', href: '/profile/resume' },
      { label: 'Application History', href: '/history' },
      { label: 'Settings', href: '/profile/settings' },
    ],
  },
  {
    title: 'Resources',
    icon: <BookOpen className="h-4 w-4" aria-hidden="true" />,
    items: [
      { label: 'Career Counseling', href: '/resources/career-counseling' },
      { label: 'Resume Writing Assistance', href: '/resources/resume-assistance' },
      { label: 'Interview Preparation', href: '/resources/interview-prep' },
      { label: 'Military Transition Resources', href: '/resources/military-transition' },
      { label: 'Community Forums', href: '/resources/forums' },
    ],
  },
  {
    title: 'Employers',
    icon: <Building className="h-4 w-4" aria-hidden="true" />,
    items: [
      { label: 'Post a Job', href: '/employer/post-job' },
      { label: 'Manage Applications', href: '/employer/manage-applications' },
      { label: 'Search Veteran Profiles', href: '/employer/search-veterans' },
    ],
  },
];

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-backdrop-blur:bg-nav/80">
      <div className="border-b border-nav-border bg-nav/85 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center" aria-label="VeteranJobBoard Home">
                <span className="text-lg sm:text-xl font-semibold tracking-tight truncate">VeteranJobBoard</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
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
                          <Link to={item.href}>{item.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </nav>

            {/* Mobile Menu */}
            <MobileMenu sections={navSections} />

            {/* Login/Register buttons for desktop */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <Link
                to="/auth"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-nav-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                aria-label="Log in to your account"
              >
                Log in
              </Link>
              <Link
                to="/auth?tab=signup"
                className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                aria-label="Create a new account"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
