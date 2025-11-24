'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/apiService";

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';


export default function WalletChart({id}:{id?:String | undefined}) {
  const [chartData, setData] = useState([]);

  useEffect(() => {
    const getData = async()=>{

      const resChart = await api.post('dashboard/earningOverview',{userId:id});
      setData(resChart.data.data)
    }
    getData()
  }, []);



// const chartData = [
//   { month: 'January', desktop: 186, mobile: 80 },
//   { month: 'February', desktop: 305, mobile: 200 },
//   { month: 'March', desktop: 237, mobile: 120 },
//   { month: 'April', desktop: 73, mobile: 190 },
//   { month: 'May', desktop: 209, mobile: 130 },
//   { month: 'June', desktop: 214, mobile: 140 }
// ];

const chartConfig = {
  credit: {
    label: 'Commission',
    color: 'var(--primary)'
  },
  points: {
    label: 'Points',
    color: 'var(--primary-foreground)'
  }
} satisfies ChartConfig;
  return (
    <Card className='@container/card max-w-full w-full min-w-0'>
      <CardHeader className="min-w-0">
        <CardTitle className="break-words">Earning Overview</CardTitle>
        <CardDescription className="break-words">
          Showing total earning for the last  month
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6 min-w-0 w-full'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillCommission' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-credit)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-credit)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillPoints' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-points)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-points)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='credit'
              type='natural'
              fill='url(#fillCommission)'
              stroke='var(--color-credit)'
              stackId='a'
            />
            <Area
              dataKey='points'
              type='natural'
              fill='url(#fillPoints)'
              stroke='var(--color-points)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
           
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              last 30 days
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
