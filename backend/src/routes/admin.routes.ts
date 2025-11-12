import { Router, Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement admin routes
// Get all admins (super_admin only)
router.get('/', authenticate, requireRole(['super_admin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Create new admin (super_admin only)
router.post('/', authenticate, requireRole(['super_admin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Update admin (super_admin only)
router.put('/:id', authenticate, requireRole(['super_admin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Delete admin (super_admin only)
router.delete('/:id', authenticate, requireRole(['super_admin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
