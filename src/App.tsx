
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { MessageProvider } from '@/context/MessageContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AppProvider } from '@/context/AppContext';
import { AppRoutes } from '@/routes';

function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <MessageProvider>
          <Router>
            <AppRoutes />
          </Router>
        </MessageProvider>
      </LanguageProvider>
    </AppProvider>
  );
}

export default App;
