
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import MobileMenu from './MobileMenu';
import NavDropdown from './NavDropdown';
import { Button } from './ui/button';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                VeteranJobBoard
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/jobs/search"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700",
                  "border-b-2 border-transparent hover:border-gray-300"
                )}
              >
                Find Jobs
              </Link>
              <Link 
                to="/jobs/saved"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700",
                  "border-b-2 border-transparent hover:border-gray-300"
                )}
              >
                Saved Jobs
              </Link>
              <Link 
                to="/applications"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700",
                  "border-b-2 border-transparent hover:border-gray-300"
                )}
              >
                Applications
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/jobs/post">
              <Button variant="secondary">Post a Job</Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
          </div>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
