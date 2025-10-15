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
      <div className='flex flex-1 flex-col space-y-2'>
           <ReferralBanner />
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

       {stats}
       <div className="space-y-6">
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
    {/* Full width chart */}
    <div className="col-span-7">
      <WalletChart />
    </div>

    {/* bar_stats + sales row */}
    <div className="col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>{bar_stats}</div>
      <div>{sales}</div>
    </div>

    {/* Uncomment for other charts */}
    {/* <div className="col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>{area_stats}</div>
      <div>{pie_stats}</div>
    </div> */}
  </div>

  <TopLeadsUsers />
</div>

          <TopLeadsUsers/>
      </div>
    </PageContainer>
  );
}
