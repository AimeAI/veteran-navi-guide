
import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { MessageProvider } from "./context/MessageContext";
import { LanguageProvider } from "./context/LanguageContext";
import { LazyLoadingPlaceholder } from "./utils/codeSplitting";
import "./App.css";
import "./i18n";

// Lazy load components to reduce initial bundle size
const AppLayout = React.lazy(() => import("./components/layout/AppLayout"));
const AppRoutes = React.lazy(() => import("./routes/AppRoutes"));

function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <MessageProvider>
          <Router>
            <Suspense fallback={<LazyLoadingPlaceholder />}>
              <AppLayout>
                <Suspense fallback={<LazyLoadingPlaceholder />}>
                  <AppRoutes />
                </Suspense>
              </AppLayout>
            </Suspense>
          </Router>
        </MessageProvider>
      </LanguageProvider>
    </AppProvider>
  );
}

export default App;
