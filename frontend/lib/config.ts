/**
 * Centralized Configuration
 * Single source of truth for all configuration values
 */

/**
 * Get API base URL
 * @returns The base URL for API requests
 */
export function getApiUrl(): string {
  // Use NEXT_PUBLIC_API_URL from environment, fallback to localhost for development
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    // Only use localhost in development
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:5000';
    }
    
    // In production, this should always be set
    console.warn('⚠️ NEXT_PUBLIC_API_URL is not set in production environment');
    return '';
  }
  
  return apiUrl;
}

/**
 * Get frontend URL
 * @returns The base URL for the frontend application
 */
export function getFrontendUrl(): string {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  
  if (!frontendUrl) {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    
    console.warn('⚠️ NEXT_PUBLIC_FRONTEND_URL is not set in production environment');
    return '';
  }
  
  return frontendUrl;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Configuration object
 */
export const config = {
  api: {
    baseUrl: getApiUrl(),
  },
  frontend: {
    baseUrl: getFrontendUrl(),
  },
  env: {
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
  },
} as const;
