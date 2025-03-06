
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the job alert interface
export interface JobAlert {
  id: string;
  title: string;
  criteria: {
    keywords: string[];
    locations: string[];
    jobType: string;
  };
  frequency: string;
  createdAt: string;
  lastSent: string | null;
  matchCount: number;
}

// Define the context interface
interface JobAlertContextType {
  jobAlerts: JobAlert[];
  addJobAlert: (alert: JobAlert) => void;
  updateJobAlert: (id: string, alert: Partial<JobAlert>) => void;
  removeJobAlert: (id: string) => void;
}

// Create the context with default values
const JobAlertContext = createContext<JobAlertContextType>({
  jobAlerts: [],
  addJobAlert: () => {},
  updateJobAlert: () => {},
  removeJobAlert: () => {},
});

// Create a provider component
export const JobAlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);

  // Add a new job alert
  const addJobAlert = (alert: JobAlert) => {
    setJobAlerts((prevAlerts) => [...prevAlerts, alert]);
  };

  // Update an existing job alert
  const updateJobAlert = (id: string, updatedAlert: Partial<JobAlert>) => {
    setJobAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, ...updatedAlert } : alert
      )
    );
  };

  // Remove a job alert
  const removeJobAlert = (id: string) => {
    setJobAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <JobAlertContext.Provider
      value={{ jobAlerts, addJobAlert, updateJobAlert, removeJobAlert }}
    >
      {children}
    </JobAlertContext.Provider>
  );
};

// Custom hook for using the job alert context
export const useJobAlerts = () => useContext(JobAlertContext);
