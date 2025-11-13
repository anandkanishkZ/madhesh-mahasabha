const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkMedia() {
  try {
    const count = await prisma.media.count();
    console.log(`Total media records: ${count}`);
    
    const media = await prisma.media.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('\nRecent media:');
    media.forEach(m => {
      console.log(`- ${m.filename} (${m.category}) - URL: ${m.url}`);
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkMedia();
