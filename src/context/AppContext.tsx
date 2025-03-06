
import React, { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { JobProvider } from "./JobContext";
import { JobAlertProvider } from "./JobAlertContext";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <UserProvider>
      <JobProvider>
        <JobAlertProvider>
          {children}
        </JobAlertProvider>
      </JobProvider>
    </UserProvider>
  );
};
