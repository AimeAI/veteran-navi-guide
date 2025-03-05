
import { useState } from 'react';

export type ValidationRule = (value: string) => boolean;

export interface ValidationRules {
  [key: string]: {
    validate: ValidationRule;
    errorMessage: string;
  }[];
}

export interface FormErrors {
  [key: string]: string;
}

interface UseFormValidationResult {
  errors: FormErrors;
  validateField: (name: string, value: string) => boolean;
  validateForm: (values: Record<string, string>) => boolean;
  setFieldError: (name: string, error: string) => void;
  clearFieldError: (name: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

/**
 * Custom hook for form validation
 * @param validationRules - Rules for validating form fields
 * @returns Form validation utilities
 */
export const useFormValidation = (validationRules: ValidationRules): UseFormValidationResult => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: string): boolean => {
    if (!validationRules[name]) return true;

    for (const rule of validationRules[name]) {
      if (!rule.validate(value)) {
        setErrors(prev => ({ ...prev, [name]: rule.errorMessage }));
        return false;
      }
    }

    // If all validations pass, clear any existing error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return true;
  };

  const validateForm = (values: Record<string, string>): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Check each field against its validation rules
    Object.keys(validationRules).forEach(fieldName => {
      const value = values[fieldName] || '';
      
      for (const rule of validationRules[fieldName]) {
        if (!rule.validate(value)) {
          newErrors[fieldName] = rule.errorMessage;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const setFieldError = (name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const clearFieldError = (name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors: Object.keys(errors).length > 0
  };
};
