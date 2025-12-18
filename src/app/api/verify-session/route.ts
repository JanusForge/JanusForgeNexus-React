import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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

    // Check if Stripe API key is available
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.warn('Stripe API key not configured, using demo mode');
      return NextResponse.json({
        success: true,
        session: {
          id: sessionId,
          customer_email: 'demo@janusforge.ai',
          amount_total: 2900,
          currency: 'usd',
          status: 'complete',
          tier: 'pro',
          subscription_id: 'sub_demo_' + sessionId,
          customer_id: 'cus_demo_' + Date.now(),
          demo_mode: true,
        },
      });
    }

    // Initialize Stripe with the API key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });

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
        demo_mode: false,
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
