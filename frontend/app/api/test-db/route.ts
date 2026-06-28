import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Attempt a simple database query
    const plansCount = await prisma.plan.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful!',
      databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'MISSING',
      plansCount
    });
  } catch (error: any) {
    console.error('Test DB Error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'MISSING',
      errorCode: error.code,
      stack: error.stack
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
