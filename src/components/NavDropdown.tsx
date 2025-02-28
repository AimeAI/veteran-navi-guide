
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

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={cn(
          "nav-link group",
          isOpen ? "text-primary" : "text-nav-foreground hover:text-primary"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          <ChevronDown
            className={cn(
              "ml-1 h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )}
          />
        </span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-10 mt-1 w-56 origin-top-right rounded-md bg-nav-dropdown shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in backdrop-blur-sm"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="dropdown-item"
                role="menuitem"
                onClick={() => setIsOpen(false)}
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
