import { NextResponse } from 'next/server';

// This is a dynamic API route for user subscription data
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  try {
    // In a real app, you would fetch subscription data from Stripe or your database
    // For demo purposes, we'll return a mock response
    
    return NextResponse.json({
      success: true,
      subscription: null,
      active: false,
      tier: 'free',
      tokens_remaining: 50,
      message: 'Demo mode - real subscription data would come from Stripe'
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
