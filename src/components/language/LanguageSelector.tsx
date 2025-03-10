
import React from 'react';
import { Check, GlobeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLanguageChange = (langCode: string) => {
    if (language !== langCode) {
      changeLanguage(langCode);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-2 lg:gap-1 cursor-pointer"
        >
          <GlobeIcon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden md:inline-flex ml-2">{language === 'en' ? 'EN' : 'FR'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="cursor-pointer"
          >
            <span>{lang.name}</span>
            {language === lang.code && (
              <Check className="ml-2 h-4 w-4" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
