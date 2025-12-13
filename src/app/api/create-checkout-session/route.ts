import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
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
