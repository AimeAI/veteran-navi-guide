
/**
 * Logger utility
 * 
 * Centralized logging system that respects environment configuration
 * and provides consistent logging throughout the application.
 */

import { config } from '@/config/environment';

// Log levels with numeric values for comparison
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Current log level from config
const currentLevel = LOG_LEVELS[config.logLevel];

// Logger object with methods for each log level
const logger = {
  error: (message: string, ...args: any[]): void => {
    if (currentLevel >= LOG_LEVELS.error) {
      console.error(`❌ ERROR: ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]): void => {
    if (currentLevel >= LOG_LEVELS.warn) {
      console.warn(`⚠️ WARNING: ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: any[]): void => {
    if (currentLevel >= LOG_LEVELS.info) {
      console.info(`ℹ️ INFO: ${message}`, ...args);
    }
  },
  
  debug: (message: string, ...args: any[]): void => {
    if (currentLevel >= LOG_LEVELS.debug) {
      console.debug(`🔍 DEBUG: ${message}`, ...args);
    }
  },
  
  // Performance logging
  perf: (label: string, operation: () => any): any => {
    if (!config.debug) return operation();
    
    const start = performance.now();
    try {
      return operation();
    } finally {
      const end = performance.now();
      console.debug(`⏱️ PERF: ${label} took ${(end - start).toFixed(2)}ms`);
    }
  },
  
  // Group logs for better readability
  group: (label: string, callback: () => void): void => {
    if (config.debug) {
      console.group(label);
      callback();
      console.groupEnd();
    } else {
      callback();
    }
  },
};

export default logger;
