import { Router, Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement admin routes
// Get all admins (superadmin only)
router.get('/', authenticate, requireRole(['superadmin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Create new admin (superadmin only)
router.post('/', authenticate, requireRole(['superadmin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Update admin (superadmin only)
router.put('/:id', authenticate, requireRole(['superadmin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Delete admin (superadmin only)
router.delete('/:id', authenticate, requireRole(['superadmin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
