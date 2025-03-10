
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { Briefcase, User, Bell, Menu, MessageSquare } from 'lucide-react';
import NavDropdown from '@/components/navigation/NavDropdown';
import MobileMenu from './navigation/MobileMenu';
import MessageNotificationBadge from './messaging/MessageNotificationBadge';
import LanguageSelector from './language/LanguageSelector';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white border-b py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl text-primary mr-10">
            VeteranJobBoard
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/job-search"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {t('Find Jobs')}
            </NavLink>
            
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {t('Resources')}
            </NavLink>
            
            <NavLink
              to="/mentorship"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {t('Mentorship')}
            </NavLink>
            
            {user && user.role === 'employer' && (
              <NavLink
                to="/post-job"
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {t('Post a Job')}
              </NavLink>
            )}
            
            {user && user.role === 'veteran' && (
              <NavLink
                to="/dashboard/lms-integration"
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {t('Learning')}
              </NavLink>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <LanguageSelector />
          
          {user ? (
            <>
              <div className="hidden md:flex space-x-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/messages">
                    <MessageNotificationBadge />
                  </Link>
                </Button>
                
                <Button variant="ghost" size="sm" asChild>
                  <Link to={user.role === 'employer' ? '/employer-dashboard' : '/dashboard'}>
                    {user.role === 'employer' ? <Briefcase className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </Link>
                </Button>
              </div>
              
              <NavDropdown />
            </>
          ) : (
            <div className="hidden md:flex space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">{t('Log in')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">{t('Sign up')}</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        onOpenChange={setMobileMenuOpen} 
        open={mobileMenuOpen} 
      />
    </nav>
  );
};

export default Navbar;
