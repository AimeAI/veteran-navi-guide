
import React, { ReactNode } from "react";
import { JobAlertProvider } from "./JobAlertContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client for React Query
const queryClient = new QueryClient();

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <JobAlertProvider>
        {children}
      </JobAlertProvider>
    </QueryClientProvider>
  );
};
