
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const AuthButtons = () => {
  const { t } = useTranslation();
  
  return (
    <div className="hidden md:flex space-x-3">
      <Button variant="outline" size="sm" asChild>
        <Link to="/auth?tab=login">{t('common.login')}</Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/auth?tab=signup">{t('common.signup')}</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
