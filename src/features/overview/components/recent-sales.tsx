'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/apiService';
import { TRANSACTIONS_ENUM } from '@/types/user';
import { useEffect, useState } from 'react';
import { RecentSalesSkeleton } from './recent-sales-skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const sampleTransaction = [
  {
    "_id": "68c1d6e10ad427fb83bfb08b",
    "user": "68bc82fd402e8c8bfafe37cf",
    "type": "WITHDRAWAL",
    "amount": 666,
    "reference": "na",
    "txnId": "37059e5a5a0c9bb4",
    "comment": "na",
    "createdAt": "2025-09-10T19:52:01.008Z",
    "updatedAt": "2025-09-10T19:52:01.008Z",
    "__v": 0
}
];

export function RecentSales() {
  const [transactionData, setTransactionData] = useState(sampleTransaction)
  const [Loading, setLoading] = useState(true)
  useEffect(() => {
      const load = async()=>{
        try{
            const res = await api.get('/dashboard/lastTransactions')
            setTransactionData(res.data.data)
            
          }
          catch(err:any)
          {
            // throw Error("opps failed to load")
            toast.error(err.message)
          }
          finally
          {
            setLoading(false)
          }
      }
      load()
  }, [])
  
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your most recent Transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          { Loading? <RecentSalesSkeleton />:transactionData.map((trans, index) => (
             

            <div key={index} className='flex items-center'>
              {/* <Avatar className='h-9 w-9'>
                <AvatarImage src={sale.avatar} alt='Avatar' />
                <AvatarFallback>{sale.fallback}</AvatarFallback>
                </Avatar> */}
              <div className='ml-4 space-y-1'>
                <Badge className={`text-xs leading-none font-medium ${trans.type == TRANSACTIONS_ENUM.CREDIT? 'bg-primary text-accent-foreground':'bg-accent-foreground text-accent'}`}>{trans.type}</Badge>
                <p className='text-muted-foreground text-sm truncate'>{trans.comment}</p>
              </div>
              <div className={`ml-auto font-medium ${(trans.type == TRANSACTIONS_ENUM.CREDIT)?'text-green-500':''}`}>{trans.amount} ₹</div>
            
            </div>
              

          ))}
        </div>
      </CardContent>
    </Card>
  );
}
