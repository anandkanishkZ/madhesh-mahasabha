import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

/**
 * Sanitization utility to prevent XSS attacks and clean user inputs
 */

/**
 * Sanitize HTML content - removes potentially dangerous HTML/scripts
 * while preserving safe formatting tags
 */
export const sanitizeHtml = (dirty: string | undefined | null): string => {
  if (!dirty) return '';
  
  // Configure DOMPurify to allow safe tags for rich text content
  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
  
  return clean.trim();
};

/**
 * Sanitize plain text - removes all HTML tags and scripts
 * Use this for fields that should never contain HTML
 */
export const sanitizePlainText = (text: string | undefined | null): string => {
  if (!text) return '';
  
  // Strip all HTML tags
  const withoutHtml = DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Remove extra whitespace
  return withoutHtml.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitize email - validates and normalizes email addresses
 */
export const sanitizeEmail = (email: string | undefined | null): string => {
  if (!email) return '';
  
  const trimmed = email.trim().toLowerCase();
  
  // Validate email format
  if (!validator.isEmail(trimmed)) {
    throw new Error('Invalid email format');
  }
  
  // Normalize email
  return validator.normalizeEmail(trimmed) || trimmed;
};

/**
 * Sanitize URL - validates and normalizes URLs
 */
export const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  
  const trimmed = url.trim();
  
  // Validate URL format
  if (!validator.isURL(trimmed, { 
    protocols: ['http', 'https'],
    require_protocol: true 
  })) {
    throw new Error('Invalid URL format');
  }
  
  return trimmed;
};

/**
 * Sanitize phone number - removes non-numeric characters except + and -
 */
export const sanitizePhone = (phone: string | undefined | null): string => {
  if (!phone) return '';
  
  // Remove all characters except numbers, +, -, (, ), and spaces
  const cleaned = phone.trim().replace(/[^\d+\-() ]/g, '');
  
  return cleaned;
};

/**
 * Sanitize slug - creates URL-safe slugs
 */
export const sanitizeSlug = (slug: string | undefined | null): string => {
  if (!slug) return '';
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Sanitize array of strings - applies plain text sanitization to each element
 */
export const sanitizeStringArray = (arr: string[] | undefined | null): string[] => {
  if (!arr || !Array.isArray(arr)) return [];
  
  return arr
    .map(item => sanitizePlainText(item))
    .filter(item => item.length > 0);
};

/**
 * Sanitize object - recursively sanitizes all string properties
 * Use with caution - specify which fields to sanitize for better control
 */
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T,
  options: {
    htmlFields?: string[];     // Fields that can contain safe HTML
    plainTextFields?: string[]; // Fields that should be plain text only
    emailFields?: string[];     // Fields that should be email addresses
    urlFields?: string[];       // Fields that should be URLs
    phoneFields?: string[];     // Fields that should be phone numbers
    slugFields?: string[];      // Fields that should be URL slugs
    arrayFields?: string[];     // Fields that are string arrays
  } = {}
): T => {
  const sanitized = { ...obj } as any;
  
  // Sanitize HTML fields
  options.htmlFields?.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeHtml(sanitized[field]);
    }
  });
  
  // Sanitize plain text fields
  options.plainTextFields?.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizePlainText(sanitized[field]);
    }
  });
  
  // Sanitize email fields
  options.emailFields?.forEach(field => {
    if (sanitized[field]) {
      try {
        sanitized[field] = sanitizeEmail(sanitized[field]);
      } catch (error) {
        // Keep original if validation fails - let validator handle it
      }
    }
  });
  
  // Sanitize URL fields
  options.urlFields?.forEach(field => {
    if (sanitized[field]) {
      try {
        sanitized[field] = sanitizeUrl(sanitized[field]);
      } catch (error) {
        // Keep original if validation fails - let validator handle it
      }
    }
  });
  
  // Sanitize phone fields
  options.phoneFields?.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizePhone(sanitized[field]);
    }
  });
  
  // Sanitize slug fields
  options.slugFields?.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeSlug(sanitized[field]);
    }
  });
  
  // Sanitize array fields
  options.arrayFields?.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeStringArray(sanitized[field]);
    }
  });
  
  return sanitized as T;
};

/**
 * Escape special characters for SQL-like queries
 * Note: Prisma already handles SQL injection, but this adds extra safety
 */
export const escapeSqlLike = (str: string | undefined | null): string => {
  if (!str) return '';
  
  return str.replace(/[%_\\]/g, '\\$&');
};
