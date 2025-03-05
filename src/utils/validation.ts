
/**
 * Validation utility functions for form inputs
 */

// Email validation using regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - at least 8 chars, 1 uppercase, 1 lowercase, 1 number
export const isStrongPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber;
};

// Phone number validation
export const isValidPhone = (phone: string): boolean => {
  // Basic phone format validation (accepts various formats)
  const phoneRegex = /^[\d\s\-\(\)\.+]{10,15}$/;
  return phoneRegex.test(phone);
};

// Check if string is empty or just whitespace
export const isEmptyOrWhitespace = (value: string): boolean => {
  return value.trim() === '';
};

// Check if value is numeric
export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};
