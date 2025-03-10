
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/UserContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const NavLinks = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <div className="hidden md:flex space-x-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavLink
              to="/job-search"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
                }`
              }
            >
              {t('navigation.jobSearch', 'Job Search')}
            </NavLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavLink
              to="/vetted-jobs"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
                }`
              }
            >
              {t('navigation.vettedJobs', 'Vetted Jobs')}
            </NavLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium text-nav-foreground hover:text-primary bg-transparent">
              {t('navigation.mentorship', 'Mentorship')}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white border shadow-md rounded-md z-50">
              <ul className="grid gap-3 p-4 w-[250px]">
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/find-mentors"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.findMentors', 'Find Mentors')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/mentorship-dashboard"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.mentorshipDashboard', 'Mentorship Dashboard')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium text-nav-foreground hover:text-primary bg-transparent">
              {t('navigation.resources', 'Resources')}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white border shadow-md rounded-md z-50">
              <ul className="grid gap-3 p-4 w-[250px]">
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/resources/career-counseling"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.careerCounseling', 'Career Counseling')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/resources/resume-assistance"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.resumeAssistance', 'Resume Assistance')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/resources/military-transition"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.militaryTransition', 'Military Transition')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {user?.role === 'employer' && (
            <NavigationMenuItem>
              <NavLink
                to="/post-job"
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
                  }`
                }
              >
                {t('navigation.postJob', 'Post Job')}
              </NavLink>
            </NavigationMenuItem>
          )}

          {user?.role === 'veteran' && (
            <NavigationMenuItem>
              <NavLink
                to="/learning"
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive ? 'text-primary' : 'text-nav-foreground hover:text-primary'
                  }`
                }
              >
                {t('navigation.learning', 'Learning')}
              </NavLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavLinks;
