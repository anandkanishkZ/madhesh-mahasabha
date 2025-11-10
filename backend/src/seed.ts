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

    // Create sample mission representatives
    const existingMissionReps = await prisma.missionRepresentative.count();

    if (existingMissionReps === 0) {
      console.log('📝 Creating sample mission representatives...\n');

      const sampleMissionReps = [
        {
          fullName: 'Ram Kumar Yadav',
          dateOfBirth: new Date('1990-05-15'),
          age: 34,
          gender: 'Male',
          contactNumber: '9841234567',
          email: 'ram.yadav@example.com',
          province: 'Madhesh Pradesh',
          district: 'Dhanusha',
          constituency: 'Dhanusha-1',
          municipality: 'Janakpur Sub-Metropolitan City',
          wardNumber: '5',
          currentAddress: 'Janakpur-5, Dhanusha',
          educationLevel: 'Bachelor',
          institutionName: 'Tribhuvan University',
          fieldOfStudy: 'Political Science',
          positionInterested: 'Local Representative',
          politicalExperience: '5 years of grassroots political activism',
          keyIssues: ['Education', 'Healthcare', 'Infrastructure'],
          whyJoin: 'I want to serve my community and bring positive change to Madhesh Pradesh.',
          status: 'approved',
          agreeTerms: true,
          agreePrivacy: true,
          isDeleted: false,
        },
        {
          fullName: 'Sita Devi Thakur',
          dateOfBirth: new Date('1988-08-22'),
          age: 36,
          gender: 'Female',
          contactNumber: '9851234568',
          email: 'sita.thakur@example.com',
          province: 'Madhesh Pradesh',
          district: 'Siraha',
          constituency: 'Siraha-2',
          municipality: 'Lahan Municipality',
          wardNumber: '8',
          currentAddress: 'Lahan-8, Siraha',
          educationLevel: 'Master',
          institutionName: 'Kathmandu University',
          fieldOfStudy: 'Public Administration',
          positionInterested: 'Regional Coordinator',
          politicalExperience: 'Former youth wing leader, 8 years experience',
          keyIssues: ['Women Empowerment', 'Rural Development', 'Education'],
          whyJoin: 'To empower women in Madhesh and create equal opportunities for all.',
          status: 'pending',
          agreeTerms: true,
          agreePrivacy: true,
          isDeleted: false,
        },
        {
          fullName: 'Hari Bahadur Mandal',
          dateOfBirth: new Date('1995-12-10'),
          age: 29,
          gender: 'Male',
          contactNumber: '9861234569',
          email: 'hari.mandal@example.com',
          province: 'Madhesh Pradesh',
          district: 'Saptari',
          constituency: 'Saptari-3',
          municipality: 'Rajbiraj Municipality',
          wardNumber: '12',
          currentAddress: 'Rajbiraj-12, Saptari',
          educationLevel: 'Bachelor',
          institutionName: 'Purbanchal University',
          fieldOfStudy: 'Law',
          positionInterested: 'Youth Representative',
          politicalExperience: 'Student union leader for 3 years',
          keyIssues: ['Youth Employment', 'Digital Literacy', 'Sports Development'],
          whyJoin: 'To represent the voice of young people in Madhesh Pradesh.',
          status: 'pending',
          agreeTerms: true,
          agreePrivacy: true,
          isDeleted: false,
        },
        {
          fullName: 'Geeta Kumari Shah',
          dateOfBirth: new Date('1992-03-18'),
          age: 32,
          gender: 'Female',
          contactNumber: '9871234570',
          email: 'geeta.shah@example.com',
          province: 'Madhesh Pradesh',
          district: 'Mahottari',
          constituency: 'Mahottari-1',
          municipality: 'Jaleshwar Municipality',
          wardNumber: '3',
          currentAddress: 'Jaleshwar-3, Mahottari',
          educationLevel: 'Master',
          institutionName: 'Mid-Western University',
          fieldOfStudy: 'Sociology',
          positionInterested: 'Social Affairs Coordinator',
          politicalExperience: 'Social activist for 6 years',
          keyIssues: ['Social Justice', 'Health Services', 'Cultural Preservation'],
          whyJoin: 'To work for social justice and cultural rights of Madheshi people.',
          status: 'approved',
          agreeTerms: true,
          agreePrivacy: true,
          isDeleted: false,
        },
        {
          fullName: 'Rajesh Prasad Jha',
          dateOfBirth: new Date('1987-07-25'),
          age: 37,
          gender: 'Male',
          contactNumber: '9881234571',
          email: 'rajesh.jha@example.com',
          province: 'Madhesh Pradesh',
          district: 'Rautahat',
          constituency: 'Rautahat-2',
          municipality: 'Gaur Municipality',
          wardNumber: '7',
          currentAddress: 'Gaur-7, Rautahat',
          educationLevel: 'Master',
          institutionName: 'Tribhuvan University',
          fieldOfStudy: 'Economics',
          positionInterested: 'Economic Affairs Representative',
          politicalExperience: 'Economic policy researcher, 10 years',
          keyIssues: ['Economic Development', 'Agriculture', 'Trade'],
          whyJoin: 'To contribute to economic prosperity of Madhesh Pradesh.',
          status: 'rejected',
          notes: 'Incomplete documentation submitted',
          agreeTerms: true,
          agreePrivacy: true,
          isDeleted: false,
        },
        {
          fullName: 'Anita Kumari Mishra',
          dateOfBirth: new Date('1993-11-30'),
          age: 31,
          gender: 'Female',
          contactNumber: '9891234572',
          email: 'anita.mishra@example.com',
          province: 'Madhesh Pradesh',
          district: 'Sarlahi',
          constituency: 'Sarlahi-1',
          municipality: 'Malangwa Municipality',
          wardNumber: '9',
          currentAddress: 'Malangwa-9, Sarlahi',
          educationLevel: 'Bachelor',
          institutionName: 'Pokhara University',
          fieldOfStudy: 'Environmental Science',
          positionInterested: 'Environmental Affairs Representative',
          politicalExperience: 'Environmental activist, 4 years',
          keyIssues: ['Environment Protection', 'Climate Change', 'Sustainable Development'],
          whyJoin: 'To address environmental challenges in Madhesh Pradesh.',
          status: 'pending',
          agreeTerms: true,
          agreePrivacy: true,
          isDeleted: false,
        },
        {
          fullName: 'Deleted Representative Test',
          dateOfBirth: new Date('1990-01-01'),
          age: 34,
          gender: 'Male',
          contactNumber: '9801234573',
          email: 'deleted.test@example.com',
          province: 'Madhesh Pradesh',
          district: 'Bara',
          constituency: 'Bara-1',
          municipality: 'Kalaiya Municipality',
          wardNumber: '1',
          currentAddress: 'Kalaiya-1, Bara',
          educationLevel: 'Bachelor',
          positionInterested: 'Test Representative',
          keyIssues: ['Test'],
          status: 'pending',
          agreeTerms: true,
          agreePrivacy: true,
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: 'admin',
        },
      ];

      for (const rep of sampleMissionReps) {
        await prisma.missionRepresentative.create({
          data: rep,
        });
      }

      console.log(`✅ Created ${sampleMissionReps.length} sample mission representatives\n`);
      console.log('   - 2 Approved applications');
      console.log('   - 3 Pending applications');
      console.log('   - 1 Rejected application');
      console.log('   - 1 Deleted (trash) application\n');
    } else {
      console.log('⚠️  Mission representative data already exists. Skipping.\n');
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
