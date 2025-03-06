import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { searchJobs } from "@/data/jobs";

// Define Job interface
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  category: string;
  salaryRange: string;
  remote: boolean;
  clearanceLevel: string;
  mosCode: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  requiredMosCodes?: string[];
  date?: string;
  jobType?: string;
}

// Job context type
interface JobContextType {
  jobs: Job[];
  savedJobs: Job[];
  isLoading: boolean;
  searchJobs: (filters: JobFilterState) => void;
  saveJob: (job: Job) => void;
  removeSavedJob: (jobId: string) => void;
  getJobById: (id: string) => Job | undefined;
  applyToJob: (jobId: string) => void;
  appliedJobs: string[];
}

// Filter state interface
export interface JobFilterState {
  keywords: string;
  location: string;
  category: string;
  salaryRange: string;
  mosCodes: string[];
  clearanceLevel: string[];
  remote: boolean;
  militarySkills?: string[];
}

// Create the context
const JobContext = createContext<JobContextType | undefined>(undefined);

// Sample job data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Security Operations Manager',
    company: 'TechDefense Solutions',
    location: 'Ottawa, ON',
    description: 'Seeking a veteran with security background to lead our operations team. Must have experience in risk assessment and team leadership. Secret clearance preferred.',
    category: 'security',
    salaryRange: 'range3',
    remote: false,
    clearanceLevel: 'secret',
    mosCode: '31B'
  },
  {
    id: '2',
    title: 'Logistics Coordinator',
    company: 'Canadian Supply Chain Inc.',
    location: 'Halifax, NS',
    description: 'Perfect for veterans with logistics MOSID. Coordinate shipments, manage inventory, and optimize supply chain processes. Competitive salary with benefits package.',
    category: 'logistics',
    salaryRange: 'range2',
    remote: false,
    clearanceLevel: 'none',
    mosCode: '88M'
  },
  {
    id: '3',
    title: 'Software Developer',
    company: 'Tech Innovations',
    location: 'Toronto, ON',
    description: 'Looking for developers with experience in React, Node.js, and cloud technologies. Join our growing team building enterprise applications.',
    category: 'tech',
    salaryRange: 'range4',
    remote: true,
    clearanceLevel: 'none',
    mosCode: '25B'
  },
  {
    id: '4',
    title: 'Healthcare Administrator',
    company: 'Veterans Medical Centre',
    location: 'Vancouver, BC',
    description: 'Join our team dedicated to improving healthcare for veterans. Looking for organized professionals with healthcare experience from military settings.',
    category: 'healthcare',
    salaryRange: 'range2',
    remote: false,
    clearanceLevel: 'confidential',
    mosCode: '68W'
  },
  {
    id: '5',
    title: 'Project Manager',
    company: 'Veterans Construction Group',
    location: 'Edmonton, AB',
    description: 'Looking for veterans with leadership experience to manage construction projects from planning to completion. Strong organizational skills required.',
    category: 'management',
    salaryRange: 'range3',
    remote: false,
    clearanceLevel: 'none',
    mosCode: '11B'
  },
  {
    id: '6',
    title: 'Cybersecurity Analyst',
    company: 'DefenceNet Systems',
    location: 'Ottawa, ON',
    description: 'Protect critical infrastructure from cyber threats. Looking for veterans with cybersecurity background or willingness to learn.',
    category: 'tech',
    salaryRange: 'range3',
    remote: true,
    clearanceLevel: 'topsecret',
    mosCode: '25B'
  },
  {
    id: '7',
    title: 'Administrative Assistant',
    company: 'Government Services',
    location: 'Montreal, QC',
    description: 'Support executive team with administrative tasks, scheduling, and document management. Excellent organizational skills required.',
    category: 'admin',
    salaryRange: 'range1',
    remote: false,
    clearanceLevel: 'confidential',
    mosCode: '42A'
  }
];

// Initial saved jobs
const initialSavedJobs: Job[] = [
  {
    id: '1',
    title: 'Cybersecurity Specialist',
    company: 'Defense Technologies Inc.',
    location: 'Colorado Springs, CO',
    description: 'Join our team of security experts to protect critical infrastructure. Looking for veterans with security clearance and technical experience.',
    category: 'security',
    salaryRange: 'range3',
    remote: false,
    clearanceLevel: 'secret',
    mosCode: '31B'
  },
  {
    id: '2',
    title: 'Operations Manager',
    company: 'Global Logistics Group',
    location: 'Norfolk, VA',
    description: 'Leverage your military leadership experience in a fast-paced logistics environment. Oversee daily operations and team management.',
    category: 'logistics',
    salaryRange: 'range3',
    remote: false,
    clearanceLevel: 'none',
    mosCode: '88M'
  },
  {
    id: '3',
    title: 'Aviation Technician',
    company: 'AeroTech Industries',
    location: 'San Diego, CA',
    description: 'Perfect position for former military aircraft mechanics. Maintain and repair commercial and private aircraft. FAA certification a plus.',
    category: 'engineering',
    salaryRange: 'range2',
    remote: false,
    clearanceLevel: 'none',
    mosCode: '25A'
  },
  {
    id: '4',
    title: 'Emergency Response Coordinator',
    company: 'National Disaster Relief',
    location: 'Remote',
    description: 'Help coordinate emergency response teams during natural disasters. Military experience in logistics and crisis management highly desired.',
    category: 'publicSafety',
    salaryRange: 'range4',
    remote: true,
    clearanceLevel: 'secret',
    mosCode: '12B'
  }
];

// Provider component
export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API fetch delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load jobs
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      
      // Load saved jobs from localStorage or use initial data
      const storedSavedJobs = localStorage.getItem('savedJobs');
      setSavedJobs(storedSavedJobs ? JSON.parse(storedSavedJobs) : initialSavedJobs);
      
      // Load applied jobs from localStorage
      const storedAppliedJobs = localStorage.getItem('appliedJobs');
      setAppliedJobs(storedAppliedJobs ? JSON.parse(storedAppliedJobs) : []);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Save to localStorage when savedJobs change
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Save to localStorage when appliedJobs change
  useEffect(() => {
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  // Function to search/filter jobs
  const searchJobs = (filters: JobFilterState) => {
    setIsLoading(true);
    
    let results = [...jobs];

    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(keywords) || 
        job.company.toLowerCase().includes(keywords) || 
        job.description.toLowerCase().includes(keywords)
      );
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      results = results.filter(job => 
        job.location.toLowerCase().includes(location)
      );
    }

    if (filters.category) {
      results = results.filter(job => job.category === filters.category);
    }

    if (filters.salaryRange && filters.salaryRange !== 'any') {
      results = results.filter(job => job.salaryRange === filters.salaryRange);
    }

    if (filters.mosCodes.length > 0) {
      results = results.filter(job => filters.mosCodes.includes(job.mosCode));
    }

    if (filters.clearanceLevel.length > 0) {
      results = results.filter(job => filters.clearanceLevel.includes(job.clearanceLevel));
    }

    if (filters.remote) {
      results = results.filter(job => job.remote === true);
    }

    // Filter by military skills if provided
    if (filters.militarySkills && filters.militarySkills.length > 0) {
      results = results.filter(job => {
        // Check if any of the job's required skills match the selected military skills
        if (!job.requiredSkills) return false;
        
        return filters.militarySkills.some(skill => 
          job.requiredSkills?.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });
    }

    setFilteredJobs(results);
    setIsLoading(false);
    
    return results;
  };

  // Function to save a job
  const saveJob = (job: Job) => {
    if (!savedJobs.some(saved => saved.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
      toast.success(`Job saved: ${job.title}`);
    } else {
      toast.info("This job is already saved");
    }
  };

  // Function to remove a saved job
  const removeSavedJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    toast.success("Job removed from saved list");
  };

  // Function to get a job by ID
  const getJobById = (id: string) => {
    // First check in filtered jobs
    let job = filteredJobs.find(job => job.id === id);
    
    // If not found, check in all jobs
    if (!job) {
      job = jobs.find(job => job.id === id);
    }
    
    // If still not found, check in saved jobs
    if (!job) {
      job = savedJobs.find(job => job.id === id);
    }
    
    return job;
  };

  // Function to apply to a job
  const applyToJob = (jobId: string) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
      toast.success("Application submitted successfully!");
    } else {
      toast.info("You've already applied to this job");
    }
  };

  return (
    <JobContext.Provider value={{ 
      jobs: filteredJobs, 
      savedJobs, 
      isLoading, 
      searchJobs, 
      saveJob, 
      removeSavedJob, 
      getJobById,
      applyToJob,
      appliedJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};

// Custom hook for using the job context
export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
