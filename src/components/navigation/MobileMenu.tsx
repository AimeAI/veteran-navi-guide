
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import LanguageSelector from '../language/LanguageSelector';
import { useUser } from '@/context/UserContext';

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

interface MobileMenuProps {
  sections: NavSection[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ sections }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85vw] sm:max-w-sm">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-left">VeteranJobBoard</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col space-y-4 mt-4">
            <Accordion type="single" collapsible className="w-full">
              {sections.map((section, index) => (
                <AccordionItem value={section.title} key={index}>
                  <AccordionTrigger className="flex items-center py-2">
                    <div className="flex items-center">
                      {section.icon}
                      <span className="ml-2">{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pl-6">
                      {section.items.map((item, itemIndex) => (
                        <Link 
                          key={itemIndex}
                          to={item.href}
                          className="py-2 text-sm hover:text-primary transition-colors flex items-center"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                          {item.icon && item.icon}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-2 mb-4">
              <LanguageSelector />
            </div>
            
            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="space-y-3">
                  <div className="font-medium">{user.name || 'User'}</div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      {t('navigation.profile')}
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/history" onClick={() => setOpen(false)}>
                      {t('navigation.applicationHistory')}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button asChild className="w-full" variant="default">
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      {t('common.login')}
                    </Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/auth?tab=signup" onClick={() => setOpen(false)}>
                      {t('common.signup')}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
