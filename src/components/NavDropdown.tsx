
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
  icon?: React.ReactNode;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, items, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownId = `dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={cn(
          "nav-link group w-full md:w-auto text-left",
          isOpen ? "text-primary" : "text-nav-foreground hover:text-primary"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={dropdownId}
      >
        <span className="flex items-center">
          {icon && <span className="mr-2" aria-hidden="true">{icon}</span>}
          {label}
          <ChevronDown
            className={cn(
              "ml-1 h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )}
            aria-hidden="true"
          />
        </span>
      </button>
      
      {isOpen && (
        <div 
          id={dropdownId}
          className="absolute z-10 mt-1 w-full min-w-[200px] max-w-[300px] origin-top-right rounded-md bg-nav-dropdown shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in backdrop-blur-sm"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="dropdown-item focus:outline-none focus:bg-gray-100 focus:text-primary"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                tabIndex={0}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
