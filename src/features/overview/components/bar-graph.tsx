'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import api from '@/lib/apiService';

export const description = 'An interactive bar chart';

const samplechartData = [
  { date: '2024-04-01', leads: 222, leadsConv: 150 },
  { date: '2024-04-02', leads: 97, leadsConv: 180 },
  { date: '2024-04-03', leads: 167, leadsConv: 120 },
  { date: '2024-04-04', leads: 242, leadsConv: 260 },
  { date: '2024-04-05', leads: 373, leadsConv: 290 },
  { date: '2024-04-06', leads: 301, leadsConv: 340 },
  { date: '2024-04-07', leads: 245, leadsConv: 180 },
  { date: '2024-04-08', leads: 409, leadsConv: 320 },
  { date: '2024-04-09', leads: 59, leadsConv: 110 },
  { date: '2024-04-10', leads: 261, leadsConv: 190 },
  { date: '2024-04-11', leads: 327, leadsConv: 350 },
  { date: '2024-04-12', leads: 292, leadsConv: 210 },
  { date: '2024-04-13', leads: 342, leadsConv: 380 },
  { date: '2024-04-14', leads: 137, leadsConv: 220 },
  { date: '2024-04-15', leads: 120, leadsConv: 170 },
  { date: '2024-04-16', leads: 138, leadsConv: 190 },
  { date: '2024-04-17', leads: 446, leadsConv: 360 },
  { date: '2024-04-18', leads: 364, leadsConv: 410 },
  { date: '2024-04-19', leads: 243, leadsConv: 180 },
  { date: '2024-04-20', leads: 89, leadsConv: 150 },
  { date: '2024-04-21', leads: 137, leadsConv: 200 },
  { date: '2024-04-22', leads: 224, leadsConv: 170 },
  { date: '2024-04-23', leads: 138, leadsConv: 230 },
  { date: '2024-04-24', leads: 387, leadsConv: 290 },
  { date: '2024-04-25', leads: 215, leadsConv: 250 },
  { date: '2024-04-26', leads: 75, leadsConv: 130 },
  { date: '2024-04-27', leads: 383, leadsConv: 420 },
  { date: '2024-04-28', leads: 122, leadsConv: 180 },
  { date: '2024-04-29', leads: 315, leadsConv: 240 },
  { date: '2024-04-30', leads: 454, leadsConv: 380 },
  { date: '2024-05-01', leads: 165, leadsConv: 220 },
  { date: '2024-05-02', leads: 293, leadsConv: 310 },
  { date: '2024-05-03', leads: 247, leadsConv: 190 },
  { date: '2024-05-04', leads: 385, leadsConv: 420 },
  { date: '2024-05-05', leads: 481, leadsConv: 390 },
  { date: '2024-05-06', leads: 498, leadsConv: 520 },
  { date: '2024-05-07', leads: 388, leadsConv: 300 },
  { date: '2024-05-08', leads: 149, leadsConv: 210 },
  { date: '2024-05-09', leads: 227, leadsConv: 180 },
  { date: '2024-05-10', leads: 293, leadsConv: 330 },
  { date: '2024-05-11', leads: 335, leadsConv: 270 },
  { date: '2024-05-12', leads: 197, leadsConv: 240 },
  { date: '2024-05-13', leads: 197, leadsConv: 160 },
  { date: '2024-05-14', leads: 448, leadsConv: 490 },
  { date: '2024-05-15', leads: 473, leadsConv: 380 },
  { date: '2024-05-16', leads: 338, leadsConv: 400 },
  { date: '2024-05-17', leads: 499, leadsConv: 420 },
  { date: '2024-05-18', leads: 315, leadsConv: 350 },
  { date: '2024-05-19', leads: 235, leadsConv: 180 },
  { date: '2024-05-20', leads: 177, leadsConv: 230 },
  { date: '2024-05-21', leads: 82, leadsConv: 140 },
  { date: '2024-05-22', leads: 81, leadsConv: 120 },
  { date: '2024-05-23', leads: 252, leadsConv: 290 },
  { date: '2024-05-24', leads: 294, leadsConv: 220 },
  { date: '2024-05-25', leads: 201, leadsConv: 250 },
  { date: '2024-05-26', leads: 213, leadsConv: 170 },
  { date: '2024-05-27', leads: 420, leadsConv: 460 },
  { date: '2024-05-28', leads: 233, leadsConv: 190 },
  { date: '2024-05-29', leads: 78, leadsConv: 130 },
  { date: '2024-05-30', leads: 340, leadsConv: 280 },
  { date: '2024-05-31', leads: 178, leadsConv: 230 },
  { date: '2024-06-01', leads: 178, leadsConv: 200 },
  { date: '2024-06-02', leads: 470, leadsConv: 410 },
  { date: '2024-06-03', leads: 103, leadsConv: 160 },
  { date: '2024-06-04', leads: 439, leadsConv: 380 },
  { date: '2024-06-05', leads: 88, leadsConv: 140 },
  { date: '2024-06-06', leads: 294, leadsConv: 250 },
  { date: '2024-06-07', leads: 323, leadsConv: 370 },
  { date: '2024-06-08', leads: 385, leadsConv: 320 },
  { date: '2024-06-09', leads: 438, leadsConv: 480 },
  { date: '2024-06-10', leads: 155, leadsConv: 200 },
  { date: '2024-06-11', leads: 92, leadsConv: 150 },
  { date: '2024-06-12', leads: 492, leadsConv: 420 },
  { date: '2024-06-13', leads: 81, leadsConv: 130 },
  { date: '2024-06-14', leads: 426, leadsConv: 380 },
  { date: '2024-06-15', leads: 307, leadsConv: 350 },
  { date: '2024-06-16', leads: 371, leadsConv: 310 },
  { date: '2024-06-17', leads: 475, leadsConv: 520 },
  { date: '2024-06-18', leads: 107, leadsConv: 170 },
  { date: '2024-06-19', leads: 341, leadsConv: 290 },
  { date: '2024-06-20', leads: 408, leadsConv: 450 },
  { date: '2024-06-21', leads: 169, leadsConv: 210 },
  { date: '2024-06-22', leads: 317, leadsConv: 270 },
  { date: '2024-06-23', leads: 480, leadsConv: 530 },
  { date: '2024-06-24', leads: 132, leadsConv: 180 },
  { date: '2024-06-25', leads: 141, leadsConv: 190 },
  { date: '2024-06-26', leads: 434, leadsConv: 380 },
  { date: '2024-06-27', leads: 448, leadsConv: 490 },
  { date: '2024-06-28', leads: 149, leadsConv: 200 },
  { date: '2024-06-29', leads: 103, leadsConv: 160 },
  { date: '2024-06-30', leads: 446, leadsConv: 400 }
];

const chartConfig = {
  // views: {
  //   label: 'Page Views'
  // },
  leads: {
    label: 'Leads',
    color: 'var(--primary)'
  },
  leadsConv: {
    label: 'Converted Leads',
    color: 'var(--primary)'
  },
  error: {
    label: 'Error',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('leads');

  // const total = React.useMemo(
  //   () => ({
  //     leads: chartData.reduce((acc, curr) => acc + curr.leads, 0),
  //     leadsConv: chartData.reduce((acc, curr) => acc + curr.leadsConv, 0)
  //   }),
  //   []
  // );

  const [isClient, setIsClient] = React.useState(false);
  const [chartData, setChartData] = React.useState(samplechartData);
  const [totals, setTotals] = React.useState({totalLeads:0,totalConverted:0});
   
  React.useEffect(() => {
    setIsClient(true);
     const leadData = async()=>{
      try{

        const res  = await api.get('/dashboard/leadsOverview');
        setChartData(res.data.data)
        // log
        setTotals({totalLeads:res.data?.totals?.totalLeads || 0,totalConverted:res.data?.totals?.totalConverted || 0})
        
      }
      catch(err){
        setActiveChart('error')
      }
     }
     leadData();
  }, []);

  React.useEffect(() => {
    if (activeChart === 'error') {
      throw new Error('Opps failed to lead overview');
    }
  }, [activeChart]);

  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Leads Overview</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Total Leads generated in last 30 days
            </span>
            <span className='@[540px]/card:hidden'>Last 30 days</span>
          </CardDescription>
        </div>
        <div className='flex'>
          {['leads', 'leadsConv'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            // if (!chart ||  === 0) return null;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg leading-none font-bold sm:text-3xl'>
                  {key=='leads'?totals.totalLeads:totals.totalConverted}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
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
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
                <YAxis allowDecimals={false} domain={[0, 'dataMax']} />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='leads'
                   defaultValue={0}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill='url(#fillBar)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
