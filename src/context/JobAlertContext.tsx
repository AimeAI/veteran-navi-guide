
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

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

interface JobAlertContextType {
  jobAlerts: JobAlert[];
  addJobAlert: (alert: JobAlert) => void;
  removeJobAlert: (id: string) => void;
}

const JobAlertContext = createContext<JobAlertContextType | undefined>(undefined);

export const JobAlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);

  const addJobAlert = (alert: JobAlert) => {
    setJobAlerts(prev => [...prev, alert]);
    toast.success("Job alert created successfully");
  };

  const removeJobAlert = (id: string) => {
    setJobAlerts(prev => prev.filter(alert => alert.id !== id));
    toast.success("Job alert removed");
  };

  return (
    <JobAlertContext.Provider value={{ jobAlerts, addJobAlert, removeJobAlert }}>
      {children}
    </JobAlertContext.Provider>
  );
};

export const useJobAlerts = () => {
  const context = useContext(JobAlertContext);
  if (context === undefined) {
    throw new Error("useJobAlerts must be used within a JobAlertProvider");
  }
  return context;
};
