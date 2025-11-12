import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

const router = Router();

// Validation schema for mission representative application
const missionRepresentativeSchema = z.object({
  fullName: z.string().min(2).max(100),
  dateOfBirth: z.string(),
  gender: z.string(),
  contactNumber: z.string().min(10).max(15),
  email: z.string().email(),
  province: z.string(),
  district: z.string(),
  constituency: z.string(),
  municipality: z.string(),
  wardNumber: z.string(),
  currentAddress: z.string(),
  educationLevel: z.string(),
  institutionName: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  positionInterested: z.string(),
  politicalExperience: z.string().optional(),
  keyIssues: z.array(z.string()),
  whyJoin: z.string().optional(),
  photoUrl: z.string().optional(),
  citizenshipUrl: z.string().optional(),
  educationCertUrl: z.string().optional(),
  agreeTerms: z.boolean(),
  agreePrivacy: z.boolean(),
});

/**
 * GET /api/mission-representatives
 * Get all mission representatives (authenticated users)
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const showDeleted = req.query.showDeleted === 'true';
    const skip = (page - 1) * limit;

    console.log('🔍 GET /api/mission-representatives', { page, limit, status, showDeleted });

    // Build where clause
    const where: any = {
      isDeleted: showDeleted ? true : false, // Only show non-deleted by default
    };
    
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.status = status;
    }

    console.log('📊 Query WHERE clause:', where);

    // Get total count
    const total = await prisma.missionRepresentative.count({ where });
    console.log(`📈 Total count: ${total}`);

    // Get paginated data
    const representatives = await prisma.missionRepresentative.findMany({
      where,
      skip,
      take: limit,
      orderBy: { submittedAt: 'desc' },
    });

    console.log(`✅ Found ${representatives.length} representatives`);

    res.json({
      success: true,
      data: {
        representatives,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('❌ Error fetching mission representatives:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mission representatives',
    });
  }
});

/**
 * GET /api/mission-representatives/:id
 * Get mission representative by ID
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const representative = await prisma.missionRepresentative.findUnique({
      where: { id },
    });

    if (!representative) {
      res.status(404).json({
        success: false,
        message: 'Mission representative not found',
      });
      return;
    }

    res.json({
      success: true,
      data: representative,
    });
  } catch (error) {
    console.error('Error fetching mission representative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mission representative',
    });
  }
});

/**
 * POST /api/mission-representatives
 * Create new mission representative application (public)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = missionRepresentativeSchema.parse(req.body);

    // Calculate age from dateOfBirth
    const birthDate = new Date(validatedData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Create mission representative
    const representative = await prisma.missionRepresentative.create({
      data: {
        ...validatedData,
        dateOfBirth: birthDate,
        age,
        status: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: representative,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }

    console.error('Error creating mission representative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
    });
  }
});

/**
 * PUT /api/mission-representatives/:id
 * Update mission representative status (admin only)
 * Fixed: Removed role restriction to allow all authenticated admins
 */
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected',
      });
      return;
    }

    const representative = await prisma.missionRepresentative.update({
      where: { id },
      data: {
        status,
        notes: notes || undefined,
        reviewedAt: new Date(),
        reviewedBy: (req as any).admin?.username || 'admin',
      },
    });

    res.json({
      success: true,
      message: 'Mission representative updated successfully',
      data: representative,
    });
  } catch (error) {
    console.error('Error updating mission representative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mission representative',
    });
  }
});

/**
 * DELETE /api/mission-representatives/:id
 * Soft delete (move to trash) mission representative (admin only)
 * Changed from hard delete to soft delete
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete: Mark as deleted instead of removing from database
    const representative = await prisma.missionRepresentative.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: (req as any).admin?.username || 'admin',
      },
    });

    res.json({
      success: true,
      message: 'Mission representative moved to trash successfully',
      data: representative,
    });
  } catch (error) {
    console.error('Error moving mission representative to trash:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to move mission representative to trash',
    });
  }
});

/**
 * POST /api/mission-representatives/:id/restore
 * Restore mission representative from trash
 */
router.post('/:id/restore', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const representative = await prisma.missionRepresentative.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
      },
    });

    res.json({
      success: true,
      message: 'Mission representative restored successfully',
      data: representative,
    });
  } catch (error) {
    console.error('Error restoring mission representative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore mission representative',
    });
  }
});

/**
 * DELETE /api/mission-representatives/:id/permanent
 * Permanently delete mission representative (super_admin only)
 */
router.delete('/:id/permanent', authenticate, requireRole(['super_admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.missionRepresentative.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Mission representative permanently deleted',
    });
  } catch (error) {
    console.error('Error permanently deleting mission representative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete mission representative',
    });
  }
});

export default router;
