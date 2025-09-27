'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageContainer from '@/components/layout/page-container';
import api from '@/lib/apiService';
import { toast } from 'sonner';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ProgressIndicator } from '@radix-ui/react-progress';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { flushSync } from 'react-dom';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Lead } from '@/types/user';

// Interfaces


interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LeadForm {
  name: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  requirements: string;
}

interface Filters {
  search: string;
  status: string;
  timeRange: string;
  customStartDate?: Date;
  customEndDate?: Date;
}
const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
)
const LeadsPage = () => {
  // State management
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  });
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    timeRange: 'all',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    requirements: '',
  });

  // Status colors and labels
  const statusConfig = {
    New: { label: 'New', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    InProgress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    ShootCompleted: { label: 'Shoot Completed', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    Lost: { label: 'Lost', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  };
  
  const [cache, setCache] = useState<Record<number, {leads:Lead[],pagination:{
    page: number,
    limit: number,
    total: number,
    totalPages: number,
  }}>>({});
  // Fetch leads from API
  const fetchLeads = async (clearSearch :boolean = false) => {
    
  const page = pagination.page;
  const hasAnyFilter =!(filters.timeRange === 'all' && filters.status == "all" && (!filters.search)  )
    
    setLoading(true);
    try {
     let query:any = {};


      // Add time range filtering
      if (filters.timeRange !== 'all') {
        const now = new Date();
        let startDate, endDate;

        switch (filters.timeRange) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            endDate = new Date(now.setHours(23, 59, 59, 999));
            break;
          case 'week':
            startDate = startOfWeek(now);
            endDate = endOfWeek(now);
            break;
          case 'month':
            startDate = subDays(now, 30);
            endDate = now;
            break;
          case 'custom':
            if (filters.customStartDate && filters.customEndDate) {
              startDate = filters.customStartDate;
              endDate = filters.customEndDate;
            }
            break;
        }
       if(startDate && endDate)
       {

         query.created_on = {from:startDate.getTime() ,to:endDate.getTime()};
      
        
        }

       
      
      }
      // query.page = pagination.page -1;
      // query.limit = pagination.limit;
      if(filters.search && !clearSearch ) query.name = filters.search.trim()
      if(filters.status!=='all') query.status = filters.status=='ShootCompleted'?"Shoot Completed":filters.status;
        
    
      let chartSource;
      
      if ( !hasAnyFilter && cache[page] && cache[page].leads && pagination.limit == cache[page].leads.length) {
        // console.log("used cache");
        
        setLeads(cache[page].leads);
        chartSource = cache[page].leads;
        setPagination(()=>({...cache[page].pagination,page}))
        
      }
      else{
        // console.log("calling api");
        
        // const response = await fetch(`/api/leads?${params}`);
        const apiPromise =  api.post('/leads/search',{query,page:pagination.page-1,limit:pagination.limit});
        
        toast.promise(apiPromise, {
          loading: 'Getting your data...',
          error: 'Opps, failed.',
        });
        const response = await apiPromise;
        const {data} = response.data;
        // const data: LeadsResponse = await response.json();
        
        
        
        setLeads(data.data);
        if(!hasAnyFilter)
          {
            // console.log('saved cache',query);
            
            setCache((prev) => ({ ...prev, [page]: {leads:data.data,pagination:{
              page: data.skip/data.limit + 1,
              limit: data.limit,
              total: data.total_count,
              totalPages: Math.ceil(data.total_count/data.limit),
            }} }));
          }
          setPagination({
            page: data.skip/data.limit + 1,
            limit: data.limit,
            total: data.total_count,
            totalPages: Math.ceil(data.total_count/data.limit),
          });
          chartSource = data.data;
        }
          // Generate chart data
          const statusCounts = Object.keys(statusConfig).reduce((acc, status) => {
            acc[status] = chartSource.filter((lead: Lead) => lead.status === status).length;
            return acc;
          }, {} as Record<string, number>);

      const chartData = Object.entries(statusCounts).map(([status, count]) => ({
        status: statusConfig[status as keyof typeof statusConfig].label,
        count,
        fill: getChartColor(status as keyof typeof statusConfig),
      }));
      
      setChartData(chartData);
    } catch (error) {
          // console.log(error);
          
    } finally {
      setLoading(false);
    }
  };

  const getChartColor = (status: keyof typeof statusConfig) => {
    const colorMap = {
      New: '#3b82f6',
      InProgress: '#eab308',
      ShootCompleted: '#22c55e',
      Lost: '#ef4444',
    };
    return colorMap[status];
  };

  // Search handler
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLeads();
  };
  // Search handler
  const handleClearSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLeads(true);
  };

  // Filter handlers
  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleTimeRangeFilter = (timeRange: string) => {
    setFilters(prev => ({ ...prev, timeRange }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Add lead handler
  const handleAddLead = async () => {
    try {
      const res = api.post('/leads/add',leadForm);
      toast.promise(res, {
        loading: 'Adding your data...',
        success:"Lead data Added"
      });
      await res;
    
        setIsModalOpen(false);
        setLeadForm({
          name: '',
          email: '',
          phone: '',
          alternatePhone: '',
          requirements: '',
        });
       
        // setLeads((prev)=>[...prev])
        // fetchLeads();
      
    } catch (error:any) {

      
          toast.error(error?.message)
    }
  };

 
  const searchParams = useSearchParams();
  useEffect(() => {
    const open = searchParams.get('refernow') === 'true';
    if(open)
    {
      setIsModalOpen(open);
    }
  }, [searchParams]);
  
  useEffect(() => {
    // if(loading) return;
    // if (filters.status !== 'all' || filters.timeRange !== 'all') {
      if(filters.timeRange =='custom' && (!filters.customEndDate || !filters.customEndDate))
      {
        return;
      }


      fetchLeads();
    // }
  }, [pagination.page, pagination.limit,filters.status, filters.timeRange, filters.customEndDate, filters.customEndDate]);

  return (
    <PageContainer >
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Referrals Management</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Refer Someone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Refer your friend</DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>Share the details of someone you’d like to refer. Our sales team will get in touch with them, and if they book a shoot with us, you’ll earn a commission."</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter lead name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alternatePhone">Alternate Phone</Label>
                <Input
                  id="alternatePhone"
                  value={leadForm.alternatePhone}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, alternatePhone: e.target.value }))}
                  placeholder="Enter alternate phone"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requirement">Requirement *</Label>
                <Input
                  id="requirement"
                  value={leadForm.requirements}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Enter requirement"
                />
              </div>
              <Button 
                onClick={handleAddLead}
                disabled={!leadForm.name || !leadForm.phone || !leadForm.requirements}
                className="w-full"
              >
                Refer now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>


      <Card>
      <CardHeader>
        <CardTitle>Referrals by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Leads",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-64 w-full"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={6}  maxBarSize={35} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-row justify-between">
            {/* Search */}
           
            <div className="md:col-span-1 w-xl">
              <Label htmlFor="search">Search</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="search"
                  placeholder="Search leads..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm"  disabled={!filters.search || loading}>
                 {loading ? <Spinner />:
                  <Search className="h-4 w-4" />
                 }
                </Button>
                {
                  !!filters.search && <Button onClick={()=>{
                    setFilters(prev => ({ ...prev, search: "" }));
                    handleClearSearch()

                   
           }} size="sm" disabled={loading}>
                 <Label>Clear</Label>
                </Button>
                }
              </div>
            </div>

            {/* Status Filter */}
            <div className='flex flex-row gap-4'>
            <div>
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={handleStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Range Filter */}
            <div>
              <Label>Time Range</Label>
              <Select value={filters.timeRange} onValueChange={handleTimeRangeFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {filters.timeRange === 'custom' && (
              <div>
                <Label>Custom Range</Label>
                <div className="flex gap-2 mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4" />
                        {filters.customStartDate && filters.customEndDate ? (
        <>
          {format(filters.customStartDate, "MMM d, yyyy")} –{" "}
          {format(filters.customEndDate, "MMM d, yyyy")}
        </>
      ) : filters.customStartDate ? (
        // when only "from" is picked
        format(filters.customStartDate, "MMM d, yyyy")
      ) : (
        <span className="text-muted-foreground">Pick a date range</span>
      )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={
                            {from: filters.customStartDate, to: filters.customEndDate }
                            
                        }
                        disabled={(date) => date > new Date()}
                        onSelect={(range) => {
              
                          
                          setFilters(prev => ({
                            ...prev,
                            customStartDate: range?.from,
                            customEndDate: range?.to,
                          }));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Referrals ({pagination.total})</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="limit" className="text-sm">Show:</Label>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => handleLimitChange(Number(value))}
              >
                <SelectTrigger className="w-20" id="limit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Table>

            <TableBody >
            
                      { Array.from({ length: 5 }).map((_, i) => (
                        
                        <TableRow key={i} className='flex'>
                           <TableCell className='flex-1'><Shimmer className="h-4" /></TableCell>
                           <TableCell className='flex-1/5'><Shimmer className="h-4 " /></TableCell>
                           <TableCell className='flex-1/5'><Shimmer className="h-4 flex-1/6" /></TableCell>
                           <TableCell className='flex-1/6'><Shimmer className="h-4 w-20" /></TableCell>
                           <TableCell><Shimmer className="h-4 flex-1" /></TableCell>
                           <TableCell><Shimmer className="h-4 w-16" /></TableCell>
                         </TableRow>
                       ))}
                         </TableBody>
                       </Table>
                  
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">Requirement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{lead.email || '-'}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell className="hidden lg:table-cell max-w-xs truncate">
                          {lead.requirement}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[lead.status].color}>
                            {statusConfig[lead.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {format(new Date(lead.createdOn), 'MMM dd, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className='h-12 w-full flex justify-center items-center align-middle'>

                    {leads.length==0 && <Label>No Data - try to remove filters</Label>}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
    </PageContainer>
  );
};

export default LeadsPage;