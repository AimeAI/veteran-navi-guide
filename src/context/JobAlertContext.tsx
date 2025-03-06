
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the JobAlert type
export interface JobAlert {
  id: string;
  title: string;
  criteria: {
    keywords: string[];
    locations: string[];
    jobType: string;
  };
  frequency: "daily" | "weekly" | "monthly";
  createdAt: string;
  lastSent: string | null;
  matchCount: number;
}

// Define the context type
interface JobAlertContextType {
  jobAlerts: JobAlert[];
  addJobAlert: (alert: JobAlert) => void;
  removeJobAlert: (alertId: string) => void;
  updateJobAlert: (alertId: string, updatedAlert: Partial<JobAlert>) => void;
}

// Create the context with default values
const JobAlertContext = createContext<JobAlertContextType>({
  jobAlerts: [],
  addJobAlert: () => {},
  removeJobAlert: () => {},
  updateJobAlert: () => {},
});

// Create a provider component
export const JobAlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);

  // Add a new job alert
  const addJobAlert = (alert: JobAlert) => {
    setJobAlerts((prev) => [...prev, alert]);
  };

  // Remove a job alert
  const removeJobAlert = (alertId: string) => {
    setJobAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  // Update a job alert
  const updateJobAlert = (alertId: string, updatedAlert: Partial<JobAlert>) => {
    setJobAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, ...updatedAlert } : alert
      )
    );
  };

  return (
    <JobAlertContext.Provider
      value={{ jobAlerts, addJobAlert, removeJobAlert, updateJobAlert }}
    >
      {children}
    </JobAlertContext.Provider>
  );
};

// Create a custom hook for using this context
export const useJobAlerts = () => {
  const context = useContext(JobAlertContext);
  if (context === undefined) {
    throw new Error("useJobAlerts must be used within a JobAlertProvider");
  }
  return context;
};
