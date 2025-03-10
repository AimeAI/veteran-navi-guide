
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/navigation/MobileMenu';
import LanguageSelector from '@/components/language/LanguageSelector';
import NavLinks from '@/components/navigation/NavLinks';
import AuthButtons from '@/components/navigation/AuthButtons';
import UserNavigation from '@/components/navigation/UserNavigation';

const Navbar = () => {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-nav border-b py-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl text-primary">
            VeteranJobBoard
          </Link>
          
          <NavLinks />
        </div>
        
        <div className="flex items-center space-x-3">
          <LanguageSelector />
          
          {user ? (
            <UserNavigation />
          ) : (
            <AuthButtons />
          )}
          
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
      
      <MobileMenu 
        open={mobileMenuOpen} 
        onOpenChange={setMobileMenuOpen} 
      />
    </nav>
  );
};

export default Navbar;
