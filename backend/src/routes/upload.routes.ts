import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/mission-representatives');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter to accept only images and PDFs
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

/**
 * POST /api/upload/mission-representative
 * Upload files for mission representative application
 */
router.post('/mission-representative', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'citizenship', maxCount: 1 },
  { name: 'educationCert', maxCount: 1 }
]), (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
      return;
    }

    const fileUrls: any = {};

    // Process uploaded files and generate URLs
    if (files.photo && files.photo[0]) {
      fileUrls.photoUrl = `/uploads/mission-representatives/${files.photo[0].filename}`;
    }

    if (files.citizenship && files.citizenship[0]) {
      fileUrls.citizenshipUrl = `/uploads/mission-representatives/${files.citizenship[0].filename}`;
    }

    if (files.educationCert && files.educationCert[0]) {
      fileUrls.educationCertUrl = `/uploads/mission-representatives/${files.educationCert[0].filename}`;
    }

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      data: fileUrls
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
});

/**
 * GET /api/upload/mission-representatives/:filename
 * Serve uploaded files with authentication
 */
router.get('/mission-representatives/:filename', authenticate, (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
      return;
    }

    // Serve the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve file'
    });
  }
});

export default router;
