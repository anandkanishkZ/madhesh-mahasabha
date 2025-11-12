import dotenv from 'dotenv';

// Load environment variables before validation
dotenv.config();

/**
 * Environment variable validation
 * Ensures all required environment variables are set before the application starts
 */

interface EnvConfig {
  // Database
  DATABASE_URL: string;

  // JWT & Authentication
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;

  // Server Configuration
  PORT: string;
  NODE_ENV: 'development' | 'production' | 'test';
  FRONTEND_URL: string;

  // Rate Limiting (with defaults)
  RATE_LIMIT_WINDOW_MS?: string;
  RATE_LIMIT_MAX_REQUESTS?: string;

  // Session
  SESSION_MAX_AGE?: string;

  // Optional - Admin Initialization
  INITIAL_ADMIN_USERNAME?: string;
  INITIAL_ADMIN_EMAIL?: string;
  INITIAL_ADMIN_PASSWORD?: string;
  INITIAL_ADMIN_NAME?: string;
}

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS: (keyof EnvConfig)[] = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'PORT',
  'NODE_ENV',
  'FRONTEND_URL',
];

/**
 * Validate environment variables
 * Throws an error if any required variable is missing
 */
export function validateEnv(): EnvConfig {
  const missingVars: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  REQUIRED_ENV_VARS.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // If there are missing variables, throw an error
  if (missingVars.length > 0) {
    const errorMessage = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  ❌ MISSING REQUIRED ENVIRONMENT VARIABLES                ║
║                                                           ║
║  The following environment variables are required but     ║
║  not set in your .env file:                               ║
║                                                           ║
${missingVars.map(v => `║  - ${v.padEnd(54)} ║`).join('\n')}
║                                                           ║
║  Please create a .env file based on .env.example and      ║
║  set all required variables.                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `;
    throw new Error(errorMessage);
  }

  // Validate specific formats
  
  // 1. DATABASE_URL should be a valid PostgreSQL connection string
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    warnings.push('DATABASE_URL should be a valid PostgreSQL connection string starting with postgresql://');
  }

  // 2. JWT_SECRET should be at least 32 characters
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }

  // 3. NEXTAUTH_SECRET should be at least 32 characters
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    warnings.push('NEXTAUTH_SECRET should be at least 32 characters long for security');
  }

  // 4. NODE_ENV should be development, production, or test
  const validNodeEnvs = ['development', 'production', 'test'];
  if (process.env.NODE_ENV && !validNodeEnvs.includes(process.env.NODE_ENV)) {
    warnings.push(`NODE_ENV should be one of: ${validNodeEnvs.join(', ')}`);
  }

  // 5. PORT should be a valid number
  if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
    warnings.push('PORT should be a valid number');
  }

  // 6. FRONTEND_URL should be a valid URL
  if (process.env.FRONTEND_URL) {
    try {
      new URL(process.env.FRONTEND_URL);
    } catch {
      warnings.push('FRONTEND_URL should be a valid URL (e.g., http://localhost:3000)');
    }
  }

  // Print warnings if in development mode
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('\n⚠️  Environment Variable Warnings:\n');
    warnings.forEach(warning => console.warn(`   - ${warning}`));
    console.warn('');
  }

  // Security check for production
  if (process.env.NODE_ENV === 'production') {
    const productionWarnings: string[] = [];

    // Check for default/weak secrets in production
    const weakSecrets = [
      'your-super-secret-key-change-this-in-production',
      'your-jwt-secret-key-change-this-in-production',
      'change_this_password_123',
      'secret',
      'password',
      '12345',
    ];

    if (weakSecrets.some(weak => process.env.JWT_SECRET?.includes(weak))) {
      productionWarnings.push('JWT_SECRET appears to be a default/weak value');
    }

    if (weakSecrets.some(weak => process.env.NEXTAUTH_SECRET?.includes(weak))) {
      productionWarnings.push('NEXTAUTH_SECRET appears to be a default/weak value');
    }

    if (process.env.FRONTEND_URL?.includes('localhost')) {
      productionWarnings.push('FRONTEND_URL should not be localhost in production');
    }

    if (productionWarnings.length > 0) {
      const errorMessage = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  🚨 PRODUCTION SECURITY WARNINGS                          ║
║                                                           ║
${productionWarnings.map(w => `║  - ${w.padEnd(56)} ║`).join('\n')}
║                                                           ║
║  These issues must be fixed before deploying to           ║
║  production!                                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `;
      throw new Error(errorMessage);
    }
  }

  // Return validated config
  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    FRONTEND_URL: process.env.FRONTEND_URL!,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,
    INITIAL_ADMIN_USERNAME: process.env.INITIAL_ADMIN_USERNAME,
    INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL,
    INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD,
    INITIAL_ADMIN_NAME: process.env.INITIAL_ADMIN_NAME,
  };
}

/**
 * Get validated environment configuration
 */
export function getEnvConfig(): EnvConfig {
  return validateEnv();
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}
