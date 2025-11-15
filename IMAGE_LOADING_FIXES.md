# Image Loading and Configuration Fixes

## Issues Fixed

### ✅ Issue #5: Duplicate Image Loading Mechanisms
**Status:** RESOLVED

**Problem:**
- Three different image loading approaches causing inconsistency:
  1. `AuthenticatedImage` component (correct)
  2. `SafeImage` component (duplicate, using cookies instead of JWT)
  3. Raw `<img>` tags (no authentication)

**Solution:**
- **Removed** `SafeImage` component entirely (97 lines removed from `media/page.tsx`)
- **Replaced all raw `<img>` tags** with `AuthenticatedImage` component
- **Standardized** on single authentication mechanism using JWT Bearer tokens

**Files Changed:**
- `frontend/app/(dashboard)/dashboard/media/page.tsx` - Removed SafeImage, uses AuthenticatedImage
- `frontend/app/(site)/press-releases/page.tsx` - Added AuthenticatedImage for featured images
- `frontend/app/(site)/press-releases/[slug]/page.tsx` - Added AuthenticatedImage for detail page
- `frontend/app/(dashboard)/dashboard/press-releases/create/page.tsx` - Added AuthenticatedImage for preview
- `frontend/app/(dashboard)/dashboard/press-releases/edit/[id]/page.tsx` - Added AuthenticatedImage for preview

**Benefits:**
- ✅ Consistent image loading behavior across entire app
- ✅ Single authentication method (JWT in Authorization header)
- ✅ Reduced code duplication
- ✅ Easier debugging and maintenance
- ✅ Proper memory management with object URL cleanup

---

### ✅ Issue #7: Environment Variable Inconsistency
**Status:** RESOLVED

**Problem:**
- Multiple hardcoded `API_BASE_URL` constants throughout codebase
- Different environment variable names (`NEXT_PUBLIC_API_URL` vs `BACKEND_URL`)
- Hardcoded localhost fallbacks in multiple files creating production risks

**Solution:**
1. **Created centralized configuration utility** (`frontend/lib/config.ts`)
   - Single `getApiUrl()` function
   - Proper development/production fallbacks
   - Warning logs if production env vars not set

2. **Updated `frontend/lib/api.ts`:**
   - Exported `API_BASE_URL` constant
   - Exported `getApiBaseUrl()` function for component use
   - Removed duplicate `API_URL` constants
   - All API calls now use centralized constant

3. **Updated `frontend/app/(dashboard)/dashboard/media/page.tsx`:**
   - Replaced local `API_BASE_URL` constant with `getApiBaseUrl()` import
   - Consistent URL construction

4. **Updated `backend/src/routes/media.routes.ts`:**
   - Changed from storing full URLs to relative paths: `/api/media/file/{filename}`
   - Removed dependency on `BACKEND_URL` environment variable
   - Frontend constructs full URLs dynamically

**Files Changed:**
- ✅ `frontend/lib/config.ts` (NEW) - Centralized configuration
- ✅ `frontend/lib/api.ts` - Exported utilities, removed duplicates
- ✅ `frontend/app/(dashboard)/dashboard/media/page.tsx` - Uses centralized config
- ✅ `backend/src/routes/media.routes.ts` - Stores relative paths only

**Benefits:**
- ✅ Single source of truth for API URLs
- ✅ Better production deployment support
- ✅ Proper environment-aware configuration
- ✅ Warning logs for missing production variables
- ✅ Easier to change backend URL without database updates

---

### ✅ Issue #8: Missing Image Optimization
**Status:** PREPARED FOR IMPLEMENTATION

**Problem:**
- All images using raw `<img>` tags
- No lazy loading
- No responsive image support
- No automatic optimization
- Poor performance and high bandwidth usage

**Partial Solution:**
- **Replaced all `<img>` tags** with `AuthenticatedImage` component
- **Added TODO comments** for future Next.js `<Image>` component integration
- **Prepared infrastructure** for image optimization

**Next Steps (Future Work):**
```tsx
// TODO: Replace AuthenticatedImage with Next.js Image after:
// 1. Configure image domains in next.config.mjs
// 2. Create custom loader for authenticated images
// 3. Update AuthenticatedImage to support Next.js Image internally

// Example configuration needed:
// next.config.mjs:
// images: {
//   domains: [process.env.NEXT_PUBLIC_API_URL],
//   loader: 'custom',
//   loaderFile: './lib/image-loader.ts'
// }
```

**Files Prepared:**
- All image rendering now uses `AuthenticatedImage`
- TODO comments added for Next.js Image integration
- Centralized image path handling via `getMediaFilePath()` helper

**Benefits:**
- ✅ Consistent image component usage
- ✅ Ready for Next.js Image optimization
- ✅ Better structure for future improvements
- 📝 Clear migration path documented

---

## Additional Improvements

### New Helper Functions
```typescript
// In media/page.tsx
const getMediaFilePath = (file: MediaFile): string => {
  const filename = file.storedName || file.filename;
  return `/api/media/file/${filename}`;
};
```

### Centralized Configuration Module
```typescript
// lib/config.ts
export const config = {
  api: { baseUrl: getApiUrl() },
  frontend: { baseUrl: getFrontendUrl() },
  env: { isDevelopment, isProduction }
};
```

---

## Migration Guide

### For Developers:

**Environment Variables Required:**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000  # Development
NEXT_PUBLIC_API_URL=https://api.yourdomain.com  # Production

# Backend (.env)
FRONTEND_URL=http://localhost:3000  # Development
FRONTEND_URL=https://yourdomain.com  # Production
```

**No More BACKEND_URL:**
- Backend no longer stores full URLs in database
- Uses relative paths: `/api/media/file/filename.jpg`
- Frontend constructs full URLs dynamically

### For Existing Databases:

**Option 1: Update Existing URLs (Recommended)**
```sql
-- Update all media URLs to use new format
UPDATE media 
SET url = '/api/media/file/' || "storedName"
WHERE url LIKE '%/uploads/media/%';
```

**Option 2: Frontend Handles Both Formats**
The `getValidImageUrl()` function already handles:
- Legacy format: `http://localhost:5000/uploads/media/file.jpg`
- New format: `/api/media/file/file.jpg`
- Full URLs: `https://cdn.example.com/file.jpg`

---

## Testing Checklist

- [x] Dashboard media page loads images correctly
- [x] Press release list page displays images
- [x] Press release detail page displays images
- [x] Press release create form previews selected images
- [x] Press release edit form previews existing images
- [x] All images use JWT authentication
- [x] No CORS errors in console
- [x] Proper loading states displayed
- [x] Error states handled gracefully
- [x] Object URLs properly cleaned up (no memory leaks)

---

## Performance Impact

**Before:**
- 3 different image loading mechanisms
- Duplicate fetch logic
- Inconsistent caching
- Memory leaks (some components didn't cleanup object URLs)

**After:**
- Single `AuthenticatedImage` component
- Consistent fetch with auth
- Proper object URL cleanup
- Ready for Next.js Image optimization

**Code Reduction:**
- Removed ~97 lines (SafeImage component)
- Removed ~15 lines (duplicate API_BASE_URL constants)
- Added ~70 lines (config.ts utility)
- Net: -42 lines, +better architecture

---

## Known Limitations

1. **Next.js Image not yet implemented** - Requires additional configuration
2. **Public press releases** - Still require authentication (See Issue #3 for solution)
3. **Image caching** - Browser cache only, no CDN yet

---

## Recommendations

1. **Implement Next.js Image:**
   - Create custom loader for authenticated images
   - Configure image domains
   - Enable automatic optimization

2. **Add CDN support:**
   - For published content (press releases)
   - Separate public/private media buckets
   - Signed URLs with expiration

3. **Add image preprocessing:**
   - Generate thumbnails on upload
   - Create multiple sizes (responsive images)
   - WebP conversion for better compression

---

**Date:** November 15, 2025
**Author:** Development Team
**Status:** Completed ✅
