import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketing Materials | Raika Photography',
  description: 'Browse and download approved marketing materials, brand assets, and promotional content for Raika Photography affiliate program. Access images, videos, and marketing resources.',
  keywords: [
    'marketing materials',
    'brand assets',
    'promotional content',
    'affiliate resources',
    'Raika Photography',
    'marketing assets',
    'brand resources',
    'download materials'
  ],
  openGraph: {
    title: 'Marketing Materials | Raika Photography',
    description: 'Browse and download approved marketing materials and brand assets for the Raika Photography affiliate program.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Marketing Materials | Raika Photography',
    description: 'Access marketing materials and brand assets for the Raika Photography affiliate program.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

