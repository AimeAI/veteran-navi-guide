
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from '../locales/en/translation.json';
import frTranslation from '../locales/fr/translation.json';

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
        common: { home: 'Home', login: 'Login', signup: 'Sign Up' },
        navigation: { jobSearch: 'Job Search', resources: 'Resources' }
      },
      fr: {
        translation: frTranslation,
        common: { home: 'Accueil', login: 'Connexion', signup: 'Inscription' },
        navigation: { jobSearch: 'Recherche d\'emploi', resources: 'Ressources' }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: false
  });

export default i18n;
