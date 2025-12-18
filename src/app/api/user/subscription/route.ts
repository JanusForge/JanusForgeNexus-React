import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id') || 'cus_placeholder';

    // Check if Stripe API key is available
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.warn('Stripe API key not configured, using demo mode');
      // Always return demo data when no Stripe key
      return NextResponse.json({
        success: true,
        isMock: true,
        subscription: {
          tier: 'Council',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancel_at_period_end: false,
          amount: 900,
        },
        customer: {
          email: 'cassandra@janusforge.ai',
          name: 'Cassandra Williamson',
        }
      });
    }

    // Initialize Stripe only when we have the key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });

    if (customerId === 'cus_placeholder') {
      return NextResponse.json({
        success: true,
        isMock: true,
        subscription: {
          tier: 'Council',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancel_at_period_end: false,
          amount: 900,
        },
        customer: {
          email: 'cassandra@janusforge.ai',
          name: 'Cassandra Williamson',
        }
      });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active',
    });

    const customer = await stripe.customers.retrieve(customerId);

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        success: true,
        subscription: null,
        customer: customer
      });
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;

    const tierMap: Record<string, string> = {
      'price_1ScOX7Gg8RUnSFObmqiclPbt': 'Council',
      'price_1SVxLeGg8RUnSFObKobkPrcE': 'Oracle',
      'price_1SVxMEGg8RUnSFObB08Qfs7I': 'Visionary',
    };

    // Type assertion to fix TypeScript error
    const subscriptionAny = subscription as any;

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        tier: tierMap[priceId] || 'Unknown',
        status: subscription.status,
        current_period_end: new Date(subscriptionAny.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        amount: subscription.items.data[0].price.unit_amount,
      },
      customer: customer
    });

  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
