const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
require('dotenv').config();

const prisma = new PrismaClient();

// Get category from MIME type
function getCategoryFromMime(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word')) return 'document';
  return 'other';
}

// Get MIME type from extension
function getMimeFromExtension(ext) {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
  };
  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}

async function getImageDimensions(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width || null, height: metadata.height || null };
  } catch (error) {
    return { width: null, height: null };
  }
}

async function importExistingFiles() {
  try {
    const uploadsDir = path.join(__dirname, 'uploads', 'media');
    
    // Check if directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ uploads/media directory does not exist');
      return;
    }

    // Read all files
    const files = fs.readdirSync(uploadsDir);
    console.log(`📁 Found ${files.length} files in uploads/media\n`);

    if (files.length === 0) {
      console.log('No files to import');
      return;
    }

    // Get admin user for uploadedBy field
    const admin = await prisma.admin.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    if (!admin) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }

    let imported = 0;
    let skipped = 0;

    for (const filename of files) {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);

      // Skip directories
      if (!stats.isFile()) {
        skipped++;
        continue;
      }

      // Check if already exists in database
      const existing = await prisma.media.findFirst({
        where: { storedName: filename }
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${filename} (already in database)`);
        skipped++;
        continue;
      }

      // Get file info
      const ext = path.extname(filename);
      const mimeType = getMimeFromExtension(ext);
      const category = getCategoryFromMime(mimeType);
      
      // Get dimensions for images
      let dimensions = { width: null, height: null };
      if (category === 'image') {
        dimensions = await getImageDimensions(filePath);
      }

      // Extract original filename (remove UUID prefix if present)
      let originalName = filename;
      const parts = filename.split('-');
      if (parts.length > 3) {
        // Likely has UUID prefix, try to extract original name
        originalName = parts.slice(3).join('-');
      }

      // Create database record
      const media = await prisma.media.create({
        data: {
          filename: originalName,
          storedName: filename,
          filepath: `/media/${filename}`,
          url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/media/${filename}`,
          mimeType: mimeType,
          size: stats.size,
          width: dimensions.width,
          height: dimensions.height,
          title: originalName,
          altText: '',
          caption: '',
          description: 'Imported from existing uploads',
          category: category,
          folder: null,
          tags: [],
          uploadedBy: admin.id,
          uploadedByName: admin.name,
        }
      });

      console.log(`✅ Imported: ${originalName} (${category}, ${stats.size} bytes)`);
      imported++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Imported: ${imported} files`);
    console.log(`   ⏭️  Skipped: ${skipped} files`);
    console.log(`\n🎉 Import complete!`);

  } catch (error) {
    console.error('❌ Error importing files:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importExistingFiles();
