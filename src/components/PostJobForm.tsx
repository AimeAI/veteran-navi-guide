import React, { useState, useEffect } from 'react';
import { Briefcase, Building, MapPin, FileText, DollarSign, Tag, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import FormErrorMessage from './ui/form-error-message';
import { validateJobForm, isFormValid, JobFormValidationErrors } from '@/utils/jobFormValidation';

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
  const [errors, setErrors] = useState<JobFormValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  // Validate form when formData changes or after first submission
  useEffect(() => {
    if (formSubmitted || Object.keys(touchedFields).length > 0) {
      const validationErrors = validateJobForm(formData);
      setErrors(validationErrors);
    }
  }, [formData, formSubmitted, touchedFields]);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Handle onBlur to validate field when user moves away
  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
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
      
      // Validate MOS codes after adding
      setTouchedFields(prev => ({
        ...prev,
        mosCodes: true
      }));
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

  // Form is valid if there are no errors
  const isValid = isFormValid(errors);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    const validationErrors = validateJobForm(formData);
    setErrors(validationErrors);
    
    if (isFormValid(validationErrors)) {
      console.log('Job posting data:', formData);
      // Here you would typically send the data to an API
      alert('Job posted successfully! Check console for details.');
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
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
              value={formData.title}
              onChange={handleInputChange}
              onBlur={() => handleBlur('title')}
              className={cn(
                "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-primary focus:border-primary",
                errors.title && touchedFields.title ? "border-red-500" : "border-gray-300"
              )}
              placeholder="e.g. Cybersecurity Analyst"
              aria-invalid={errors.title && touchedFields.title ? 'true' : 'false'}
            />
          </div>
          <FormErrorMessage message={touchedFields.title ? errors.title : undefined} />
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
              value={formData.company}
              onChange={handleInputChange}
              onBlur={() => handleBlur('company')}
              className={cn(
                "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-primary focus:border-primary",
                errors.company && touchedFields.company ? "border-red-500" : "border-gray-300"
              )}
              placeholder="e.g. TechDefense Solutions"
              aria-invalid={errors.company && touchedFields.company ? 'true' : 'false'}
            />
          </div>
          <FormErrorMessage message={touchedFields.company ? errors.company : undefined} />
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
              value={formData.location}
              onChange={handleInputChange}
              onBlur={() => handleBlur('location')}
              className={cn(
                "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-primary focus:border-primary",
                errors.location && touchedFields.location ? "border-red-500" : "border-gray-300"
              )}
              placeholder="e.g. Ottawa, ON"
              aria-invalid={errors.location && touchedFields.location ? 'true' : 'false'}
            />
          </div>
          <FormErrorMessage message={touchedFields.location ? errors.location : undefined} />
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
            <div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="salaryMin"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('salaryMin')}
                  className={cn(
                    "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-primary focus:border-primary",
                    errors.salaryMin && touchedFields.salaryMin ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="Minimum salary"
                  aria-invalid={errors.salaryMin && touchedFields.salaryMin ? 'true' : 'false'}
                />
              </div>
              <FormErrorMessage message={touchedFields.salaryMin ? errors.salaryMin : undefined} />
            </div>
            <div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="salaryMax"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('salaryMax')}
                  className={cn(
                    "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-primary focus:border-primary",
                    errors.salaryMax && touchedFields.salaryMax ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="Maximum salary"
                  aria-invalid={errors.salaryMax && touchedFields.salaryMax ? 'true' : 'false'}
                />
              </div>
              <FormErrorMessage message={touchedFields.salaryMax ? errors.salaryMax : undefined} />
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
              value={formData.description}
              onChange={handleInputChange}
              onBlur={() => handleBlur('description')}
              rows={6}
              className={cn(
                "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-primary focus:border-primary",
                errors.description && touchedFields.description ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Describe the role, responsibilities, and qualifications..."
              aria-invalid={errors.description && touchedFields.description ? 'true' : 'false'}
            />
          </div>
          <FormErrorMessage message={touchedFields.description ? errors.description : undefined} />
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
                className={cn(
                  "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-primary focus:border-primary",
                  errors.skills && touchedFields.skills ? "border-red-500" : "border-gray-300"
                )}
                placeholder="e.g. Project Management"
                aria-invalid={errors.skills && touchedFields.skills ? 'true' : 'false'}
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
                className={cn(
                  "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md focus:ring-primary focus:border-primary",
                  errors.mosCodes && touchedFields.mosCodes ? "border-red-500" : "border-gray-300"
                )}
                placeholder="e.g. 00005 or 00339"
                aria-invalid={errors.mosCodes && touchedFields.mosCodes ? 'true' : 'false'}
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
          <FormErrorMessage message={touchedFields.mosCodes ? errors.mosCodes : undefined} />
          
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
            disabled={formSubmitted && !isValid}
            className={cn(
              "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200",
              formSubmitted && !isValid 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            )}
          >
            Post Job
          </button>
          {formSubmitted && !isValid && (
            <p className="mt-2 text-center text-sm text-destructive">
              Please fix the errors above before submitting.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;
