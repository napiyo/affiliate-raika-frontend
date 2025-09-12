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
  // ... keep your sample data as fallback
];

const chartConfig = {
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

export default function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('leads');

  const [isClient, setIsClient] = React.useState(false);
  const [chartData, setChartData] = React.useState(samplechartData);
  const [totals, setTotals] = React.useState({totalLeads: 0, totalConverted: 0});
   
  React.useEffect(() => {
    setIsClient(true);
    const leadData = async () => {
      try {
        const res = await api.get('/dashboard/leadsOverview');
        
        // Transform the API data to match expected format
        const transformedData = res.data.data.map((item:{date:string,totalLeads:number,leadsConv:number}) => ({
          date: item?.date,
          leads: item?.totalLeads, // Map totalLeads to leads
          leadsConv: item?.leadsConv
        }));
        
        setChartData(transformedData);
        setTotals({
          totalLeads: res.data?.totals?.totalLeads || 0,
          totalConverted: res.data?.totals?.totalConverted || 0
        });
        
      } catch (err) {
        // console.log(err);
        setActiveChart('error');
      }
    };
    leadData();
  }, []);

  React.useEffect(() => {
    if (activeChart === 'error') {
      throw new Error('Oops failed to load overview');
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
                  {key === 'leads' ? totals.totalLeads : totals.totalConverted}
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
              left: 0, // Reduced from 12 to 0
              right: 12,
              top: 5,
              bottom: 5
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
            <YAxis 
              allowDecimals={false} 
              domain={[0, 'dataMax + 1']} // Add +1 to show zero values
              tickLine={false}
              axisLine={false}
              width={40} // Set fixed width to control spacing
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  hideLabel={false}
                  formatter={(value, name) => [
                    value," ",
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
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
              minPointSize={2} // Minimum height for zero values
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}