
import { useState, useEffect } from 'react';
import { Job } from '../types/job';

export function useJobOperations() {
  const [savedJobs, setSavedJobs] = useState<Job[]>(() => {
    const storedJobs = localStorage.getItem('savedJobs');
    return storedJobs ? JSON.parse(storedJobs) : [];
  });
  
  const [appliedJobs, setAppliedJobs] = useState<Job[]>(() => {
    const storedJobs = localStorage.getItem('appliedJobs');
    return storedJobs ? JSON.parse(storedJobs) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Function to save a job
  const saveJob = (job: Job) => {
    setSavedJobs((prev) => {
      if (prev.some(j => j.id === job.id)) {
        return prev;
      }
      const newSavedJobs = [...prev, job];
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      return newSavedJobs;
    });
  };

  // Function to unsave a job
  const unsaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSavedJobs = prev.filter(job => job.id !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      return newSavedJobs;
    });
  };

  // Function to apply to a job
  const applyToJob = (job: Job) => {
    setAppliedJobs((prev) => {
      if (prev.some(j => j.id === job.id)) {
        return prev;
      }
      const newAppliedJobs = [...prev, job];
      localStorage.setItem('appliedJobs', JSON.stringify(newAppliedJobs));
      return newAppliedJobs;
    });
  };

  return {
    savedJobs,
    appliedJobs,
    saveJob,
    unsaveJob,
    applyToJob
  };
}
