
import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import NavDropdown from '@/components/navigation/NavDropdown';
import MobileMenu from '@/components/navigation/MobileMenu';
import MessageNotificationBadge from '@/components/messaging/MessageNotificationBadge';
import LanguageSelector from '@/components/language/LanguageSelector';

const Navbar = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-nav border-b py-4 sticky top-0 z-50 backdrop-blur-sm">
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
                
                <NavDropdown />
              </div>
            </>
          ) : (
            <div className="hidden md:flex space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth?tab=login">{t('common.login')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth?tab=signup">{t('common.signup')}</Link>
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
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        open={mobileMenuOpen} 
        onOpenChange={setMobileMenuOpen} 
      />
    </nav>
  );
};

export default Navbar;
