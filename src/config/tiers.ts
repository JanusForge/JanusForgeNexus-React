export const TIER_CONFIGS = {
  free: {
    id: 'free',
    stripePriceId: 'price_1SYoVOGg8RUnSFObfyCZ9XQS', // Create as recurring in Stripe
    name: 'Free',
    max_ai_models: 2,
    monthly_tokens: 50,
    price: 0,
    features: ['2 AI models per debate', '50 tokens/month', 'Community support'],
    color: 'gray',
  },
  basic: {
    id: 'basic',
    stripePriceId: 'price_1ScOX7Gg8RUnSFObmqiclPbt', // Create as recurring in Stripe
    name: 'Basic',
    max_ai_models: 3,
    monthly_tokens: 500, // Increased for better engagement
    price: 9,
    features: ['3 AI models', '500 tokens/month', '30-day history'],
    color: 'blue',
  },
  pro: {
    id: 'pro',
    stripePriceId: 'price_1SVxLeGg8RUnSFObKobkPrcE',
    name: 'Professional',
    max_ai_models: 5,
    monthly_tokens: 2000,
    price: 29,
    features: ['All 5 AI models', '2000 tokens/month', 'Priority support'],
    color: 'purple',
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    max_ai_models: 999,
    monthly_tokens: 999999,
    price: 0,
    features: ['God Mode Access'],
    color: 'red',
  },
};

export type UserTier = keyof typeof TIER_CONFIGS;

// UPDATED TO MATCH YOUR STRIPE PRICE IDs

export const TOKEN_PACKAGES = [
  {
    id: 'spark',
    stripePriceId: 'price_1SjqQsGg8RUnSFObmCiJWcDY',
    name: 'Spark Pack',
    tokens: 50,
    price: 5.00,
    description: '50 Full Council Summonings. Perfect for testing the Forge.',
  },
  {
    id: 'ignition',
    stripePriceId: 'price_1SjqU8Gg8RUnSFOb7F5ad5c4',
    name: 'Ignition Pack',
    tokens: 150,
    price: 12.00,
    popular: true,
    description: '150 Deliberations. The sweet spot for active Architects.',
  },
  {
    id: 'supernova',
    stripePriceId: 'price_1SjqW0Gg8RUnSFOb3s7uxK3q',
    name: 'Supernova Pack',
    tokens: 500,
    price: 35.00,
    description: '500 High-Level Syntheses. Maximum power for the serious seeker.',
  },
];


// ... (Keep your AI_TOKEN_COSTS and Utility functions below this)


// Calculate token costs for different AI models

export const AI_TOKEN_COSTS = {

  'gpt-4': {

    provider: 'OpenAI',

    input: 0.00003,    // $0.03 per 1K tokens

    output: 0.00006,   // $0.06 per 1K tokens

    yourCostPerToken: 0.000045,

  },

  'claude-3': {

    provider: 'Anthropic',

    input: 0.000015,   // $0.015 per 1K

    output: 0.000075,  // $0.075 per 1K

    yourCostPerToken: 0.000045,

  },

  'gemini-pro': {

    provider: 'Google',

    input: 0.0000005,  // $0.0005 per 1K

    output: 0.0000015, // $0.0015 per 1K

    yourCostPerToken: 0.000001,

  },

  'grok': {

    provider: 'xAI',

    input: 0.00001,    // Estimated

    output: 0.00002,   // Estimated

    yourCostPerToken: 0.000015,

  },

  'deepseek': {

    provider: '深度求索',

    input: 0.00000014, // $0.00014 per 1K

    output: 0.00000028,// $0.00028 per 1K

    yourCostPerToken: 0.00000021,

  },

};



// Utility functions

export function calculateTokenCost(model: string, inputTokens: number, outputTokens: number): number {

  const costs = AI_TOKEN_COSTS[model as keyof typeof AI_TOKEN_COSTS];

  if (!costs) return (inputTokens + outputTokens) * 0.00002;



  return (inputTokens * costs.input) + (outputTokens * costs.output);

}



export function calculateUserProfit(tier: UserTier, tokensSold: number): number {

  const config = TIER_CONFIGS[tier];

  const yourCost = tokensSold * 0.00002;

  return config.price - yourCost;

}



export function formatTokens(tokens: number): string {

  if (tokens >= 1000) {

    return `${(tokens / 1000).toFixed(1)}k`;

  }

  return tokens.toString();

}



export function getTierColor(tier: UserTier): string {

  const colors = {

    free: 'bg-gray-500',

    basic: 'bg-blue-500',

    pro: 'bg-purple-500',

    enterprise: 'bg-amber-500',

    admin: 'bg-red-500',

  };

  return colors[tier] || 'bg-gray-500';

}
