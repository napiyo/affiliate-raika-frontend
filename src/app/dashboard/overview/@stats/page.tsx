'use client'
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { RecentSales } from '@/features/overview/components/recent-sales';
import { RecentSalesSkeleton } from '@/features/overview/components/recent-sales-skeleton';
import api from '@/lib/apiService';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function Sales() {
  const [user, setdata] = useState<any>();
  useEffect(() => {
    const load = async()=>{

      let {data} = await api.get('/users/wallet');
      setdata(data.data);
    }
    load()
    
  }, [])
  if(user)
  {
    return <RecentSalesSkeleton />
  }
  
  return<div className='flex flex-1 flex-col space-y-2 min-w-0 w-full'>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 min-w-0 w-full'>
          <Card className='@container/card min-w-0'>
            <CardHeader className='min-w-0'>
              <CardDescription className='break-words'>Total Wallet balance</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words'>
               {user?.balance || 0} ₹
              </CardTitle>
           
              <div className='break-words'>{user?.points || 0} Points</div>
           
            </CardHeader>
          </Card>
          <Card className='@container/card min-w-0'>
            <CardHeader className='min-w-0'>
              <CardDescription className='break-words'>Total payout</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words'>
               {user?.lifetimeWithdrawn} ₹
              </CardTitle>
               <div className='break-words'>Total payout so far</div>
            </CardHeader>
          
          </Card>
          <Card className='@container/card min-w-0'>
            <CardHeader className='min-w-0'>
              <CardDescription className='break-words'>total Leads</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words'>
                {user?.totalLeads || 0} 
              </CardTitle>
             <div className='break-words'>Total Leads generated so far</div>
             
            </CardHeader>
            
          </Card>
          <Card className='@container/card min-w-0'>
            <CardHeader className='min-w-0'>
              <CardDescription className='break-words'>Conversion Rate</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words'>
                {(user?.totalLeadsConv*100/(user?.totalLeads||1)).toFixed(2)}%
              </CardTitle>
              <div className='text-sm break-words'>

                  Total {user?.totalLeadsConv} leads Converted
              </div>
               
             
            </CardHeader>
          </Card>
        </div>
        </div>

}
