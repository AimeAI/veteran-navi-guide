
/**
 * Security utility functions for protecting user data and preventing unauthorized access
 */

import { toast } from "sonner";
import DOMPurify from 'dompurify';

// Regular expression for detecting potentially malicious scripts
const SCRIPT_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @returns Sanitized input string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Use DOMPurify to sanitize HTML
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed for basic text inputs
    ALLOWED_ATTR: [] // No attributes allowed
  });
  
  return sanitized;
};

/**
 * Sanitizes HTML content (for rich text inputs) to prevent XSS attacks
 * @param html - The HTML content to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Use DOMPurify with allowed tags for rich text
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
  
  return sanitized;
};

// Track login attempts for rate limiting
const loginAttempts: Record<string, { count: number, timestamp: number }> = {};

/**
 * Rate limiting for login attempts to prevent brute-force attacks
 * @param identifier - Usually email or username
 * @param maxAttempts - Maximum number of attempts allowed
 * @param timeWindowMs - Time window in milliseconds
 * @returns Whether the action should be rate limited
 */
export const shouldRateLimit = (
  identifier: string,
  maxAttempts: number = 5,
  timeWindowMs: number = 5 * 60 * 1000 // 5 minutes
): boolean => {
  const now = Date.now();
  const userAttempts = loginAttempts[identifier];
  
  // First attempt
  if (!userAttempts) {
    loginAttempts[identifier] = { count: 1, timestamp: now };
    return false;
  }
  
  // Reset if time window has passed
  if (now - userAttempts.timestamp > timeWindowMs) {
    loginAttempts[identifier] = { count: 1, timestamp: now };
    return false;
  }
  
  // Increment attempt count
  userAttempts.count += 1;
  
  // Check if rate limited
  if (userAttempts.count > maxAttempts) {
    const minutesLeft = Math.ceil((timeWindowMs - (now - userAttempts.timestamp)) / 60000);
    toast.error(`Too many attempts`, {
      description: `Please try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`
    });
    return true;
  }
  
  return false;
};

/**
 * Checks password strength
 * @param password - The password to check
 * @returns Object containing strength score and feedback
 */
export const checkPasswordStrength = (password: string): { 
  score: number; 
  feedback: string;
} => {
  // Start with a base score
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters");
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Provide feedback based on score
  if (score < 3) {
    feedback.push("Consider adding uppercase letters, numbers, and special characters");
  }
  
  return {
    score: score, // 0-5 scale
    feedback: feedback.join(". ")
  };
};

/**
 * Creates a secure random token for CSRF protection
 * @returns Random token string
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Stores CSRF token in localStorage
 */
export const storeCSRFToken = (): string => {
  const token = generateCSRFToken();
  localStorage.setItem('csrf_token', token);
  return token;
};

/**
 * Validates CSRF token from form submission
 * @param token - The token from the form
 * @returns Whether the token is valid
 */
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = localStorage.getItem('csrf_token');
  return token === storedToken;
};

/**
 * Detects and prevents reflected XSS attempts
 * @param value - The string to check
 * @returns Cleaned string
 */
export const preventReflectedXSS = (value: string): string => {
  if (!value) return '';
  
  // Remove any script tags
  return value.replace(SCRIPT_PATTERN, '');
};
