
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
            <NavigationMenuTrigger className="text-sm font-medium text-nav-foreground hover:text-primary bg-transparent">
              {t('navigation.jobSearch', 'Job Search')}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white border shadow-md rounded-md min-w-[200px] z-50">
              <ul className="grid gap-3 p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/job-search"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.jobSearch', 'Job Search')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/vetted-jobs"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.vettedJobs', 'Vetted Jobs')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/saved-jobs"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.savedJobs', 'Saved Jobs')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium text-nav-foreground hover:text-primary bg-transparent">
              {t('navigation.mentorship', 'Mentorship')}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white border shadow-md rounded-md min-w-[200px] z-50">
              <ul className="grid gap-3 p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/find-mentors"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.findMentors', 'Find Mentors')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/mentorship-dashboard"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
            <NavigationMenuContent className="bg-white border shadow-md rounded-md min-w-[200px] z-50">
              <ul className="grid gap-3 p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/resources/career-counseling"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.careerCounseling', 'Career Counseling')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/resources/resume-assistance"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {t('navigation.resumeAssistance', 'Resume Writing Assistance')}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to="/resources/military-transition"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
              <NavigationMenuTrigger className="text-sm font-medium text-nav-foreground hover:text-primary bg-transparent">
                {t('navigation.employers', 'Employer')}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white border shadow-md rounded-md min-w-[200px] z-50">
                <ul className="grid gap-3 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink 
                        to="/post-job"
                        className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        {t('navigation.postJob', 'Post a Job')}
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink 
                        to="/employer-dashboard"
                        className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        {t('navigation.employers', 'Employer Dashboard')}
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavLinks;
