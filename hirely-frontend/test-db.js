const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Attempting to connect to database...');
    console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? 'Found ✅' : 'Not found ❌');
    
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log('📊 Database Info:', result);
    
    // Count records in each table
    const userCount = await prisma.userProfile.count();
    const assessmentCount = await prisma.assessment.count();
    const coverLetterCount = await prisma.coverLetter.count();
    
    console.log('📈 Record counts:');
    console.log('  - UserProfile:', userCount);
    console.log('  - Assessment:', assessmentCount);
    console.log('  - CoverLetter:', coverLetterCount);
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

testConnection();
