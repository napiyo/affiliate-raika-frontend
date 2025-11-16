import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Raika Photography Affiliate',
  description: 'Manage your affiliate profile, view account information, banking details, referral code, and referral link. Update your profile settings for the Raika Photography affiliate program.',
  keywords: [
    'affiliate profile',
    'account settings',
    'referral code',
    'referral link',
    'banking details',
    'Raika Photography',
    'profile management',
    'affiliate account'
  ],
  openGraph: {
    title: 'Profile | Raika Photography Affiliate',
    description: 'Manage your affiliate profile, view account information, and access your referral code and link.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Profile | Raika Photography Affiliate',
    description: 'Manage your affiliate profile and access your referral information.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

