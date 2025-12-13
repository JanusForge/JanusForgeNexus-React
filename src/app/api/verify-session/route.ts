import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    });

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        status: session.status,
        tier: session.metadata?.tier || 'Unknown',
        subscription_id: session.subscription,
        customer_id: session.customer,
      },
    });
  } catch (error: any) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify session' },
      { status: 500 }
    );
  }
}
