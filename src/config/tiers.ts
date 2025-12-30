export const TIER_CONFIGS = {
  free: {
    id: 'free',
    stripePriceId: 'price_1SYoVOGg8RUnSFObfyCZ9XQS',
    name: 'Free',
    max_ai_models: 2,
    monthly_tokens: 50,
    price: 0,
    features: ['2 AI models (DeepSeek, Gemini)', '50 tokens/month', 'Community support'],
    color: 'gray',
  },
  basic: {
    id: 'basic',
    stripePriceId: 'price_1ScOX7Gg8RUnSFObmqiclPbt',
    name: 'Basic',
    max_ai_models: 3,
    monthly_tokens: 500,
    price: 9,
    features: ['3 AI models (+Grok)', '500 tokens/month', '30-day history'],
    color: 'blue',
  },
  pro: {
    id: 'pro',
    stripePriceId: 'price_1SVxLeGg8RUnSFObKobkPrcE',
    name: 'Professional',
    max_ai_models: 5,
    monthly_tokens: 2000,
    price: 29,
    features: ['All 5 AI models (+Claude, GPT-4)', '2000 tokens/month', 'Priority support'],
    color: 'purple',
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    max_ai_models: 5,
    monthly_tokens: 999999,
    price: 0,
    features: ['God Mode Access'],
    color: 'red',
  },
};

export type UserTier = keyof typeof TIER_CONFIGS;

export const TOKEN_PACKAGES = [
  {
    id: 'spark',
    stripePriceId: 'price_1SjqQsGg8RUnSFObmCiJWcDY',
    name: 'Spark Pack',
    tokens: 50,
    price: 5.00,
    description: '50 Full Council Summonings.',
  },
  {
    id: 'ignition',
    stripePriceId: 'price_1SjqU8Gg8RUnSFOb7F5ad5c4',
    name: 'Ignition Pack',
    tokens: 150,
    price: 12.00,
    popular: true,
    description: '150 Deliberations.',
  },
  {
    id: 'supernova',
    stripePriceId: 'price_1SjqW0Gg8RUnSFOb3s7uxK3q',
    name: 'Supernova Pack',
    tokens: 500,
    price: 35.00,
    description: '500 High-Level Syntheses.',
  },
];

// CRITICAL EXPORTS FOR VERCEL BUILD
export const AI_TOKEN_COSTS = {
  'gpt-4': { provider: 'OpenAI', input: 0.00003, output: 0.00006, yourCostPerToken: 0.000045 },
  'claude-3': { provider: 'Anthropic', input: 0.000015, output: 0.000075, yourCostPerToken: 0.000045 },
  'gemini-pro': { provider: 'Google', input: 0.0000005, output: 0.0000015, yourCostPerToken: 0.000001 },
  'grok': { provider: 'xAI', input: 0.00001, output: 0.00002, yourCostPerToken: 0.000015 },
  'deepseek': { provider: 'DeepSeek', input: 0.00000014, output: 0.00000028, yourCostPerToken: 0.00000021 },
};

export function getTierColor(tier: UserTier): string {
  const colors = {
    free: 'bg-gray-500',
    basic: 'bg-blue-500',
    pro: 'bg-purple-500',
    admin: 'bg-red-500',
  };
  return colors[tier] || 'bg-gray-500';
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return tokens.toString();
}
