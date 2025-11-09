# File Upload Implementation for Mission Representatives

## Overview
Implemented complete file upload functionality for mission representative applications, including photo, citizenship document, and education certificate uploads.

## Backend Implementation

### 1. Dependencies Installed
```bash
npm install multer @types/multer
```

### 2. Upload Route Created
**File**: `backend/src/routes/upload.routes.ts`

**Features:**
- ✅ Multer configuration with disk storage
- ✅ Unique filename generation (timestamp + random number)
- ✅ File type validation (JPEG, PNG, GIF, PDF only)
- ✅ File size limit (5MB per file)
- ✅ Three file fields supported:
  - `photo` - Applicant photo
  - `citizenship` - Citizenship document
  - `educationCert` - Education certificate
- ✅ Returns file URLs in response

**Endpoint:**
```
POST /api/upload/mission-representative
Content-Type: multipart/form-data

Fields:
- photo (optional)
- citizenship (optional)
- educationCert (optional)

Response:
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": {
    "photoUrl": "/uploads/mission-representatives/photo-123456789.jpg",
    "citizenshipUrl": "/uploads/mission-representatives/citizenship-987654321.pdf",
    "educationCertUrl": "/uploads/mission-representatives/cert-456789123.jpg"
  }
}
```

### 3. Static File Serving
**File**: `backend/src/index.ts`

Added static file serving for uploads:
```typescript
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

Files accessible at: `http://localhost:5000/uploads/mission-representatives/filename.ext`

### 4. Directory Structure
```
backend/
├── uploads/
│   ├── .gitkeep
│   └── mission-representatives/
│       └── .gitkeep
```

### 5. Git Configuration
Updated `.gitignore` to exclude uploaded files but keep folder structure:
```
uploads/*
!uploads/.gitkeep
!uploads/mission-representatives/.gitkeep
```

## Frontend Implementation

### 1. API Client Function
**File**: `frontend/lib/api.ts`

Added `uploadMissionRepresentativeFiles()` function:
```typescript
export async function uploadMissionRepresentativeFiles(files: {
  photo?: File;
  citizenship?: File;
  educationCert?: File;
}): Promise<ApiResponse>
```

**Features:**
- Creates FormData automatically
- Sends multipart/form-data request
- Returns file URLs on success

### 2. Form Submission Updated
**File**: `frontend/app/(site)/mission-representative/page.tsx`

**Updated Flow:**
1. User fills form and selects files
2. On submit:
   - First, upload files to `/api/upload/mission-representative`
   - Get file URLs from response
   - Then submit application with file URLs to `/api/mission-representatives`
3. Show success/error messages

**Code Changes:**
```typescript
// Upload files first if any selected
let fileUrls: any = {};
if (formData.photo || formData.citizenship || formData.educationCert) {
  const uploadResponse = await uploadMissionRepresentativeFiles({
    photo: formData.photo || undefined,
    citizenship: formData.citizenship || undefined,
    educationCert: formData.educationCert || undefined,
  });

  if (uploadResponse.success && uploadResponse.data) {
    fileUrls = uploadResponse.data;
  }
}

// Include file URLs in application data
const apiData = {
  // ... other fields
  photoUrl: fileUrls.photoUrl || undefined,
  citizenshipUrl: fileUrls.citizenshipUrl || undefined,
  educationCertUrl: fileUrls.educationCertUrl || undefined,
};
```

### 3. Admin Dashboard Display
**File**: `frontend/app/(dashboard)/dashboard/mission-representatives/page.tsx`

**Added "Uploaded Documents" Section:**
- Displays in detail view below Political Interest section
- Shows uploaded photo, citizenship, and education certificate
- Features:
  - ✅ Photo preview (thumbnail with full-size link)
  - ✅ PDF indicator icon for PDF files
  - ✅ Image preview for image files
  - ✅ "View Full Size" / "Download/View" links
  - ✅ Opens files in new tab
  - ✅ Responsive grid layout (3 columns on desktop)

**Display Logic:**
```typescript
{(selectedRep.photoUrl || selectedRep.citizenshipUrl || selectedRep.educationCertUrl) && (
  <div>
    <h3>Uploaded Documents</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Photo */}
      {selectedRep.photoUrl && (
        <div>
          <img src={`${API_URL}${selectedRep.photoUrl}`} />
          <a href={`${API_URL}${selectedRep.photoUrl}`} target="_blank">
            View Full Size
          </a>
        </div>
      )}
      {/* Citizenship & Education Cert similar */}
    </div>
  </div>
)}
```

## Database Schema

The Prisma schema already includes optional file URL fields:
```prisma
model MissionRepresentative {
  // ... other fields
  photoUrl              String?
  citizenshipUrl        String?
  educationCertUrl      String?
}
```

These are optional fields, so applications without files will still work.

## Security Features

### 1. File Type Validation
Only allows specific file types:
- Images: JPEG, JPG, PNG, GIF
- Documents: PDF

### 2. File Size Limit
Maximum 5MB per file

### 3. Unique Filenames
Prevents filename conflicts using:
- Timestamp
- Random number
- Original filename (sanitized)

Example: `photo-1699517843218-987654321.jpg`

### 4. Storage Location
Files stored outside public directory:
`backend/uploads/mission-representatives/`

Only accessible through Express static file serving with proper URL.

## Testing

### Test File Upload (Form Submission)
1. Visit: http://localhost:3000/mission-representative
2. Fill out all required fields
3. Upload files:
   - Photo: Select a JPG/PNG file (< 5MB)
   - Citizenship: Select JPG/PNG/PDF file (< 5MB)
   - Education Certificate: Select JPG/PNG/PDF file (< 5MB)
4. Submit form
5. Files should upload to `backend/uploads/mission-representatives/`

### Test Admin View
1. Login: http://localhost:3000/login
2. Go to Mission Representatives page
3. Click "View Details" on submitted application
4. Scroll to "Uploaded Documents" section
5. Verify:
   - Photo displays as image thumbnail
   - Citizenship/Education cert show as image or PDF icon
   - All "View Full Size" / "Download" links work
   - Files open in new tab when clicked

### Verify File Storage
Check backend uploads folder:
```
backend/uploads/mission-representatives/
├── photo-1699517843218-987654321.jpg
├── citizenship-1699517843219-123456789.pdf
└── cert-1699517843220-456789012.jpg
```

### Test File Access
Files should be accessible at:
```
http://localhost:5000/uploads/mission-representatives/filename.ext
```

## Error Handling

### Frontend
- Shows error alert if file upload fails
- Stops submission process
- User can retry

### Backend
- Validates file types
- Enforces file size limits
- Returns proper error messages
- Logs errors to console

## File Types Supported

### Images
- `.jpg` / `.jpeg`
- `.png`
- `.gif`

### Documents
- `.pdf`

## Limitations

1. **File Size**: 5MB per file (configurable in `upload.routes.ts`)
2. **File Types**: Images and PDFs only
3. **Storage**: Local disk storage (not cloud)
4. **Concurrent Uploads**: One application at a time

## Future Enhancements (Optional)

### 1. Cloud Storage Integration
- Migrate to AWS S3 / Azure Blob Storage
- Better scalability and CDN support

### 2. Image Processing
- Resize images automatically
- Generate thumbnails
- Compress large images

### 3. Virus Scanning
- Integrate antivirus scanning for uploaded files
- Prevent malicious file uploads

### 4. Progress Indicator
- Show upload progress percentage
- Better UX for large files

### 5. Drag & Drop
- Drag and drop file upload interface
- Multiple file selection

## URLs

### Upload Endpoint
```
POST http://localhost:5000/api/upload/mission-representative
```

### File Access
```
GET http://localhost:5000/uploads/mission-representatives/{filename}
```

## Status: ✅ FULLY IMPLEMENTED

All file upload features are now working:
- ✅ Backend upload route with validation
- ✅ Static file serving configured
- ✅ Frontend upload integration
- ✅ Form submission with files
- ✅ Admin dashboard file display
- ✅ Security measures (file type, size limits)
- ✅ Error handling
- ✅ Git configuration for uploads folder

Users can now upload photos and documents with their mission representative applications, and admins can view/download them in the dashboard! 🎉
