# Quick Reference: Image Loading Updates

## 🎯 What Changed

### Before
```tsx
// ❌ Multiple different approaches
<img src={imageUrl} />  // No auth
<SafeImage src={url} /> // Cookie auth
<AuthenticatedImage filePath={path} /> // JWT auth
```

### After
```tsx
// ✅ Single consistent approach
<AuthenticatedImage filePath="/api/media/file/image.jpg" alt="..." className="..." />
```

## 🔧 For Developers

### Getting API URL in Components
```tsx
import { getApiBaseUrl } from '@/lib/api';

const apiUrl = getApiBaseUrl();
```

### Getting API URL in Utilities
```tsx
import { config } from '@/lib/config';

const apiUrl = config.api.baseUrl;
```

### Media File Paths
```tsx
// Store relative paths in database
const mediaUrl = `/api/media/file/${filename}`;

// AuthenticatedImage handles full URL construction
<AuthenticatedImage filePath={mediaUrl} alt="..." />
```

## 📝 Environment Variables

### Frontend (.env.local)
```bash
# Required for production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Optional (has fallback in dev)
NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com
```

### Backend (.env)
```bash
# Required
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key

# No longer needed
# BACKEND_URL - removed ✅
```

## 🚀 Migration Checklist

If updating existing project:

1. **Update Environment Variables**
   - [ ] Set `NEXT_PUBLIC_API_URL` in frontend
   - [ ] Remove `BACKEND_URL` from backend (if exists)

2. **Update Database (if needed)**
   ```sql
   -- Convert full URLs to relative paths
   UPDATE media 
   SET url = '/api/media/file/' || "storedName"
   WHERE url LIKE '%/uploads/media/%';
   ```

3. **Update Code**
   - [ ] Replace all `<img>` tags with `<AuthenticatedImage>`
   - [ ] Remove `SafeImage` component (if exists)
   - [ ] Use `getApiBaseUrl()` instead of hardcoded URLs

4. **Test**
   - [ ] Dashboard media page
   - [ ] Press releases (list and detail)
   - [ ] Image uploads
   - [ ] No CORS errors in console

## 🐛 Troubleshooting

### Images not loading?
```tsx
// Check 1: Is AuthenticatedImage imported?
import AuthenticatedImage from '@/components/AuthenticatedImage';

// Check 2: Is path correct? (should be relative)
filePath="/api/media/file/filename.jpg"  // ✅ Correct
filePath="http://localhost:5000/..."      // ❌ Wrong

// Check 3: Is user authenticated?
// AuthenticatedImage requires JWT token in localStorage
```

### Environment variable not working?
```bash
# Frontend env vars MUST start with NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=...  # ✅ Correct
API_URL=...              # ❌ Won't work in browser

# Restart dev server after changing .env files
npm run dev
```

### CORS errors?
```typescript
// Backend must have CORS configured for your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## 📚 Related Files

- `frontend/lib/api.ts` - API utilities and base URL
- `frontend/lib/config.ts` - Centralized configuration
- `frontend/lib/image-loader.ts` - Future Next.js Image support
- `frontend/components/AuthenticatedImage.tsx` - Image component
- `backend/src/routes/media.routes.ts` - Media API endpoints
- `IMAGE_LOADING_FIXES.md` - Detailed documentation

## 🎨 Component Usage Examples

### Basic Usage
```tsx
<AuthenticatedImage
  filePath="/api/media/file/photo.jpg"
  alt="Description"
  className="w-full h-full object-cover"
/>
```

### With Loading State
```tsx
<AuthenticatedImage
  filePath={imageUrl}
  alt="Press Release"
  className="rounded-lg"
  fallbackText="Loading image..."
/>
```

### In Grid Layout
```tsx
<div className="grid grid-cols-3 gap-4">
  {images.map(img => (
    <AuthenticatedImage
      key={img.id}
      filePath={`/api/media/file/${img.storedName}`}
      alt={img.filename}
      className="aspect-square object-cover"
    />
  ))}
</div>
```

## 🔐 Security Notes

✅ **What's Secure:**
- JWT authentication on all images
- No public access to media files
- Proper token validation

⚠️ **Known Limitation:**
- Public press releases still require auth
- See main issue tracker for CDN solution

## 💡 Pro Tips

1. **Always use relative paths** in database
   ```typescript
   // Good
   url: '/api/media/file/photo.jpg'
   
   // Bad  
   url: 'http://localhost:5000/api/media/file/photo.jpg'
   ```

2. **Use helper function** for consistency
   ```typescript
   const getMediaPath = (filename: string) => `/api/media/file/${filename}`;
   ```

3. **Check environment** in components
   ```typescript
   import { config } from '@/lib/config';
   
   if (config.env.isDevelopment) {
     console.log('Dev mode - using localhost');
   }
   ```

---

**Last Updated:** November 15, 2025
**Status:** Production Ready ✅
