
import React from 'react';
import { Briefcase, User, BookOpen, Building } from 'lucide-react';
import NavDropdown from './NavDropdown';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';

// Navigation data
const navSections = [
  {
    title: 'Job Search',
    icon: <Briefcase className="h-4 w-4" />,
    items: [
      { label: 'Search Jobs', href: '/jobs/search' },
      { label: 'Saved Jobs', href: '/jobs/saved' },
      { label: 'Recommended Jobs', href: '/jobs/recommended' },
      { label: 'Job Alerts', href: '/jobs/alerts' },
    ],
  },
  {
    title: 'Profile',
    icon: <User className="h-4 w-4" />,
    items: [
      { label: 'My Profile', href: '/profile' },
      { label: 'Resume/CV', href: '/profile/resume' },
      { label: 'Application History', href: '/profile/applications' },
      { label: 'Settings', href: '/profile/settings' },
    ],
  },
  {
    title: 'Resources',
    icon: <BookOpen className="h-4 w-4" />,
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
    icon: <Building className="h-4 w-4" />,
    items: [
      { label: 'Post a Job', href: '/employers/post-job' },
      { label: 'Manage Applications', href: '/employers/applications' },
      { label: 'Search Veteran Profiles', href: '/employers/search-veterans' },
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
              <a href="/" className="flex items-center">
                <span className="text-xl font-semibold tracking-tight">VeteranJobBoard</span>
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-6">
              {navSections.map((section) => (
                <NavDropdown
                  key={section.title}
                  label={section.title}
                  items={section.items}
                  icon={section.icon}
                />
              ))}
            </nav>

            {/* Mobile Menu */}
            <MobileMenu sections={navSections} />

            {/* Login/Register buttons for desktop */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium rounded-md hover:bg-nav-hover transition-colors duration-200"
              >
                Log in
              </a>
              <a
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors duration-200"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
