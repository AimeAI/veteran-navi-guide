
import React, { useState } from 'react';
import { Briefcase, Building, MapPin, FileText, DollarSign, Tag, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

// Interface for job form data
interface JobFormData {
  title: string;
  company: string;
  location: string;
  description: string;
  salaryMin: string;
  salaryMax: string;
  skills: string[];
  mosCodes: string[];
  jobType: string;
  remoteOption: string;
}

interface PostJobFormProps {
  className?: string;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ className }) => {
  // Initial form state
  const initialFormState: JobFormData = {
    title: '',
    company: '',
    location: '',
    description: '',
    salaryMin: '',
    salaryMax: '',
    skills: [],
    mosCodes: [],
    jobType: 'fullTime',
    remoteOption: 'onsite'
  };

  const [formData, setFormData] = useState<JobFormData>(initialFormState);
  const [currentSkill, setCurrentSkill] = useState<string>('');
  const [currentMosCode, setCurrentMosCode] = useState<string>('');

  // Common MOS codes for Canadian Army
  const commonMosCodes = [
    { code: '00005', description: 'Combat Arms' },
    { code: '00008', description: 'Combat Engineer' },
    { code: '00120', description: 'Signal Operator' },
    { code: '00171', description: 'Communications and Information Systems Specialist' },
    { code: '00178', description: 'Military Police' },
    { code: '00214', description: 'Artillery Soldier' },
    { code: '00306', description: 'Vehicle Technician' },
    { code: '00328', description: 'Supply Technician' },
    { code: '00334', description: 'Cook' },
    { code: '00339', description: 'Intelligence Operator' },
  ];

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Add a skill to the skills array
  const addSkill = () => {
    if (currentSkill.trim() !== '' && !formData.skills.includes(currentSkill.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  // Remove a skill from the skills array
  const removeSkill = (skillToRemove: string) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Add a MOS code to the mosCodes array
  const addMosCode = () => {
    if (currentMosCode.trim() !== '' && !formData.mosCodes.includes(currentMosCode.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        mosCodes: [...prevData.mosCodes, currentMosCode.trim()]
      }));
      setCurrentMosCode('');
    }
  };

  // Remove a MOS code from the mosCodes array
  const removeMosCode = (codeToRemove: string) => {
    setFormData((prevData) => ({
      ...prevData,
      mosCodes: prevData.mosCodes.filter(code => code !== codeToRemove)
    }));
  };

  // Add a suggested MOS code
  const addSuggestedMosCode = (code: string) => {
    if (!formData.mosCodes.includes(code)) {
      setFormData((prevData) => ({
        ...prevData,
        mosCodes: [...prevData.mosCodes, code]
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Job posting data:', formData);
    // Here you would typically send the data to an API
    alert('Job posted successfully! Check console for details.');
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="e.g. Cybersecurity Analyst"
            />
          </div>
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={formData.company}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="e.g. TechDefense Solutions"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="e.g. Ottawa, ON"
            />
          </div>
        </div>

        {/* Job Type & Remote Options - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Type */}
          <div className="space-y-2">
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
              Job Type <span className="text-red-500">*</span>
            </label>
            <select
              id="jobType"
              name="jobType"
              required
              value={formData.jobType}
              onChange={handleInputChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="fullTime">Full-time</option>
              <option value="partTime">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          {/* Remote Option */}
          <div className="space-y-2">
            <label htmlFor="remoteOption" className="block text-sm font-medium text-gray-700">
              Work Location <span className="text-red-500">*</span>
            </label>
            <select
              id="remoteOption"
              name="remoteOption"
              required
              value={formData.remoteOption}
              onChange={handleInputChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="onsite">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Salary Range - Two Column Layout */}
        <div className="space-y-2">
          <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700">
            Salary Range
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                min="0"
                value={formData.salaryMin}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Minimum salary"
              />
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                min="0"
                value={formData.salaryMax}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Maximum salary"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Providing a salary range improves job post visibility and candidate quality.
          </p>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Describe the role, responsibilities, and qualifications..."
            />
          </div>
        </div>

        {/* Required Skills */}
        <div className="space-y-2">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Required Skills
          </label>
          <div className="flex space-x-2">
            <div className="relative rounded-md shadow-sm flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="skills"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="e.g. Project Management"
              />
            </div>
            <button
              type="button"
              onClick={addSkill}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add
            </button>
          </div>
          {formData.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300"
                  >
                    <span className="sr-only">Remove {skill}</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* MOS Codes */}
        <div className="space-y-2">
          <label htmlFor="mosCodes" className="block text-sm font-medium text-gray-700">
            Military Occupation Specialty (MOSID) Codes
          </label>
          <p className="text-xs text-gray-500">
            Add relevant MOSID codes to help veterans with matching skills find your job posting.
          </p>
          <div className="flex space-x-2">
            <div className="relative rounded-md shadow-sm flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="mosCodes"
                value={currentMosCode}
                onChange={(e) => setCurrentMosCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addMosCode();
                  }
                }}
                className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="e.g. 00005 or 00339"
              />
            </div>
            <button
              type="button"
              onClick={addMosCode}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add
            </button>
          </div>
          
          {/* Common MOS code suggestions */}
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-700 mb-1">Common MOSID codes:</p>
            <div className="flex flex-wrap gap-2">
              {commonMosCodes.map((mos) => (
                <button
                  key={mos.code}
                  type="button"
                  onClick={() => addSuggestedMosCode(mos.code)}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  title={mos.description}
                >
                  {mos.code}
                </button>
              ))}
            </div>
          </div>
          
          {formData.mosCodes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.mosCodes.map((code, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {code}
                  <button
                    type="button"
                    onClick={() => removeMosCode(code)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-200 text-green-800 hover:bg-green-300"
                  >
                    <span className="sr-only">Remove {code}</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;
