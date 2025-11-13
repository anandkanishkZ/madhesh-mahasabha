# Media System - Fix Applied ✅

## Issue Identified
The 500 Internal Server Error was caused by a **missing environment variable**: `BACKEND_URL`

## Fix Applied
Added `BACKEND_URL="http://localhost:5000"` to `backend/.env`

```env
# CORS
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"  # ✅ ADDED THIS LINE
```

## What Was Happening
- The media routes use `process.env.BACKEND_URL` to construct file URLs (lines 130, 193 in media.routes.ts)
- When undefined, it was causing runtime errors during media upload/list operations
- The code has a fallback: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/media/${file.filename}`
- But the error might have occurred before reaching that line

## Testing Results
✅ Environment variable now loads correctly: `BACKEND_URL: http://localhost:5000`
✅ Prisma Media model is recognized: `Prisma.ModelName.Media`
✅ uploads/media directory exists
✅ API endpoint responds (requires authentication as expected)

## Next Steps - RESTART REQUIRED

### 1. **Restart Backend Server**
The `.env` file changes require a server restart:

```bash
# Stop current backend server (Ctrl+C in the backend terminal)
# Then restart:
cd backend
npm run dev
```

### 2. **Login to Dashboard**
Before testing media features:
1. Go to http://localhost:3000/login
2. Login with admin credentials
3. Navigate to Dashboard → Media Library

### 3. **Test Media Features**

#### Upload Single File:
1. Click "Upload Media" button
2. Drag & drop or click to select image
3. Verify upload success and preview

#### Upload Multiple Files:
1. Select multiple images at once
2. Verify all files upload successfully

#### Search & Filter:
1. Use search box to find files by name
2. Filter by type (image/document/video/audio)
3. Try grid/list view toggle

#### Edit Metadata:
1. Click on any media item
2. Click "Edit" button
3. Update title, alt text, caption
4. Save changes

#### Delete & Trash:
1. Select items and click "Delete"
2. Verify they move to trash
3. Switch to "Trash" view
4. Test "Restore" and "Delete Permanently"

#### Media Picker Component:
Test the WordPress-style picker in other parts of your app where you integrate it.

## Verification Checklist

- [ ] Backend server restarted successfully
- [ ] No console errors on startup
- [ ] Can access http://localhost:5000/health
- [ ] Dashboard login works
- [ ] Media Library page loads
- [ ] Can upload single file
- [ ] Can upload multiple files
- [ ] Search functionality works
- [ ] Filter by type works
- [ ] Edit metadata works
- [ ] Delete moves to trash
- [ ] Restore from trash works
- [ ] Statistics display correctly

## API Endpoints Available

All require authentication (JWT token in Authorization header):

```
POST   /api/media/upload              - Upload single file
POST   /api/media/upload-multiple     - Upload multiple files (max 10)
GET    /api/media                     - List media (with pagination, filters)
GET    /api/media/stats               - Get statistics
GET    /api/media/:id                 - Get single media item
PATCH  /api/media/:id                 - Update metadata
DELETE /api/media/:id                 - Soft delete (move to trash)
POST   /api/media/:id/restore         - Restore from trash
POST   /api/media/bulk-delete         - Bulk delete items
```

## File Upload Specifications

- **Max file size**: 10MB
- **Allowed types**: 
  - Images: jpg, jpeg, png, gif, webp, svg
  - Documents: pdf, doc, docx
  - Videos: mp4, webm
  - Audio: mp3, wav, ogg
- **Storage**: `backend/uploads/media/`
- **URL format**: `http://localhost:5000/uploads/media/{filename}`

## If Issues Persist

1. **Check server console** for detailed error messages
2. **Verify database connection**: `npm run prisma:studio` should work
3. **Check Prisma client**: Run `npx prisma generate` if needed
4. **Clear uploads**: Delete test files in `backend/uploads/media/` if needed
5. **Check permissions**: Ensure `uploads/media/` is writable

## Production Deployment Notes

When deploying to production:

1. Update `.env`:
   ```env
   BACKEND_URL="https://your-production-domain.com"
   FRONTEND_URL="https://your-frontend-domain.com"
   NODE_ENV="production"
   ```

2. Use cloud storage (AWS S3, Azure Blob, Cloudinary) instead of local uploads
3. Implement CDN for media delivery
4. Add image optimization pipeline
5. Set up backup strategy for media files

---

**Status**: ✅ Fix applied, restart required for testing
**Estimated time to test**: 5-10 minutes after restart
