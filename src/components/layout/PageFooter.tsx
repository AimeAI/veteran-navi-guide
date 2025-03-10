
import React from 'react';
import { useTranslation } from 'react-i18next';

const PageFooter: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500 text-sm">
          <p>© {currentYear} VeteranJobBoard. {t("All rights reserved.")}</p>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
