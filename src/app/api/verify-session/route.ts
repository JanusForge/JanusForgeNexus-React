import { NextResponse } from 'next/server';

// This is a dynamic API route that needs real-time session checking
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  try {
    // In a real app, you would check the session here
    // For demo purposes, we'll return a mock response
    
    return NextResponse.json({
      success: true,
      verified: false,
      user: null,
      message: 'Demo mode - real session verification would happen here'
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
