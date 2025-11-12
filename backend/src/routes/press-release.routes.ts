import { Router, Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { sanitizeObject } from '../lib/sanitize';

const router = Router();

// Validation schemas
const createPressReleaseSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  titleNp: z.string().min(1),
  content: z.string().min(1),
  contentNp: z.string().min(1),
  excerpt: z.string().optional().or(z.literal('')),
  excerptNp: z.string().optional().or(z.literal('')),
  category: z.enum(['announcement', 'statement', 'event', 'achievement']),
  tags: z.array(z.string()).default([]),
  priority: z.enum(['urgent', 'high', 'normal', 'low']).default('normal'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  attachments: z.array(z.string().url()).default([]),
  author: z.string().min(1),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
});

const updatePressReleaseSchema = createPressReleaseSchema.partial();

// Get categories (public) - MUST be before /:slug route
router.get('/meta/categories', async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      categories: [
        { value: 'announcement', label: 'Announcement', labelNp: 'घोषणा' },
        { value: 'statement', label: 'Statement', labelNp: 'वक्तव्य' },
        { value: 'event', label: 'Event', labelNp: 'कार्यक्रम' },
        { value: 'achievement', label: 'Achievement', labelNp: 'उपलब्धि' },
      ],
      priorities: [
        { value: 'urgent', label: 'Urgent', labelNp: 'अति जरुरी' },
        { value: 'high', label: 'High', labelNp: 'उच्च' },
        { value: 'normal', label: 'Normal', labelNp: 'सामान्य' },
        { value: 'low', label: 'Low', labelNp: 'कम' },
      ],
    },
  });
});

// Get all press releases (public - only published ones)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      priority, 
      limit = '10', 
      offset = '0',
      includeUnpublished = 'false' 
    } = req.query;

    // Check if user is authenticated for unpublished content
    const isAuthenticated = req.headers.authorization;
    const showUnpublished = includeUnpublished === 'true' && isAuthenticated;

    const where: any = {
      isDeleted: false,
    };

    if (!showUnpublished) {
      where.isPublished = true;
    }

    if (category) {
      where.category = category;
    }

    if (priority) {
      where.priority = priority;
    }

    const [pressReleases, total] = await Promise.all([
      prisma.pressRelease.findMany({
        where,
        orderBy: [
          { priority: 'asc' }, // Urgent first
          { publishedAt: 'desc' }
        ],
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        select: {
          id: true,
          slug: true,
          title: true,
          titleNp: true,
          excerpt: true,
          excerptNp: true,
          category: true,
          tags: true,
          priority: true,
          imageUrl: true,
          author: true,
          publishedAt: true,
          updatedAt: true,
          isPublished: true,
          viewCount: true,
        },
      }),
      prisma.pressRelease.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        pressReleases,
        pagination: {
          total,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching press releases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch press releases',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get single press release by slug or ID (public - slug, admin - ID or slug)
router.get('/:slugOrId', async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;
    const isAuthenticated = req.headers.authorization;

    // Check if it's an ID (cuid format - starts with 'c' and longer) or a slug
    const isId = slugOrId.startsWith('c') && slugOrId.length > 20;

    const where: any = {
      [isId ? 'id' : 'slug']: slugOrId,
      isDeleted: false,
    };

    // Only show published content for non-authenticated users
    if (!isAuthenticated) {
      where.isPublished = true;
    }

    const pressRelease = await prisma.pressRelease.findFirst({
      where,
    });

    if (!pressRelease) {
      return res.status(404).json({
        success: false,
        message: 'Press release not found',
      });
    }

    // Increment view count (only for published releases viewed by public)
    if (pressRelease.isPublished && !isAuthenticated) {
      await prisma.pressRelease.update({
        where: { id: pressRelease.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    res.status(200).json({
      success: true,
      data: pressRelease,
    });
  } catch (error) {
    console.error('Error fetching press release:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch press release',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create new press release (admin only)
router.post('/', authenticate, requireRole(['admin', 'super_admin']), async (req: Request, res: Response) => {
  try {
    const validatedData = createPressReleaseSchema.parse(req.body);

    // Sanitize all input data to prevent XSS attacks
    const sanitizedData = sanitizeObject(validatedData, {
      htmlFields: ['content', 'contentNp', 'excerpt', 'excerptNp'],
      plainTextFields: ['title', 'titleNp', 'author'],
      slugFields: ['slug'],
      urlFields: ['imageUrl'],
      emailFields: ['contactEmail'],
      phoneFields: ['contactPhone'],
      arrayFields: ['tags', 'attachments'],
    });

    // Check if slug already exists
    const existing = await prisma.pressRelease.findUnique({
      where: { slug: sanitizedData.slug },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A press release with this slug already exists',
      });
    }

    // Clean up empty strings to undefined for optional fields
    const cleanData = {
      ...sanitizedData,
      excerpt: sanitizedData.excerpt || undefined,
      excerptNp: sanitizedData.excerptNp || undefined,
      imageUrl: sanitizedData.imageUrl || undefined,
      contactEmail: sanitizedData.contactEmail || undefined,
      contactPhone: sanitizedData.contactPhone || undefined,
    };

    const pressRelease = await prisma.pressRelease.create({
      data: cleanData,
    });

    res.status(201).json({
      success: true,
      message: 'Press release created successfully',
      data: pressRelease,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error creating press release:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create press release',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update press release (admin only)
router.put('/:id', authenticate, requireRole(['admin', 'super_admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updatePressReleaseSchema.parse(req.body);

    // Sanitize all input data to prevent XSS attacks
    const sanitizedData = sanitizeObject(validatedData, {
      htmlFields: ['content', 'contentNp', 'excerpt', 'excerptNp'],
      plainTextFields: ['title', 'titleNp', 'author'],
      slugFields: ['slug'],
      urlFields: ['imageUrl'],
      emailFields: ['contactEmail'],
      phoneFields: ['contactPhone'],
      arrayFields: ['tags', 'attachments'],
    });

    // Check if press release exists
    const existing = await prisma.pressRelease.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Press release not found',
      });
    }

    // If slug is being updated, check for uniqueness
    if (sanitizedData.slug && sanitizedData.slug !== existing.slug) {
      const slugExists = await prisma.pressRelease.findUnique({
        where: { slug: sanitizedData.slug },
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'A press release with this slug already exists',
        });
      }
    }

    const pressRelease = await prisma.pressRelease.update({
      where: { id },
      data: sanitizedData,
    });

    res.status(200).json({
      success: true,
      message: 'Press release updated successfully',
      data: pressRelease,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error updating press release:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update press release',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Soft delete press release (admin only)
router.delete('/:id', authenticate, requireRole(['admin', 'super_admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).admin?.id;

    const pressRelease = await prisma.pressRelease.findFirst({
      where: { id, isDeleted: false },
    });

    if (!pressRelease) {
      return res.status(404).json({
        success: false,
        message: 'Press release not found',
      });
    }

    await prisma.pressRelease.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: adminId,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Press release deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting press release:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete press release',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
