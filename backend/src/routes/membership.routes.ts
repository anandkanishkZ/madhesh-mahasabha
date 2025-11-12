import { Router, Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { sanitizeObject } from '../lib/sanitize';
import { membershipLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

/**
 * Get membership statistics
 * GET /api/memberships/stats
 */
router.get('/stats', authenticate, async (_req: Request, res: Response) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.membership.count({ where: { isDeleted: false } }),
      prisma.membership.count({ where: { status: 'pending', isDeleted: false } }),
      prisma.membership.count({ where: { status: 'approved', isDeleted: false } }),
      prisma.membership.count({ where: { status: 'rejected', isDeleted: false } }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    console.error('Error fetching membership stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get all memberships with pagination and filtering
 * GET /api/memberships?page=1&limit=20&status=pending
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { isDeleted: false };
    
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [memberships, total] = await Promise.all([
      prisma.membership.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.membership.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        memberships,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch memberships',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get membership by ID
 * GET /api/memberships/:id
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const membership = await prisma.membership.findUnique({
      where: { id },
    });

    if (!membership) {
      res.status(404).json({
        success: false,
        message: 'Membership not found',
      });
      return;
    }

    if (membership.isDeleted) {
      res.status(410).json({
        success: false,
        message: 'Membership has been deleted',
      });
      return;
    }

    res.json({
      success: true,
      data: membership,
    });
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Create new membership application (Public endpoint)
 * POST /api/memberships
 */
router.post('/', membershipLimiter, async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      occupation,
      education,
      gender,
      motivations,
      skills,
      availability,
      additionalInfo,
    } = req.body;

    // Validation
    if (!fullName || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, email, phone, address',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Sanitize all input data to prevent XSS attacks
    const sanitizedData = sanitizeObject(req.body, {
      plainTextFields: ['fullName', 'address', 'occupation', 'education', 'gender', 'availability'],
      emailFields: ['email'],
      phoneFields: ['phone'],
      htmlFields: ['additionalInfo'],
      arrayFields: ['motivations', 'skills'],
    });

    // Check for duplicate email
    const existingMembership = await prisma.membership.findFirst({
      where: {
        email: sanitizedData.email.toLowerCase(),
        isDeleted: false,
      },
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: 'A membership application with this email already exists',
      });
    }

    // Get IP address and user agent
    const ipAddress = req.headers['x-forwarded-for'] as string || 
                     req.headers['x-real-ip'] as string || 
                     req.socket.remoteAddress || 
                     'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Create membership
    const membership = await prisma.membership.create({
      data: {
        fullName: sanitizedData.fullName,
        email: sanitizedData.email.toLowerCase(),
        phone: sanitizedData.phone,
        address: sanitizedData.address,
        occupation: sanitizedData.occupation || null,
        education: sanitizedData.education || null,
        gender: sanitizedData.gender || null,
        motivations: sanitizedData.motivations || [],
        skills: sanitizedData.skills || [],
        availability: sanitizedData.availability || null,
        additionalInfo: sanitizedData.additionalInfo || null,
        status: 'pending',
        ipAddress,
        userAgent,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'create',
        entity: 'membership',
        entityId: membership.id,
        details: `New membership application submitted by ${sanitizedData.fullName} (${sanitizedData.email})`,
        ipAddress,
        userAgent,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Membership application submitted successfully',
      data: {
        id: membership.id,
        submittedAt: membership.submittedAt,
      },
    });
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit membership application',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Update membership (Admin only)
 * PUT /api/memberships/:id
 */
router.put('/:id', authenticate, requireRole(['admin', 'super_admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, ...updateData } = req.body;
    const adminId = (req as any).admin?.id;
    const adminName = (req as any).admin?.name || 'Admin';

    const membership = await prisma.membership.findUnique({
      where: { id },
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found',
      });
    }

    if (membership.isDeleted) {
      return res.status(410).json({
        success: false,
        message: 'Cannot update deleted membership',
      });
    }

    // Validate status if provided
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected',
      });
    }

    const dataToUpdate: any = { ...updateData };

    // Update status and review info if status is changing
    if (status && status !== membership.status) {
      dataToUpdate.status = status;
      dataToUpdate.reviewedAt = new Date();
      dataToUpdate.reviewedBy = adminName;
    }

    // Update notes if provided
    if (notes !== undefined) {
      dataToUpdate.notes = notes;
    }

    const updatedMembership = await prisma.membership.update({
      where: { id },
      data: dataToUpdate,
    });

    // Log activity
    const ipAddress = req.headers['x-forwarded-for'] as string || 
                     req.headers['x-real-ip'] as string || 
                     req.socket.remoteAddress || 
                     'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await prisma.activityLog.create({
      data: {
        adminId,
        action: 'update',
        entity: 'membership',
        entityId: id,
        details: `Updated membership for ${membership.fullName} (${membership.email}). Status: ${status || membership.status}`,
        ipAddress,
        userAgent,
      },
    });

    res.json({
      success: true,
      message: 'Membership updated successfully',
      data: updatedMembership,
    });
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update membership',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Soft delete membership (Move to trash)
 * DELETE /api/memberships/:id
 */
router.delete('/:id', authenticate, requireRole(['admin', 'super_admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).admin?.id;
    const adminName = (req as any).admin?.name || 'Admin';

    const membership = await prisma.membership.findUnique({
      where: { id },
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found',
      });
    }

    if (membership.isDeleted) {
      return res.status(410).json({
        success: false,
        message: 'Membership is already deleted',
      });
    }

    await prisma.membership.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: adminName,
      },
    });

    // Log activity
    const ipAddress = req.headers['x-forwarded-for'] as string || 
                     req.headers['x-real-ip'] as string || 
                     req.socket.remoteAddress || 
                     'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await prisma.activityLog.create({
      data: {
        adminId,
        action: 'delete',
        entity: 'membership',
        entityId: id,
        details: `Deleted membership for ${membership.fullName} (${membership.email})`,
        ipAddress,
        userAgent,
      },
    });

    res.json({
      success: true,
      message: 'Membership moved to trash successfully',
    });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete membership',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Restore membership from trash
 * POST /api/memberships/:id/restore
 */
router.post('/:id/restore', authenticate, requireRole(['admin', 'super_admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).admin?.id;

    const membership = await prisma.membership.findUnique({
      where: { id },
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found',
      });
    }

    if (!membership.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Membership is not deleted',
      });
    }

    await prisma.membership.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
      },
    });

    // Log activity
    const ipAddress = req.headers['x-forwarded-for'] as string || 
                     req.headers['x-real-ip'] as string || 
                     req.socket.remoteAddress || 
                     'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await prisma.activityLog.create({
      data: {
        adminId,
        action: 'restore',
        entity: 'membership',
        entityId: id,
        details: `Restored membership for ${membership.fullName} (${membership.email})`,
        ipAddress,
        userAgent,
      },
    });

    res.json({
      success: true,
      message: 'Membership restored successfully',
    });
  } catch (error) {
    console.error('Error restoring membership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore membership',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Permanently delete membership (super_admin only)
 * DELETE /api/memberships/:id/permanent
 */
router.delete('/:id/permanent', authenticate, requireRole(['super_admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).admin?.id;

    const membership = await prisma.membership.findUnique({
      where: { id },
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found',
      });
    }

    await prisma.membership.delete({
      where: { id },
    });

    // Log activity
    const ipAddress = req.headers['x-forwarded-for'] as string || 
                     req.headers['x-real-ip'] as string || 
                     req.socket.remoteAddress || 
                     'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await prisma.activityLog.create({
      data: {
        adminId,
        action: 'permanent_delete',
        entity: 'membership',
        entityId: id,
        details: `Permanently deleted membership for ${membership.fullName} (${membership.email})`,
        ipAddress,
        userAgent,
      },
    });

    res.json({
      success: true,
      message: 'Membership permanently deleted',
    });
  } catch (error) {
    console.error('Error permanently deleting membership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete membership',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
