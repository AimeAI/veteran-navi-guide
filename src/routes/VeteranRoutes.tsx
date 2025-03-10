
import React from 'react';
import { Route } from 'react-router-dom';
import { veteranRoutes } from './veteranRoutes';

export const VeteranRoutes = () => {
  return (
    <Route path="dashboard">
      {veteranRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}
    </Route>
  );
};
