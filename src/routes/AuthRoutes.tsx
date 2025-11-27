
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded components
const UnderConstruction = lazy(() => import("../pages/UnderConstruction"));

export const AuthRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        {/* All auth routes under construction */}
        <Route path="/*" element={<UnderConstruction />} />
      </Routes>
    </Suspense>
  );
};
