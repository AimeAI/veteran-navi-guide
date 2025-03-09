
import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface NavLinkProps {
  to: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, children, onClick }) => {
  return (
    <RouterNavLink 
      to={to} 
      className={({isActive}) => cn(
        "flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-md",
        isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {children}
    </RouterNavLink>
  );
};

export default NavLink;
