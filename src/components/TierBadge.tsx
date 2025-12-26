interface TierBadgeProps {
  tier: 'free' | 'basic' | 'pro' | 'enterprise' | string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const tierConfig = {
    free: {
      label: 'Free',
      bg: 'bg-gray-800',
      text: 'text-gray-300',
      border: 'border-gray-700'
    },
    basic: {
      label: 'Basic',
      bg: 'bg-blue-900/30',
      text: 'text-blue-400',
      border: 'border-blue-800'
    },
    pro: {
      label: 'Pro',
      bg: 'bg-purple-900/30',
      text: 'text-purple-400',
      border: 'border-purple-800'
    },
    enterprise: {
      label: 'Enterprise',
      bg: 'bg-gradient-to-r from-purple-900/30 to-pink-900/30',
      text: 'text-pink-400',
      border: 'border-pink-800'
    }
  };

  const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.basic;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`
      ${config.bg} ${config.text} ${sizeClasses[size]}
      border ${config.border} rounded-full font-medium inline-flex items-center justify-center
    `}>
      {config.label}
    </span>
  );
}
