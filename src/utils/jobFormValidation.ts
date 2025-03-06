
import { isEmptyOrWhitespace, isNumeric } from './validation';

// Validates job form fields and returns validation errors
export interface JobFormValidationErrors {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  salaryMin?: string;
  salaryMax?: string;
  mosCodes?: string;
}

export const validateJobForm = (formData: {
  title: string;
  company: string;
  location: string;
  description: string;
  salaryMin: string;
  salaryMax: string;
  mosCodes: string[];
}): JobFormValidationErrors => {
  const errors: JobFormValidationErrors = {};

  // Required fields validation
  if (isEmptyOrWhitespace(formData.title)) {
    errors.title = 'Job title is required';
  }

  if (isEmptyOrWhitespace(formData.company)) {
    errors.company = 'Company name is required';
  }

  if (isEmptyOrWhitespace(formData.location)) {
    errors.location = 'Location is required';
  }

  if (isEmptyOrWhitespace(formData.description)) {
    errors.description = 'Job description is required';
  }

  // Salary validation
  if (formData.salaryMin && !isNumeric(formData.salaryMin)) {
    errors.salaryMin = 'Minimum salary must be a number';
  }

  if (formData.salaryMax && !isNumeric(formData.salaryMax)) {
    errors.salaryMax = 'Maximum salary must be a number';
  }

  // Check if max salary is less than min salary
  if (
    formData.salaryMin && 
    formData.salaryMax && 
    isNumeric(formData.salaryMin) && 
    isNumeric(formData.salaryMax) && 
    Number(formData.salaryMax) < Number(formData.salaryMin)
  ) {
    errors.salaryMax = 'Maximum salary cannot be less than minimum salary';
  }

  // MOS code validation - example validation for format
  const invalidMosCodes = formData.mosCodes.filter(code => code.length !== 5 || !isNumeric(code));
  if (invalidMosCodes.length > 0) {
    errors.mosCodes = 'MOS codes should be 5 digits';
  }

  return errors;
};

// Check if the form is valid (no errors)
export const isFormValid = (errors: JobFormValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};
