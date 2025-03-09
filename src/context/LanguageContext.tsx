
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  saveLanguagePreference: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  changeLanguage: () => {},
  saveLanguagePreference: () => {}
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    // Get the stored language preference from localStorage on initial load
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      changeLanguage(storedLanguage);
    }
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const saveLanguagePreference = async (lang: string) => {
    // This function would be used to save the language preference to Supabase
    // when the Supabase integration is set up
    changeLanguage(lang);
    
    // For now, we'll just save to localStorage
    localStorage.setItem('language', lang);
    
    // Add Supabase integration code here when available
    // Example: await supabase.from('user_preferences').upsert({ user_id: currentUser.id, language: lang })
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, saveLanguagePreference }}>
      {children}
    </LanguageContext.Provider>
  );
};
