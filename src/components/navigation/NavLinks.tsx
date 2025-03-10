
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
              {t('navigation.jobSearch')}
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
              {t('navigation.vettedJobs')}
            </NavLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium text-nav-foreground hover:text-primary">
              {t('navigation.mentorship')}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white z-50">
              <ul className="grid gap-3 p-6 w-[400px]">
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/find-mentors"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.findMentors')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/mentorship-dashboard"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.mentorshipDashboard')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium text-nav-foreground hover:text-primary">
              {t('navigation.resources')}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white z-50">
              <ul className="grid gap-3 p-6 w-[400px]">
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/resources/career-counseling"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.careerCounseling')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/resources/resume-assistance"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.resumeAssistance')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/resources/military-transition"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.militaryTransition')}
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
                {t('navigation.postJob')}
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
                {t('navigation.learning')}
              </NavLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavLinks;
