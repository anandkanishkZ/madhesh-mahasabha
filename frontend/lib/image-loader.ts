/**
 * Image Loader for Next.js Image Component
 * 
 * This loader will be used when migrating from AuthenticatedImage to Next.js Image component.
 * It handles authenticated image requests and constructs proper URLs.
 * 
 * To use this loader:
 * 1. Add to next.config.mjs:
 *    ```js
 *    images: {
 *      loader: 'custom',
 *      loaderFile: './lib/image-loader.ts'
 *    }
 *    ```
 * 
 * 2. Replace AuthenticatedImage with Next.js Image:
 *    ```tsx
 *    <Image
 *      src="/api/media/file/filename.jpg"
 *      alt="Description"
 *      width={800}
 *      height={600}
 *    />
 *    ```
 */

import { getApiUrl } from './config';

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Custom image loader for Next.js Image component
 * Handles authenticated media URLs
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // If src is already a full URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Get API base URL
  const apiUrl = getApiUrl();

  // Construct full URL for API endpoint
  // Note: This returns the URL but doesn't add auth token
  // Authentication must be handled separately via fetch interceptor or proxy
  const fullUrl = src.startsWith('/') ? `${apiUrl}${src}` : `${apiUrl}/${src}`;

  // TODO: In future, add image optimization parameters
  // Example: `${fullUrl}?w=${width}&q=${quality || 75}`
  // This would require backend to support image transformation

  return fullUrl;
}

/**
 * Helper to determine if a URL needs authentication
 */
export function requiresAuth(url: string): boolean {
  // Media files from our API require authentication
  return url.includes('/api/media/file/');
}

/**
 * Future: Custom fetch for authenticated images
 * This would be used with Next.js Image component to add auth headers
 */
export async function fetchAuthenticatedImage(url: string, token: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * Notes for implementation:
 * 
 * CHALLENGES:
 * 1. Next.js Image component doesn't support custom headers by default
 * 2. Need to use middleware or proxy to add auth headers
 * 
 * SOLUTIONS:
 * 
 * Option A: Next.js Middleware Proxy
 * Create middleware to proxy image requests with auth:
 * ```ts
 * // middleware.ts
 * export function middleware(request: NextRequest) {
 *   if (request.nextUrl.pathname.startsWith('/api/media/file/')) {
 *     const token = request.cookies.get('auth_token');
 *     // Proxy to backend with Authorization header
 *   }
 * }
 * ```
 * 
 * Option B: Server Component + Base64
 * Fetch in Server Component, convert to base64:
 * ```tsx
 * // server component
 * const imageData = await fetchImageWithAuth(url);
 * const base64 = Buffer.from(imageData).toString('base64');
 * return <Image src={`data:image/jpeg;base64,${base64}`} />;
 * ```
 * 
 * Option C: Continue with AuthenticatedImage
 * Keep current implementation which works well for authenticated images
 * 
 * RECOMMENDATION: Option C for now (AuthenticatedImage)
 * - Already implemented and working
 * - Handles authentication properly
 * - Can add optimization layer later
 */
