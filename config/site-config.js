/**
 * PolyNotice Site Configuration
 * Central configuration for the landing page and waitlist
 */

const siteConfig = {
  // Site Metadata
  site: {
    name: 'PolyNotice',
    description:
      'Prediction market monitoring, intelligence, and automation platform',
    url: 'https://polynotice.io',
    logo: '/assets/logo.png',
  },

  // Brand Colors
  colors: {
    primary: '#2F5CFF',
    dark: '#000',
    light: '#fff',
    accent: '#aaa',
    grid: '#181818',
  },

  // Social Links
  social: {
    twitter: 'https://x.com/PolyNotice',
    email: 'hello@polynotice.io',
    security: 'security@polynotice.io',
    legal: 'legal@polynotice.io',
  },

  // Feature Flags
  features: {
    waitlist: true,
    automation: false,
    premiumTier: false,
  },

  // Navigation
  nav: [
    { label: 'Docs', href: '/docs/01-overview.md' },
    { label: 'FAQ', href: '/docs/08-faq.md' },
    { label: 'Status', href: 'https://status.polynotice.io' },
  ],

  // CTA Buttons
  buttons: {
    primary: {
      text: 'Get Started',
      action: 'join-waitlist',
    },
    secondary: {
      text: 'Learn More',
      action: 'scroll-to-features',
    },
  },

  // API Endpoints
  api: {
    subscribe: '/api/subscribe',
    status: 'https://status.polynotice.io/api/v1/status',
  },

  // Feature Tiers
  tiers: {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Price alerts',
        'Trade monitoring',
        'Account monitoring',
        'Portfolio visibility',
        'Multi-condition alerts',
        'Event impact alerts',
        'Basic conviction heatmap',
      ],
    },
    premium: {
      name: 'Premium',
      price: 'TBD',
      features: [
        'Risk management (TP/SL)',
        'Non-custodial automation',
        'Profit leader alerts',
        'AI-assisted optimization',
        'Market opportunity scanner',
        'Advanced conviction filters',
        'Priority support',
      ],
    },
    premiumPlus: {
      name: 'Premium+',
      price: 'TBD',
      features: [
        'Trade copying / smart mirroring',
        'Reward-farming AI agents',
        'Social / community signals',
        'Cross-market monitoring',
        'Whale-mode conviction signals',
        'Custom alert rules',
        'API access',
        'Dedicated account manager',
      ],
    },
  },

  // Development
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default siteConfig;
