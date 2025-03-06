
import React, { ReactNode } from "react";
import { JobProvider } from "./JobContext";
import { UserProvider } from "./UserContext";
import { JobAlertProvider } from "./JobAlertContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <JobProvider>
          <JobAlertProvider>
            {children}
          </JobAlertProvider>
        </JobProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};
