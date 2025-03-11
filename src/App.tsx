
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { MessageProvider } from "./context/MessageContext";
import { LanguageProvider } from "./context/LanguageContext";
import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import "./i18n";

function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <MessageProvider>
          <Router>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </Router>
        </MessageProvider>
      </LanguageProvider>
    </AppProvider>
  );
}

export default App;
