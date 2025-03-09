
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface LanguageOption {
  code: string;
  name: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' }
];

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { language, saveLanguagePreference } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-nav-hover transition-colors duration-200">
        <Globe className="h-4 w-4 mr-2" />
        <span>{t('common.language')}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={cn(
              "flex items-center cursor-pointer",
              language === lang.code ? "bg-accent" : ""
            )}
            onClick={() => saveLanguagePreference(lang.code)}
          >
            <div className="w-4 h-4 flex items-center justify-center mr-2">
              {language === lang.code && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
            {t(`common.${lang.code === 'en' ? 'english' : 'french'}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
