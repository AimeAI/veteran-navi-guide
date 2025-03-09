
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18nConfig';

interface LanguageContextType {
  currentLanguage: string;
  language: string; // For backward compatibility
  changeLanguage: (lang: string) => void;
  saveLanguagePreference: (lang: string) => void; // For backward compatibility
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  language: 'en', // For backward compatibility
  changeLanguage: () => {},
  saveLanguagePreference: () => {}, // For backward compatibility
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(localStorage.getItem('i18nextLng') || 'en');
  const { t } = useTranslation();

  useEffect(() => {
    // Set the initial language
    if (i18n.changeLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    
    if (i18n.changeLanguage) {
      i18n.changeLanguage(lang);
    }
  };

  // For backward compatibility
  const saveLanguagePreference = (lang: string) => {
    changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      language: currentLanguage, // For backward compatibility
      changeLanguage, 
      saveLanguagePreference // For backward compatibility
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
