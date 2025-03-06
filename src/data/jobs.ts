
// Sample job data
const jobs = [
  {
    id: "job-1",
    title: "Software Engineer",
    company: "TechCorp",
    location: "New York, NY",
    description: "We are looking for a software engineer to join our team.",
    requirements: ["JavaScript", "React", "Node.js"],
    salary: "$100,000 - $130,000",
    jobType: "full-time",
    datePosted: "2023-01-15T12:00:00Z"
  },
  {
    id: "job-2",
    title: "Data Scientist",
    company: "DataWorks",
    location: "San Francisco, CA",
    description: "Join our data science team to work on cutting-edge projects.",
    requirements: ["Python", "Machine Learning", "SQL"],
    salary: "$120,000 - $150,000",
    jobType: "full-time",
    datePosted: "2023-01-18T12:00:00Z"
  },
  {
    id: "job-3",
    title: "UX Designer",
    company: "DesignHub",
    location: "Remote",
    description: "Help us design beautiful and functional user interfaces.",
    requirements: ["Figma", "User Research", "Prototyping"],
    salary: "$90,000 - $110,000",
    jobType: "contract",
    datePosted: "2023-01-20T12:00:00Z"
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    description: "Manage our cloud infrastructure and CI/CD pipelines.",
    requirements: ["AWS", "Docker", "Kubernetes"],
    salary: "$110,000 - $140,000",
    jobType: "full-time",
    datePosted: "2023-01-22T12:00:00Z"
  },
  {
    id: "job-5",
    title: "Project Manager",
    company: "ProjectPro",
    location: "Chicago, IL",
    description: "Lead software development projects from conception to completion.",
    requirements: ["Agile", "JIRA", "Communication"],
    salary: "$95,000 - $120,000",
    jobType: "full-time",
    datePosted: "2023-01-25T12:00:00Z"
  }
];

// Define the search criteria type
interface SearchCriteria {
  keywords?: string[];
  locations?: string[];
  jobType?: string;
  mosCodes?: string[];
  clearanceLevel?: string[];
  remote?: boolean;
}

// Search function that filters jobs based on provided criteria
export const searchJobs = (criteria: SearchCriteria) => {
  let filteredJobs = [...jobs];

  // Filter by keywords
  if (criteria.keywords && criteria.keywords.length > 0) {
    filteredJobs = filteredJobs.filter(job => {
      return criteria.keywords!.some(keyword => 
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(keyword.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(keyword.toLowerCase()))
      );
    });
  }

  // Filter by locations
  if (criteria.locations && criteria.locations.length > 0) {
    filteredJobs = filteredJobs.filter(job => {
      return criteria.locations!.some(location => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    });
  }

  // Filter by job type
  if (criteria.jobType) {
    filteredJobs = filteredJobs.filter(job => job.jobType === criteria.jobType);
  }

  // Filter by remote (if specified)
  if (criteria.remote) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes('remote')
    );
  }

  return filteredJobs;
};

// Function to get a job by ID
export const getJobById = (id: string) => {
  return jobs.find(job => job.id === id);
};

// Export jobs data for direct access if needed
export const getAllJobs = () => jobs;
