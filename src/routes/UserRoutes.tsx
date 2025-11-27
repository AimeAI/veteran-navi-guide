
import React from "react";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy-loaded components
const UnderConstruction = lazy(() => import("../pages/UnderConstruction"));

export const UserRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        {/* All user routes under construction */}
        <Route path="/*" element={<UnderConstruction />} />
      </Routes>
    </Suspense>
  );
};
