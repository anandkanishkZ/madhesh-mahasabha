import { Request, Response, NextFunction } from 'express';

/**
 * Simple logger middleware
 */
export function logger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(log);
    }
  });
  
  next();
}
