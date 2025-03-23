
/**
 * Environment configuration utility
 * 
 * This file centralizes all environment-specific configuration settings
 * and provides a consistent interface for accessing environment variables
 * throughout the application.
 */

// Default environment is development
const ENV = import.meta.env.MODE || 'development';

// Environment configuration with type safety
interface EnvironmentConfig {
  // API & Integration URLs
  supabaseUrl: string;
  supabaseAnonKey: string;
  
  // Feature flags
  enableMilitarySkillsMatcher: boolean;
  enableAdvancedSearch: boolean;
  enableRealTimeNotifications: boolean;
  
  // API configuration
  apiTimeoutMs: number;
  maxApiRetries: number;
  apiRateLimitPerMinute: number;
  
  // Cache settings
  cacheTimeMs: number;
  
  // Debug settings
  debug: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

// Default configuration
const defaultConfig: EnvironmentConfig = {
  supabaseUrl: 'https://ykperxxuwqolbfvhuqig.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcGVyeHh1d3FvbGJmdmh1cWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwODE3OTIsImV4cCI6MjA1MzY1Nzc5Mn0.-WvuM5Xtfo4Q2oFwWQrXiJm5UTxnUqupOPsDRQ2DDOU',
  
  // Feature flags - disabled by default
  enableMilitarySkillsMatcher: false,
  enableAdvancedSearch: false,
  enableRealTimeNotifications: false,
  
  // API configuration
  apiTimeoutMs: 30000, // 30 seconds
  maxApiRetries: 3,
  apiRateLimitPerMinute: 60,
  
  // Cache settings
  cacheTimeMs: 5 * 60 * 1000, // 5 minutes
  
  // Debug settings
  debug: false,
  logLevel: 'error',
};

// Environment-specific overrides
const environmentConfigs: Record<string, Partial<EnvironmentConfig>> = {
  development: {
    debug: true,
    logLevel: 'debug',
    enableMilitarySkillsMatcher: true,
    enableAdvancedSearch: true,
    cacheTimeMs: 1 * 60 * 1000, // 1 minute in development
  },
  test: {
    debug: true,
    logLevel: 'debug',
    cacheTimeMs: 0, // No caching in test environment
  },
  production: {
    // Production specific overrides would go here
    enableMilitarySkillsMatcher: true,
    enableAdvancedSearch: true,
    cacheTimeMs: 15 * 60 * 1000, // 15 minutes in production for better performance
    maxApiRetries: 5, // More retries in production
  },
};

// Process environment variables from .env files
const processEnvVars = (): Partial<EnvironmentConfig> => {
  const envConfig: Partial<EnvironmentConfig> = {};
  
  // API & Integration URLs
  if (import.meta.env.VITE_SUPABASE_URL) {
    envConfig.supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  }
  
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    envConfig.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  }
  
  // Feature flags
  if (import.meta.env.VITE_ENABLE_MILITARY_SKILLS_MATCHER) {
    envConfig.enableMilitarySkillsMatcher = import.meta.env.VITE_ENABLE_MILITARY_SKILLS_MATCHER === 'true';
  }
  
  if (import.meta.env.VITE_ENABLE_ADVANCED_SEARCH) {
    envConfig.enableAdvancedSearch = import.meta.env.VITE_ENABLE_ADVANCED_SEARCH === 'true';
  }
  
  if (import.meta.env.VITE_ENABLE_REAL_TIME_NOTIFICATIONS) {
    envConfig.enableRealTimeNotifications = import.meta.env.VITE_ENABLE_REAL_TIME_NOTIFICATIONS === 'true';
  }
  
  // API configurations
  if (import.meta.env.VITE_API_TIMEOUT_MS) {
    envConfig.apiTimeoutMs = parseInt(import.meta.env.VITE_API_TIMEOUT_MS as string, 10);
  }
  
  if (import.meta.env.VITE_MAX_API_RETRIES) {
    envConfig.maxApiRetries = parseInt(import.meta.env.VITE_MAX_API_RETRIES as string, 10);
  }
  
  if (import.meta.env.VITE_API_RATE_LIMIT) {
    envConfig.apiRateLimitPerMinute = parseInt(import.meta.env.VITE_API_RATE_LIMIT as string, 10);
  }
  
  // Cache settings
  if (import.meta.env.VITE_CACHE_TIME_MS) {
    envConfig.cacheTimeMs = parseInt(import.meta.env.VITE_CACHE_TIME_MS as string, 10);
  }
  
  // Debug settings
  if (import.meta.env.VITE_DEBUG) {
    envConfig.debug = import.meta.env.VITE_DEBUG === 'true';
  }
  
  if (import.meta.env.VITE_LOG_LEVEL) {
    const logLevel = import.meta.env.VITE_LOG_LEVEL as string;
    if (['error', 'warn', 'info', 'debug'].includes(logLevel)) {
      envConfig.logLevel = logLevel as 'error' | 'warn' | 'info' | 'debug';
    }
  }
  
  return envConfig;
};

// Build the final configuration by merging:
// 1. Default config
// 2. Environment-specific overrides
// 3. Environment variables from .env files
const buildConfig = (): EnvironmentConfig => {
  const envOverrides = environmentConfigs[ENV] || {};
  const envVars = processEnvVars();
  
  return {
    ...defaultConfig,
    ...envOverrides,
    ...envVars,
  };
};

// Export the final configuration
export const config = buildConfig();

// Convenience exports for common configuration values
export const SUPABASE_URL = config.supabaseUrl;
export const SUPABASE_ANON_KEY = config.supabaseAnonKey;
export const DEBUG_MODE = config.debug;
export const API_TIMEOUT = config.apiTimeoutMs;
export const MAX_API_RETRIES = config.maxApiRetries;

// Helper to check feature flags
export const isFeatureEnabled = (featureName: keyof Pick<EnvironmentConfig, 'enableMilitarySkillsMatcher' | 'enableAdvancedSearch' | 'enableRealTimeNotifications'>): boolean => {
  return Boolean(config[featureName]);
};

// Log configuration in development mode
if (ENV === 'development' && config.debug) {
  console.log('🔧 Environment Configuration:', ENV);
  console.log('🔧 Config:', { ...config, supabaseAnonKey: '***REDACTED***' });
}
