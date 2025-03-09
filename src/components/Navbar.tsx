
import React, { useState } from 'react';
import Logo from './navigation/Logo';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
      <div className="container px-4 sm:px-6 md:px-8 py-2 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Desktop Navigation */}
          <DesktopNav />
          
          {/* Mobile Navigation */}
          <MobileNav 
            mobileMenuOpen={mobileMenuOpen} 
            toggleMobileMenu={toggleMobileMenu} 
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
