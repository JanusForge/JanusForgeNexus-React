import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export async function GET(request: NextRequest) {
  try {
    // In production: Get customer ID from your auth/session
    // For now, we'll use a query param for testing
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id') || 'cus_placeholder';
    
    // If you have a user session system, you'd fetch their Stripe customer ID from your DB
    // const customerId = await getCustomerIdFromSession();
    
    if (customerId === 'cus_placeholder') {
      // Return mock data for testing
      return NextResponse.json({
        success: true,
        isMock: true,
        subscription: {
          tier: 'Council',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          cancel_at_period_end: false,
          amount: 900, // $9.00 in cents
        },
        customer: {
          email: 'cassandra@janusforge.ai',
          name: 'Cassandra Williamson',
        }
      });
    }
    
    // Real Stripe fetch logic
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
    
    // Map price ID to tier name
    const tierMap: Record<string, string> = {
      'price_1ScOX7Gg8RUnSFObmqiclPbt': 'Council',
      'price_1SVxLeGg8RUnSFObKobkPrcE': 'Oracle',
      'price_1SVxMEGg8RUnSFObB08Qfs7I': 'Visionary',
    };
    
    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        tier: tierMap[priceId] || 'Unknown',
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
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
