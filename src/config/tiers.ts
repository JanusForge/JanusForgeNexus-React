export const TIER_CONFIGS = {
  free: {
    id: 'free',
    name: 'Free',
    max_ai_models: 2,
    monthly_tokens: 50,
    price: 0,
    features: [
      '2 AI models per debate',
      '50 tokens/month',
      'Basic human engagement',
      'Community support',
      '7-day debate history'
    ],
    color: 'gray',
  },
  basic: {
    id: 'basic',  
    name: 'Basic',
    max_ai_models: 3,
    monthly_tokens: 250,
    price: 9,
    features: [
      '3 AI models per debate',
      '250 tokens/month',
      'Enhanced human engagement',
      'Email support',
      '30-day debate history',
      'Custom debate topics'
    ],
    color: 'blue',
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    max_ai_models: 5,
    monthly_tokens: 1000,
    price: 29,
    features: [
      'All 5 AI models',
      '1000 tokens/month',
      'Priority human engagement',
      'Phone & email support',
      '90-day debate history',
      'Advanced analytics',
      'API access (coming soon)'
    ],
    color: 'purple',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    max_ai_models: 10,
    monthly_tokens: 5000,
    price: 99,
    features: [
      'Custom AI model selection',
      '5000+ tokens/month',
      'Dedicated human moderator',
      '24/7 priority support',
      'Unlimited debate history',
      'Advanced analytics dashboard',
      'Full API access',
      'Custom feature development',
      'SLA guarantee'
    ],
    color: 'amber',
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    max_ai_models: 999,
    monthly_tokens: 99999,
    price: 0,
    features: ['Full system access'],
    color: 'red',
  },
};

export type UserTier = keyof typeof TIER_CONFIGS;

// Token add-on packages
export const TOKEN_PACKAGES = [
  {
    id: 'token-100',
    name: '100 Token Pack',
    tokens: 100,
    price: 4.99,
    pricePerToken: 0.0499,
    popular: false,
    description: 'Small top-up for light users',
  },
  {
    id: 'token-250',
    name: '250 Token Pack',
    tokens: 250,
    price: 9.99,
    pricePerToken: 0.03996,
    popular: true,
    description: 'Best value for occasional use',
  },
  {
    id: 'token-500',
    name: '500 Token Pack',
    tokens: 500,
    price: 17.99,
    pricePerToken: 0.03598,
    popular: false,
    description: 'Great for regular debaters',
  },
  {
    id: 'token-1000',
    name: '1000 Token Pack',
    tokens: 1000,
    price: 29.99,
    pricePerToken: 0.02999,
    popular: true,
    description: 'Most popular - best value',
  },
  {
    id: 'token-5000',
    name: '5000 Token Pack',
    tokens: 5000,
    price: 129.99,
    pricePerToken: 0.025998,
    popular: false,
    description: 'For power users and teams',
  },
];

// Calculate token costs for different AI models (YOUR ACTUAL COSTS)
export const AI_TOKEN_COSTS = {
  'gpt-4': {
    provider: 'OpenAI',
    input: 0.00003,    // $0.03 per 1K tokens
    output: 0.00006,   // $0.06 per 1K tokens
    yourCostPerToken: 0.000045, // Average
  },
  'claude-3': {
    provider: 'Anthropic',
    input: 0.000015,   // $0.015 per 1K
    output: 0.000075,  // $0.075 per 1K
    yourCostPerToken: 0.000045, // Average
  },
  'gemini-pro': {
    provider: 'Google',
    input: 0.0000005,  // $0.0005 per 1K
    output: 0.0000015, // $0.0015 per 1K
    yourCostPerToken: 0.000001, // Very cheap!
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
    yourCostPerToken: 0.00000021, // Extremely cheap!
  },
};

// Utility functions
export function calculateTokenCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = AI_TOKEN_COSTS[model as keyof typeof AI_TOKEN_COSTS];
  if (!costs) return (inputTokens + outputTokens) * 0.00002; // Default
  
  return (inputTokens * costs.input) + (outputTokens * costs.output);
}

export function calculateUserProfit(tier: UserTier, tokensSold: number): number {
  const config = TIER_CONFIGS[tier];
  const yourCost = tokensSold * 0.00002; // Average $0.02 per 1K
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
