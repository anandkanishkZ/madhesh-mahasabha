import dotenv from 'dotenv';
import prisma from './lib/prisma';
import { hashPassword } from './lib/auth';

// Load environment variables
dotenv.config();

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Create admin user
    const adminUsername = process.env.INITIAL_ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@madheshmahasabha.com';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Madhesh@2025';
    const adminName = process.env.INITIAL_ADMIN_NAME || 'System Administrator';

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: adminUsername },
          { email: adminEmail }
        ]
      }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping admin creation.\n');
      console.log('Existing admin details:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}\n`);
    } else {
      // Hash password
      const hashedPassword = await hashPassword(adminPassword);

      // Create admin
      const admin = await prisma.admin.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'super_admin',
          isActive: true
        }
      });

      console.log('✅ Admin user created successfully!\n');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📋 Admin Credentials:');
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`   Username: ${admin.username}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log('═══════════════════════════════════════════════════════════');
      console.log('⚠️  IMPORTANT: Change the password after first login!');
      console.log('═══════════════════════════════════════════════════════════\n');

      // Log the activity
      await prisma.activityLog.create({
        data: {
          adminId: admin.id,
          action: 'create',
          entity: 'admin',
          entityId: admin.id,
          details: `Initial admin user created: ${admin.username}`
        }
      });
    }

    // Create some sample data (optional)
    console.log('📊 Creating sample data...\n');

    // Check if sample data exists
    const existingNews = await prisma.news.count();

    if (existingNews === 0) {
      // Create sample news
      await prisma.news.create({
        data: {
          title: 'Welcome to Madhesh Mahasabha',
          titleNp: 'मधेश महासभामा स्वागत छ',
          content: 'This is the first news article. You can edit or delete it from the admin dashboard.',
          contentNp: 'यो पहिलो समाचार लेख हो। तपाईं यसलाई प्रशासन ड्यासबोर्डबाट सम्पादन वा मेटाउन सक्नुहुन्छ।',
          excerpt: 'Welcome to our platform',
          excerptNp: 'हाम्रो प्लेटफर्ममा स्वागत छ',
          category: 'announcement',
          tags: ['welcome', 'announcement'],
          author: 'System',
          isPublished: true
        }
      });

      console.log('✅ Sample news article created\n');
    } else {
      console.log('⚠️  Sample data already exists. Skipping.\n');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed function
seed();
