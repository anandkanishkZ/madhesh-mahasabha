import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { hashPassword, verifyPassword, generateToken, generateSessionToken, getSessionExpiry } from '../lib/auth';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(3).max(100), // Allow email length
  password: z.string().min(6)
});

/**
 * POST /api/auth/login
 * Admin login - supports both username and email
 */
router.post('/login', authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { username, password } = loginSchema.parse(req.body);

    // Find admin by username OR email
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username } // Allow login with email in username field
        ]
      }
    });

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if active
    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is inactive'
      });
      return;
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password);

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate tokens
    const token = generateToken({ 
      adminId: admin.id, 
      username: admin.username,
      role: admin.role 
    });

    const sessionToken = generateSessionToken();

    // Create session
    await prisma.session.create({
      data: {
        sessionToken,
        adminId: admin.id,
        expires: getSessionExpiry()
      }
    });

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        adminId: admin.id,
        action: 'login',
        entity: 'admin',
        entityId: admin.id,
        details: `Admin ${admin.username} logged in`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        sessionToken,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
      return;
    }

    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

/**
 * POST /api/auth/logout
 * Admin logout
 */
router.post('/logout', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionToken = req.body.sessionToken;

    if (sessionToken) {
      // Delete session
      await prisma.session.deleteMany({
        where: {
          sessionToken,
          adminId: req.admin!.id
        }
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        adminId: req.admin!.id,
        action: 'logout',
        entity: 'admin',
        entityId: req.admin!.id,
        details: `Admin ${req.admin!.username} logged out`
      }
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current admin info
 */
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        lastLogin: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: { admin }
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin info'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change admin password
 */
router.post('/change-password', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
      return;
    }

    // Get admin with password
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id }
    });

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
      return;
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, admin.password);

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        adminId: admin.id,
        action: 'change_password',
        entity: 'admin',
        entityId: admin.id,
        details: `Admin ${admin.username} changed password`
      }
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

export default router;
