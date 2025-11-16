import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referrals Management | Raika Photography',
  description: 'Manage and track your referrals and leads. View referral status, add new referrals, and monitor your commission earnings with Raika Photography affiliate program.',
  keywords: [
    'referrals',
    'leads management',
    'affiliate program',
    'Raika Photography',
    'referral tracking',
    'commission tracking',
    'photography referrals'
  ],
  openGraph: {
    title: 'Referrals Management | Raika Photography',
    description: 'Manage and track your referrals and leads. View referral status, add new referrals, and monitor your commission earnings.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Referrals Management | Raika Photography',
    description: 'Manage and track your referrals and leads with Raika Photography affiliate program.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

