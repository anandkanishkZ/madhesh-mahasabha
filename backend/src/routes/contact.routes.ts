import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

const router = Router();

// Validation schema for contact message
const contactMessageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  organization: z.string().max(200).optional(),
});

// Validation schema for status update
const updateStatusSchema = z.object({
  status: z.enum(['unread', 'read', 'responded']),
  response: z.string().optional(),
});

/**
 * GET /api/contact
 * Get all contact messages (authenticated users)
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status && ['unread', 'read', 'responded'].includes(status)) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.contactMessage.count({ where });

    // Get paginated data
    const messages = await prisma.contactMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages',
    });
  }
});

/**
 * GET /api/contact/stats
 * Get contact message statistics (authenticated users)
 */
router.get('/stats', authenticate, async (_req: Request, res: Response) => {
  try {
    const totalMessages = await prisma.contactMessage.count();
    const unreadMessages = await prisma.contactMessage.count({
      where: { status: 'unread' },
    });
    const readMessages = await prisma.contactMessage.count({
      where: { status: 'read' },
    });
    const respondedMessages = await prisma.contactMessage.count({
      where: { status: 'responded' },
    });

    res.json({
      success: true,
      data: {
        total: totalMessages,
        unread: unreadMessages,
        read: readMessages,
        responded: respondedMessages,
      },
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics',
    });
  }
});

/**
 * GET /api/contact/:id
 * Get contact message by ID
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
      return;
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message',
    });
  }
});

/**
 * POST /api/contact
 * Create new contact message (public endpoint - no authentication required)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = contactMessageSchema.parse(req.body);

    // Create contact message
    const message = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject,
        message: validatedData.message,
        organization: validatedData.organization || null,
        status: 'unread',
      },
    });

    // Log activity (no admin ID since it's public)
    await prisma.activityLog.create({
      data: {
        action: 'create',
        entity: 'contact_message',
        entityId: message.id,
        details: `New contact message from ${validatedData.name} (${validatedData.email})`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: {
        id: message.id,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating contact message:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit contact message',
    });
  }
});

/**
 * PUT /api/contact/:id
 * Update contact message status (authenticated users)
 */
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Validate input
    const validatedData = updateStatusSchema.parse(req.body);

    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
      return;
    }

    // Prepare update data
    const updateData: any = {
      status: validatedData.status,
    };

    // If status is 'responded', update response and timestamp
    if (validatedData.status === 'responded') {
      updateData.response = validatedData.response || null;
      updateData.respondedAt = new Date();
    }

    // Update message
    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        adminId: req.admin?.id,
        action: 'update',
        entity: 'contact_message',
        entityId: id,
        details: `Contact message status updated to ${validatedData.status}`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: updatedMessage,
    });
  } catch (error) {
    console.error('Error updating contact message:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update contact message',
    });
  }
});

/**
 * DELETE /api/contact/:id
 * Delete contact message (admin only)
 */
router.delete('/:id', authenticate, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
      return;
    }

    // Delete message
    await prisma.contactMessage.delete({
      where: { id },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        adminId: req.admin?.id,
        action: 'delete',
        entity: 'contact_message',
        entityId: id,
        details: `Contact message deleted: ${existingMessage.name} (${existingMessage.email})`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message',
    });
  }
});

export default router;
