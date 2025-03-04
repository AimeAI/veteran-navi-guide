
import React, { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { JobProvider } from "./JobContext";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <UserProvider>
      <JobProvider>
        {children}
      </JobProvider>
    </UserProvider>
  );
};
