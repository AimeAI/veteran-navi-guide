
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { useUser } from '@/context/UserContext';

interface MobileMenuSection {
  title: string;
  icon?: React.ReactNode;
  items: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

interface MobileMenuProps {
  sections: MobileMenuSection[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ sections }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      toggleMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto'; // Reset body overflow when unmounting
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        className="flex items-center p-2 text-nav-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          aria-hidden="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) toggleMenu();
          }}
        >
          <div 
            id="mobile-menu"
            ref={menuRef}
            className={cn(
              "fixed inset-y-0 left-0 w-full sm:max-w-sm bg-nav-dropdown shadow-xl animate-slide-in",
              "p-4 sm:p-6 overflow-y-auto"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold" id="mobile-menu-title">Menu</h2>
              <button
                onClick={toggleMenu}
                className="p-2 text-nav-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-md"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <nav className="space-y-4" aria-labelledby="mobile-menu-title">
              {sections.map((section) => (
                <div key={section.title} className="border-b border-nav-border pb-4">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between w-full py-2 text-left text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-md"
                    aria-expanded={expandedSection === section.title}
                    aria-controls={`section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="flex items-center">
                      {section.icon && <span className="mr-2">{section.icon}</span>}
                      {section.title}
                    </span>
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform", 
                        expandedSection === section.title ? "rotate-90" : ""
                      )} 
                      aria-hidden="true"
                    />
                  </button>
                  
                  {expandedSection === section.title && (
                    <div 
                      id={`section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="mt-2 pl-4 space-y-2 animate-fade-in"
                    >
                      {section.items.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.href}
                          className="flex items-center py-2 text-sm text-nav-muted hover:text-primary transition-colors focus:outline-none focus:text-primary focus:underline"
                          onClick={toggleMenu}
                        >
                          {item.label}
                          {item.icon && <span className="ml-1">{item.icon}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add language selector to mobile menu */}
              <div className="py-2">
                <LanguageSelector />
              </div>
            </nav>

            {/* Mobile login/signup buttons */}
            <div className="mt-8 pt-4 border-t border-nav-border">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/profile"
                    className="w-full py-2.5 px-4 text-center text-sm font-medium rounded-md hover:bg-nav-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 border border-gray-200"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="w-full py-2.5 px-4 text-center text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/auth"
                    className="w-full py-2.5 px-4 text-center text-sm font-medium rounded-md hover:bg-nav-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 border border-gray-200"
                    onClick={toggleMenu}
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/auth?tab=signup"
                    className="w-full py-2.5 px-4 text-center text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    onClick={toggleMenu}
                  >
                    {t('common.signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
