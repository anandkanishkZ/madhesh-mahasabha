const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function updateMediaUrls() {
  try {
    const allMedia = await prisma.media.findMany();
    console.log(`Found ${allMedia.length} media records\n`);

    for (const media of allMedia) {
      // Update URL to use secure API endpoint
      const newUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/media/file/${media.storedName}`;
      
      await prisma.media.update({
        where: { id: media.id },
        data: { url: newUrl }
      });

      console.log(`✅ Updated: ${media.filename} -> ${newUrl}`);
    }

    console.log(`\n🎉 Successfully updated ${allMedia.length} media URLs to use secure API endpoint`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMediaUrls();
