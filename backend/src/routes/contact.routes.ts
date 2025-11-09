import { Router, Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Get all contact messages (authenticated users)
router.get('/', authenticate, async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Get contact message by ID
router.get('/:id', authenticate, async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Create new contact message (public)
router.post('/', async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Update contact message status (authenticated users)
router.put('/:id', authenticate, async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Delete contact message (admin only)
router.delete('/:id', authenticate, requireRole(['admin', 'superadmin']), async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
