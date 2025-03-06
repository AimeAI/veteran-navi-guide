
// Mock resume parser utility
// In a real application, this would integrate with a resume parsing API or library
// such as Affinda, Sovren, or other resume parsing services

interface ResumeData {
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  summary?: string;
}

export const parseResume = async (file: File): Promise<ResumeData> => {
  console.log('Parsing resume:', file.name);
  
  // In a real application, you would:
  // 1. Upload the file to your backend or directly to a parsing service
  // 2. Extract the text content using a PDF/DOCX parsing library
  // 3. Use NLP or a specialized API to extract structured information
  
  // For demonstration purposes, we're returning mock data
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
  
  // Generate different mock data based on file name to simulate different resumes
  const fileNameHash = file.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use the hash to create some variety in the mock data
  const hasMoreExperience = fileNameHash % 2 === 0;
  const hasMoreEducation = fileNameHash % 3 === 0;
  const hasMoreSkills = fileNameHash % 5 === 0;
  
  // Common military skills
  const militarySkills = [
    'Leadership', 'Team Management', 'Strategic Planning', 'Security Clearance',
    'Operations Management', 'Logistics', 'Communication', 'Problem Solving',
    'Crisis Management', 'Adaptability', 'Conflict Resolution'
  ];
  
  // Technical skills for veterans transitioning to civilian jobs
  const technicalSkills = [
    'Project Management', 'Microsoft Office', 'Data Analysis', 'Cybersecurity',
    'Network Administration', 'System Analysis', 'Technical Writing', 'IT Support',
    'Software Development', 'Hardware Maintenance', 'Cloud Computing'
  ];
  
  const selectedMilitarySkills = militarySkills
    .sort(() => 0.5 - Math.random())
    .slice(0, hasMoreSkills ? 6 : 4);
    
  const selectedTechnicalSkills = technicalSkills
    .sort(() => 0.5 - Math.random())
    .slice(0, hasMoreSkills ? 5 : 3);
  
  const mockData: ResumeData = {
    skills: [...selectedMilitarySkills, ...selectedTechnicalSkills],
    experience: [
      {
        title: 'Team Leader',
        company: 'Canadian Armed Forces',
        duration: '2015-2020',
        description: 'Led a team of 12 personnel in various operations. Responsible for training, logistics, and mission planning. Ensured all team members were properly equipped and prepared for assignments.'
      },
      {
        title: 'Logistics Specialist',
        company: 'Canadian Armed Forces',
        duration: '2010-2015',
        description: 'Coordinated supply chain operations and inventory management. Processed over 500 requisitions monthly with 99% accuracy. Implemented new tracking system that improved efficiency by 30%.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Toronto',
        year: '2008-2012'
      }
    ],
    summary: 'Dedicated and disciplined professional with 10 years of military experience, specializing in team leadership and logistics management. Proven track record of success in high-pressure environments, with excellent problem-solving abilities and attention to detail. Seeking to leverage my skills and experience in a challenging civilian role.'
  };
  
  // Add more experience if the hash indicates it
  if (hasMoreExperience) {
    mockData.experience.push({
      title: 'IT Support Specialist',
      company: 'Tech Solutions Inc.',
      duration: '2020-2022',
      description: 'Provided technical support for a company of 200+ employees. Resolved hardware and software issues promptly. Maintained network infrastructure and implemented security protocols.'
    });
  }
  
  // Add more education if the hash indicates it
  if (hasMoreEducation) {
    mockData.education.push({
      degree: 'Certificate in Cybersecurity',
      institution: 'Military Advanced Training Center',
      year: '2018'
    });
  }
  
  return mockData;
};

export const generateResumeFeedback = (resumeData: ResumeData) => {
  // In a real application, this would analyze the resume against industry best practices
  // and job market requirements to provide useful feedback
  
  // This would be more sophisticated in a real implementation
  const feedbackPoints = [];
  
  if (resumeData.skills.length < 8) {
    feedbackPoints.push({
      type: 'suggestion',
      message: 'Consider adding more skills to showcase your versatility.'
    });
  }
  
  if (!resumeData.summary || resumeData.summary.length < 100) {
    feedbackPoints.push({
      type: 'warning',
      message: 'Your professional summary is too brief. Expand it to highlight your unique value proposition.'
    });
  }
  
  return feedbackPoints;
};
