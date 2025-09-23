'use client'
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { RecentSales } from '@/features/overview/components/recent-sales';
import api from '@/lib/apiService';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function Sales() {
  const [user, setdata] = useState<any>();
  useEffect(() => {
    const load = async()=>{

      let {data} = await api.get('/users/wallet');
      // console.log(data);
      
      setdata(data.data);
    }
    load()
    
  }, [])
  
  return<div className='flex flex-1 flex-col space-y-2'>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Wallet balance</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {user?.balance || 0} ₹
              </CardTitle>
           
              {user?.points || 0} Points
           
            </CardHeader>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total payout</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
               {user?.lifetimeWithdrawn} ₹
              </CardTitle>
               Total payout so far
            </CardHeader>
          
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>total Leads</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {user?.totalLeads || 0} 
              </CardTitle>
             Total Leads generated so far
             
            </CardHeader>
            
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Conversion Rate</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {(user?.totalLeadsConv*100/(user?.totalLeads||1)).toFixed(2)}%
              </CardTitle>
              <div className='text-sm'>

                  Total {user?.totalLeadsConv} leads Converted
              </div>
               
             
            </CardHeader>
          </Card>
        </div>
        </div>

}
