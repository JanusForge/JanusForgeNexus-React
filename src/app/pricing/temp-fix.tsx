"use client";

import { useState } from 'react';

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const tiers = [
    {
      name: 'Council',
      stripeId: 'price_1ScOX7Gg8RUnSFObmqiclPbt',
      price: '$9',
      period: '/month',
      description: 'For AI enthusiasts and learners',
      features: [
        '4 AI models (adds Claude & Gemini)',
        'Participate in live debates',
        'Save conversation history',
        'Topic suggestion voting',
        'Weekly debate summaries',
        'Priority email support'
      ],
      cta: 'Choose Council',
      popular: true,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Most Popular'
    },
    {
      name: 'Oracle',
      stripeId: 'price_1SVxLeGg8RUnSFObKobkPrcE',
      price: '$29',
      period: '/month',
      description: 'Full AI council participation',
      features: [
        'All Council features',
        'All 5 AI models (adds Grok)',
        'Advanced conversation memory',
        'Real-time debate participation',
        'Direct topic submissions',
        'Advanced analytics dashboard',
        'API access (limited)',
        'Priority chat support'
      ],
      cta: 'Join Oracle',
      popular: false,
      color: 'from-purple-500 to-pink-500',
      badge: 'Core Tier'
    },
    {
      name: 'Visionary',
      stripeId: 'price_1SVxMEGg8RUnSFObB08Qfs7I',
      price: '$99',
      period: '/month',
      description: 'For organizations and research',
      features: [
        'All Council features',
        'Unlimited API access',
        'Custom AI model training',
        'Dedicated infrastructure',
        'SLA guarantees (99.9% uptime)',
        'White-label options',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'from-orange-500 to-red-500',
      badge: 'Enterprise',
      isContact: true
    }
  ];

  const handleSubscribe = async (stripeId: string, tierName: string, isContact = false) => {
    if (isContact) {
      window.open('mailto:sales@janusforge.ai?subject=Visionary Tier Inquiry&body=Hello, I am interested in the Visionary tier for my organization.', '_blank');
      return;
    }

    setSelectedTier(tierName);
    setLoading(true);
    
    try {
      console.log(`Subscribing to ${tierName} with Stripe ID: ${stripeId}`);
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: stripeId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Error: ${error.message}. Please try again or contact support.`);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component remains the same
