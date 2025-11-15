import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

const router = Router();

// Ensure media uploads directory exists
const mediaDir = path.join(__dirname, '../../uploads/media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, mediaDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-') // Sanitize filename
      .substring(0, 50); // Limit length
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter for various media types
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'text/plain',
    'text/csv',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload supported file formats.'));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Helper function to determine category from MIME type
function getCategoryFromMime(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf' || 
      mimeType.includes('document') || 
      mimeType.includes('spreadsheet') || 
      mimeType.includes('presentation') ||
      mimeType.includes('text')) return 'document';
  return 'other';
}

// Helper function to get image dimensions
async function getImageDimensions(filePath: string): Promise<{ width: number; height: number } | null> {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0
    };
  } catch (error) {
    return null;
  }
}

/**
 * POST /api/media/upload
 * Upload media files
 */
router.post('/upload', authenticate, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const user = (req as any).user;

    console.log('📤 Upload request received');
    console.log('File:', file ? file.originalname : 'No file');
    console.log('User:', user ? { id: user.id, name: user.name } : 'No user');

    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
      return;
    }

    if (!user || !user.id) {
      console.error('❌ No authenticated user found');
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Get image dimensions if it's an image
    let dimensions: { width: number; height: number } | null = null;
    if (file.mimetype.startsWith('image/')) {
      try {
        dimensions = await getImageDimensions(file.path);
      } catch (dimError) {
        console.warn('⚠️  Failed to get image dimensions:', dimError);
      }
    }

    // Get metadata from request body
    const { title, altText, caption, description, folder, tags } = req.body;

    console.log('📝 Creating media record...');

    // Create media record in database
    const media = await prisma.media.create({
      data: {
        filename: file.originalname,
        storedName: file.filename,
        filepath: `/media/${file.filename}`,
        // Store API endpoint URL instead of static file path for secure access
        url: `/api/media/file/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
        width: dimensions?.width,
        height: dimensions?.height,
        title: title || file.originalname,
        altText: altText || '',
        caption: caption || '',
        description: description || '',
        category: getCategoryFromMime(file.mimetype),
        folder: folder || null,
        tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
        uploadedBy: user.id,
        uploadedByName: user.name || 'Admin',
      }
    });

    console.log('✅ Media uploaded successfully:', media.id);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: media
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/media/upload-multiple
 * Upload multiple media files
 */
router.post('/upload-multiple', authenticate, upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const user = (req as any).user;

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
      return;
    }

    const { folder, tags } = req.body;
    const parsedTags = tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [];

    const mediaItems = await Promise.all(
      files.map(async (file) => {
        let dimensions: { width: number; height: number } | null = null;
        if (file.mimetype.startsWith('image/')) {
          dimensions = await getImageDimensions(file.path);
        }

        return prisma.media.create({
          data: {
            filename: file.originalname,
            storedName: file.filename,
            filepath: `/media/${file.filename}`,
            // Store API endpoint URL instead of static file path for secure access
            url: `/api/media/file/${file.filename}`,
            mimeType: file.mimetype,
            size: file.size,
            width: dimensions?.width,
            height: dimensions?.height,
            title: file.originalname,
            altText: '',
            caption: '',
            description: '',
            category: getCategoryFromMime(file.mimetype),
            folder: folder || null,
            tags: parsedTags,
            uploadedBy: user.id,
            uploadedByName: user.name,
          }
        });
      })
    );

    res.status(201).json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      data: mediaItems
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
});

/**
 * GET /api/media
 * Get all media with filtering and pagination
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      category,
      folder,
      search,
      tags,
      page = '1',
      limit = '50',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeDeleted = 'false'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (includeDeleted !== 'true') {
      where.isDeleted = false;
    }

    if (category) {
      where.category = category;
    }

    if (folder) {
      where.folder = folder;
    }

    if (search) {
      where.OR = [
        { filename: { contains: search as string, mode: 'insensitive' } },
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { altText: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (tags) {
      const tagArray = (tags as string).split(',');
      where.tags = { hasSome: tagArray };
    }

    // Get total count
    const total = await prisma.media.count({ where });

    // Get media items
    const mediaItems = await prisma.media.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder },
      skip,
      take: limitNum,
    });

    res.status(200).json({
      success: true,
      data: {
        media: mediaItems,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media'
    });
  }
});

/**
 * GET /api/media/stats
 * Get media statistics
 */
router.get('/stats', authenticate, async (_req: Request, res: Response) => {
  try {
    const [
      totalMedia,
      totalImages,
      totalDocuments,
      totalSize,
      deletedCount
    ] = await Promise.all([
      prisma.media.count({ where: { isDeleted: false } }),
      prisma.media.count({ where: { category: 'image', isDeleted: false } }),
      prisma.media.count({ where: { category: 'document', isDeleted: false } }),
      prisma.media.aggregate({
        where: { isDeleted: false },
        _sum: { size: true }
      }),
      prisma.media.count({ where: { isDeleted: true } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMedia,
        totalImages,
        totalDocuments,
        totalSize: totalSize._sum.size || 0,
        deletedCount
      }
    });
  } catch (error) {
    console.error('Error fetching media stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media statistics'
    });
  }
});

/**
 * GET /api/media/:id
 * Get single media item
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      res.status(404).json({
        success: false,
        message: 'Media not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media'
    });
  }
});

/**
 * PATCH /api/media/:id
 * Update media metadata
 */
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, altText, caption, description, folder, tags } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (altText !== undefined) updateData.altText = altText;
    if (caption !== undefined) updateData.caption = caption;
    if (description !== undefined) updateData.description = description;
    if (folder !== undefined) updateData.folder = folder;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];

    const media = await prisma.media.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      message: 'Media updated successfully',
      data: media
    });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update media'
    });
  }
});

/**
 * DELETE /api/media/:id
 * Soft delete media (move to trash)
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const { permanent } = req.query;

    if (permanent === 'true') {
      // Permanent delete - remove file and database record
      const media = await prisma.media.findUnique({ where: { id } });
      
      if (!media) {
        res.status(404).json({
          success: false,
          message: 'Media not found'
        });
        return;
      }

      // Delete file from disk
      const filePath = path.join(mediaDir, media.storedName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await prisma.media.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Media permanently deleted'
      });
    } else {
      // Soft delete - move to trash
      const media = await prisma.media.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: user.id
        }
      });

      res.status(200).json({
        success: true,
        message: 'Media moved to trash',
        data: media
      });
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media'
    });
  }
});

/**
 * POST /api/media/:id/restore
 * Restore media from trash
 */
router.post('/:id/restore', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const media = await prisma.media.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Media restored successfully',
      data: media
    });
  } catch (error) {
    console.error('Error restoring media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore media'
    });
  }
});

/**
 * POST /api/media/bulk-delete
 * Bulk soft delete media
 */
router.post('/bulk-delete', authenticate, async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    const user = (req as any).user;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid media IDs'
      });
      return;
    }

    await prisma.media.updateMany({
      where: { id: { in: ids } },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.id
      }
    });

    res.status(200).json({
      success: true,
      message: `${ids.length} media items moved to trash`
    });
  } catch (error) {
    console.error('Error bulk deleting media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media items'
    });
  }
});

/**
 * GET /api/media/file/:filename
 * Serve media file with CORS headers (public access, no auth required)
 */

// Handle preflight OPTIONS request
router.options('/file/:filename', (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.status(204).send();
});

router.get('/file/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    console.log('📥 Media file request:', filename);

    // Validate filename to prevent directory traversal attacks
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      console.log('❌ Invalid filename detected:', filename);
      res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
      return;
    }

    // Check if media exists in database
    const media = await prisma.media.findFirst({
      where: { storedName: filename }
    });

    if (!media) {
      console.log('❌ Media not found in database:', filename);
      res.status(404).json({
        success: false,
        message: 'Media not found'
      });
      return;
    }

    console.log('✅ Media found in DB:', media.filename);

    // Construct file path
    const filePath = path.join(__dirname, '../../uploads/media', filename);
    console.log('📂 File path:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found on disk:', filePath);
      res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
      return;
    }

    console.log('✅ Sending file:', media.mimeType);

    // Set CORS headers explicitly for image responses
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Set appropriate content headers
    res.setHeader('Content-Type', media.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${media.filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('❌ Error serving media file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve file'
    });
  }
});

export default router;
