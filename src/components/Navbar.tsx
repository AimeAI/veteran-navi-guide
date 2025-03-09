
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/UserContext';
import NavDropdown from './NavDropdown';
import { cn } from "@/lib/utils";
import { Book, Briefcase, Home, Search, Building, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
      <div className="container px-4 sm:px-6 md:px-8 py-2 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4 flex items-center font-semibold">
              <img src="/logo.svg" alt="Veteran Career Compass" className="h-8 w-8 mr-2" />
              <span className="text-xl">Veteran Career Compass</span>
            </Link>
          </div>
        
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/" 
              className={({isActive}) => cn(
                "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
              )}
            >
              <Home className="h-4 w-4 mr-2" />
              {t('common:home')}
            </NavLink>
            
            <NavLink 
              to="/job-search" 
              className={({isActive}) => cn(
                "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
              )}
            >
              <Search className="h-4 w-4 mr-2" />
              {t('navigation:jobSearch')}
            </NavLink>
            
            <NavLink 
              to="/resources/career-counseling" 
              className={({isActive}) => cn(
                "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
              )}
            >
              <Book className="h-4 w-4 mr-2" />
              {t('navigation:resources')}
            </NavLink>
            
            {user?.role === 'employer' && (
              <>
                <NavLink 
                  to="/employer-profile" 
                  className={({isActive}) => cn(
                    "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                    isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  )}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Company Profile
                </NavLink>
                
                <NavLink 
                  to="/post-job" 
                  className={({isActive}) => cn(
                    "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                    isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  )}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Post a Job
                </NavLink>
              </>
            )}
            
            <NavLink 
              to="/employers" 
              className={({isActive}) => cn(
                "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
              )}
            >
              <Building className="h-4 w-4 mr-2" />
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
          
          {/* Mobile menu button */}
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
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pt-2 pb-3 border-t">
            <NavLink 
              to="/" 
              className={({isActive}) => cn(
                "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-2" />
              {t('common:home')}
            </NavLink>
            
            <NavLink 
              to="/job-search" 
              className={({isActive}) => cn(
                "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="h-4 w-4 mr-2" />
              {t('navigation:jobSearch')}
            </NavLink>
            
            <NavLink 
              to="/resources/career-counseling" 
              className={({isActive}) => cn(
                "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Book className="h-4 w-4 mr-2" />
              {t('navigation:resources')}
            </NavLink>
            
            {user?.role === 'employer' && (
              <>
                <NavLink 
                  to="/employer-profile" 
                  className={({isActive}) => cn(
                    "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                    isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Company Profile
                </NavLink>
                
                <NavLink 
                  to="/post-job" 
                  className={({isActive}) => cn(
                    "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                    isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Post a Job
                </NavLink>
              </>
            )}
            
            <NavLink 
              to="/employers" 
              className={({isActive}) => cn(
                "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
                isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building className="h-4 w-4 mr-2" />
              Employers
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
