import type { Metadata } from 'next';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import api from '@/lib/apiService';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import WalletChart from '../wallet/@earningOverivew/page';
import { TopLeadsUsers } from '@/features/overview/components/top-users';
import ReferralBanner from '@/components/refer-now-banner';

export const metadata: Metadata = {
  title: 'Dashboard Overview | Raika Photography Affiliate',
  description: 'View your affiliate dashboard with comprehensive analytics, earnings overview, referral statistics, and performance metrics. Track your success with Raika Photography affiliate program.',
  keywords: [
    'affiliate dashboard',
    'analytics',
    'earnings overview',
    'referral statistics',
    'performance metrics',
    'Raika Photography',
    'affiliate analytics',
    'dashboard overview'
  ],
  openGraph: {
    title: 'Dashboard Overview | Raika Photography Affiliate',
    description: 'View your affiliate dashboard with comprehensive analytics, earnings overview, and referral statistics.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Dashboard Overview | Raika Photography Affiliate',
    description: 'Track your affiliate performance with comprehensive analytics and earnings overview.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
  stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  stats: React.ReactNode;
}) 
    
{


  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2 min-w-0 w-full overflow-x-hidden'>
           <ReferralBanner />
        <div className='flex items-center justify-between space-y-2 min-w-0'>
          <h2 className='text-2xl font-bold tracking-tight break-words'>
            Hi, Welcome back 👋
          </h2>
        </div>

       <div className='min-w-0 w-full'>{stats}</div>
       <div className="space-y-6 min-w-0 w-full">
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 min-w-0 w-full">
    {/* Full width chart */}
    <div className="col-span-7 min-w-0 w-full">
      <WalletChart />
    </div>

    {/* bar_stats + sales row */}
    <div className="col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0 w-full">
      <div className='min-w-0'>{bar_stats}</div>
      <div className='min-w-0'>{sales}</div>
    </div>
</div>
</div>
    {/* Uncomment for other charts */}
    {/* <div className="col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>{area_stats}</div>
      <div>{pie_stats}</div>
    </div> */}
  

          <div className='min-w-0 w-full'><TopLeadsUsers/></div>
      </div>
    </PageContainer>
  );
}
