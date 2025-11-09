import { Router, Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Get all news (public)
router.get('/', async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Get news by ID (public)
router.get('/:id', async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Create new news (admin only)
router.post('/', authenticate, requireRole(['admin', 'superadmin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Update news (admin only)
router.put('/:id', authenticate, requireRole(['admin', 'superadmin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Delete news (admin only)
router.delete('/:id', authenticate, requireRole(['admin', 'superadmin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
