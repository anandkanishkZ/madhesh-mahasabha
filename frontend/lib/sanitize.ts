import DOMPurify from 'dompurify';

/**
 * Frontend sanitization utilities to prevent XSS attacks
 * Use these functions to sanitize user-generated content before displaying
 */

/**
 * Sanitize HTML content for safe display
 * Removes potentially dangerous scripts while preserving safe formatting
 */
export const sanitizeHTML = (dirty: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: return as-is, will be sanitized on client
    return dirty;
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
};

/**
 * Sanitize plain text - strips all HTML tags
 */
export const sanitizePlainText = (text: string): string => {
  if (typeof window === 'undefined') {
    return text;
  }

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

/**
 * Create safe props for rendering HTML content
 * Use with dangerouslySetInnerHTML
 */
export const createSafeHTML = (dirty: string) => {
  return {
    __html: sanitizeHTML(dirty),
  };
};
