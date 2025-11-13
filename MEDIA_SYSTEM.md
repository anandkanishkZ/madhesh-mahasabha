# Media Management System Documentation

## Overview

A complete WordPress-style media management system for the Madhesh Mahasabha admin dashboard. This system provides comprehensive file upload, organization, and management capabilities.

## Features

### ✅ Core Features
- **File Upload**: Single and multiple file upload with drag-and-drop support
- **Media Library**: Grid and list view modes for browsing media
- **Search & Filter**: Advanced search and category filtering
- **Metadata Management**: Edit titles, alt text, captions, descriptions, and tags
- **Soft Delete**: Trash system with restore capabilities
- **Bulk Operations**: Select and delete multiple files at once
- **Image Processing**: Automatic dimension detection for images
- **File Preview**: View images and file details
- **Statistics Dashboard**: Track total files, storage usage, and categories

### ✅ Media Picker Component
- Reusable modal component for selecting media
- Single and multiple selection modes
- Category filtering (images, documents, videos, audio)
- Upload directly from picker
- Search and filter capabilities
- Grid and list view modes

### ✅ Security Features
- Authentication required for all operations
- File type validation
- File size limits (10MB per file)
- Sanitized filenames
- Secure file storage

## Technical Stack

### Backend
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: Multer
- **Image Processing**: Sharp (for dimensions and metadata)
- **Authentication**: JWT-based authentication

### Frontend
- **Framework**: Next.js 14 + TypeScript
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Hooks
- **Notifications**: Sonner Toast

## Database Schema

```prisma
model Media {
  id              String   @id @default(cuid())
  
  // File Information
  filename        String
  storedName      String   @unique
  filepath        String
  url             String
  mimeType        String
  size            Int
  
  // Image-specific metadata
  width           Int?
  height          Int?
  
  // Media Metadata
  title           String?
  altText         String?
  caption         String?
  description     String?
  
  // Categorization
  category        String   @default("uncategorized")
  folder          String?
  tags            String[]
  
  // Tracking
  usageCount      Int      @default(0)
  uploadedBy      String
  uploadedByName  String?
  
  // Soft Delete
  isDeleted       Boolean  @default(false)
  deletedAt       DateTime?
  deletedBy       String?
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## API Endpoints

### Upload Media
- **POST** `/api/media/upload` - Upload single file
- **POST** `/api/media/upload-multiple` - Upload multiple files

### Retrieve Media
- **GET** `/api/media` - Get all media with filtering and pagination
- **GET** `/api/media/stats` - Get media statistics
- **GET** `/api/media/:id` - Get single media item

### Update Media
- **PATCH** `/api/media/:id` - Update media metadata

### Delete Media
- **DELETE** `/api/media/:id` - Soft delete (move to trash)
- **DELETE** `/api/media/:id?permanent=true` - Permanent delete
- **POST** `/api/media/bulk-delete` - Bulk soft delete

### Restore Media
- **POST** `/api/media/:id/restore` - Restore from trash

## Usage Examples

### Using MediaPicker Component

```tsx
import { MediaPicker } from '@/components/MediaPicker';
import { Media } from '@/lib/api';

function MyComponent() {
  const [showPicker, setShowPicker] = useState(false);
  
  const handleMediaSelect = (media: Media | Media[]) => {
    console.log('Selected media:', media);
    // Use the selected media
  };
  
  return (
    <>
      <Button onClick={() => setShowPicker(true)}>
        Select Image
      </Button>
      
      <MediaPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleMediaSelect}
        multiple={false}
        allowedTypes={['image']}
        title="Select Featured Image"
        description="Choose an image from your library"
      />
    </>
  );
}
```

### Upload Media Programmatically

```tsx
import { uploadMedia } from '@/lib/api';

const handleUpload = async (file: File) => {
  const response = await uploadMedia(file, {
    title: 'My Image',
    altText: 'Description for accessibility',
    tags: ['featured', 'homepage']
  });
  
  if (response.success) {
    console.log('Uploaded:', response.data);
  }
};
```

### Fetch Media with Filters

```tsx
import { getMedia } from '@/lib/api';

const fetchImages = async () => {
  const response = await getMedia({
    category: 'image',
    search: 'banner',
    tags: 'featured,homepage',
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  if (response.success) {
    const images = response.data.media;
    console.log('Images:', images);
  }
};
```

## File Support

### Supported File Types

**Images:**
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

**Documents:**
- PDF
- DOC/DOCX (Word)
- XLS/XLSX (Excel)
- PPT/PPTX (PowerPoint)
- TXT
- CSV

### File Size Limits
- Single file: 10MB maximum
- Multiple files: 10MB per file

## Directory Structure

```
backend/
├── src/
│   └── routes/
│       └── media.routes.ts          # Media API endpoints
├── uploads/
│   └── media/                       # Media file storage
└── prisma/
    └── schema.prisma                # Database schema

frontend/
├── app/
│   └── (dashboard)/
│       └── dashboard/
│           └── media/
│               └── page.tsx         # Media library page
├── components/
│   └── MediaPicker.tsx              # Reusable media picker
└── lib/
    ├── api.ts                       # Media API functions
    └── utils.ts                     # Helper utilities
```

## Features Comparison with WordPress

| Feature | WordPress | Our System | Status |
|---------|-----------|------------|--------|
| File Upload | ✅ | ✅ | Complete |
| Drag & Drop | ✅ | ✅ | Complete |
| Grid/List View | ✅ | ✅ | Complete |
| Search & Filter | ✅ | ✅ | Complete |
| Bulk Actions | ✅ | ✅ | Complete |
| Metadata Editing | ✅ | ✅ | Complete |
| Media Picker | ✅ | ✅ | Complete |
| Image Dimensions | ✅ | ✅ | Complete |
| Trash/Restore | ✅ | ✅ | Complete |
| Folders | ✅ | ✅ | Planned |
| Image Editing | ✅ | ⏳ | Future |
| Video Processing | ✅ | ⏳ | Future |

## Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **File Validation**: MIME type and extension validation
3. **Size Limits**: Enforced 10MB per file limit
4. **Filename Sanitization**: Special characters removed, unique names generated
5. **Soft Delete**: Files moved to trash before permanent deletion
6. **Access Control**: Only authenticated admins can manage media

## Performance Optimizations

1. **Lazy Loading**: Images loaded on demand
2. **Pagination**: Large media libraries paginated
3. **Indexed Queries**: Database indexes on frequently queried fields
4. **Efficient Uploads**: Streamed file uploads with Multer
5. **Image Optimization**: Sharp for fast image processing

## Future Enhancements

- [ ] Image cropping and editing
- [ ] Folder/album organization
- [ ] Advanced search with AI
- [ ] CDN integration
- [ ] Video thumbnail generation
- [ ] Audio waveform visualization
- [ ] Bulk metadata editing
- [ ] Export/import media library
- [ ] Usage tracking per media
- [ ] Media replacement functionality

## Troubleshooting

### Upload Fails
- Check file size (max 10MB)
- Verify file type is supported
- Ensure uploads/media directory has write permissions

### Images Not Displaying
- Verify backend URL in environment variables
- Check static file serving is configured
- Ensure CORS is properly set up

### Sharp Module Errors
- Reinstall sharp: `npm install sharp`
- May need platform-specific build

## Support

For issues or questions, please refer to the main project README or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: November 13, 2025  
**Author**: Madhesh Mahasabha Development Team
