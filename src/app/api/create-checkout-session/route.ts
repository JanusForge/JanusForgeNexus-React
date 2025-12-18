import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    console.log('Creating checkout session for priceId:', priceId);

    // Check if Stripe API key is available
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.warn('Stripe API key not configured, using demo mode');
      // Return a demo checkout URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const tierName = getTierNameFromPriceId(priceId);
      const demoSessionId = 'cs_demo_' + Date.now();
      
      return NextResponse.json({ 
        url: `${baseUrl}/pricing/success?session_id=${demoSessionId}&tier=${tierName}&demo=true`,
        demo_mode: true,
      });
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing/success?session_id={CHECKOUT_SESSION_ID}&tier=${getTierNameFromPriceId(priceId)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        tier: getTierNameFromPriceId(priceId),
      },
    });

    console.log('Checkout session created:', session.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Helper function to get tier name from price ID
function getTierNameFromPriceId(priceId: string): string {
  const priceMap: Record<string, string> = {
    'price_1ScOX7Gg8RUnSFObmqiclPbt': 'Council',
    'price_1SVxLeGg8RUnSFObKobkPrcE': 'Oracle',
    'price_1SVxMEGg8RUnSFObB08Qfs7I': 'Visionary',
  };
  return priceMap[priceId] || 'Unknown';
}
