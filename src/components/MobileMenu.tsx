
import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileMenuSection {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
}

interface MobileMenuProps {
  sections: MobileMenuSection[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        className="flex items-center p-2 text-nav-foreground hover:text-primary"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div 
            className={cn(
              "fixed inset-y-0 left-0 w-full max-w-sm bg-nav-dropdown shadow-xl animate-slide-in",
              "p-6 overflow-y-auto"
            )}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button
                onClick={toggleMenu}
                className="p-2 text-nav-foreground hover:text-primary"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="space-y-6">
              {sections.map((section) => (
                <div key={section.title} className="border-b border-nav-border pb-4">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between w-full py-2 text-left text-base font-medium"
                  >
                    <span>{section.title}</span>
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform", 
                        expandedSection === section.title ? "rotate-90" : ""
                      )} 
                    />
                  </button>
                  
                  {expandedSection === section.title && (
                    <div className="mt-2 pl-4 space-y-2 animate-fade-in">
                      {section.items.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.href}
                          className="block py-2 text-sm text-nav-muted hover:text-primary transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
