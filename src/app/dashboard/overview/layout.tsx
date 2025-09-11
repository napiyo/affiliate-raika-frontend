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
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

       {stats}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
         <div className='col-span-8'>{<WalletChart />}</div>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* sales arallel routes */}
            {sales}
          </div>
          {/* <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div> */}
        </div>
          <TopLeadsUsers/>
      </div>
    </PageContainer>
  );
}
