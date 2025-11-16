import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wallet & Transactions | Raika Photography Affiliate',
  description: 'Manage your wallet, view transaction history, track earnings, withdrawals, and monitor your financial activity with Raika Photography affiliate program.',
  keywords: [
    'wallet',
    'transactions',
    'earnings',
    'withdrawals',
    'affiliate payments',
    'Raika Photography',
    'transaction history',
    'financial management'
  ],
  openGraph: {
    title: 'Wallet & Transactions | Raika Photography Affiliate',
    description: 'Manage your wallet, view transaction history, and track earnings with the Raika Photography affiliate program.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Wallet & Transactions | Raika Photography Affiliate',
    description: 'Track your earnings and manage transactions with the Raika Photography affiliate program.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

