'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CalendarIcon, DollarSign, TrendingUp, TrendingDown, Search, Filter, ChevronRight, ChevronLeft, IndianRupee, IndianRupeeIcon, UserIcon, Magnet, MoreVertical } from 'lucide-react'
import PageContainer from '@/components/layout/page-container'
import { Role_ENUM, sampleUser, TransactionInterface, TRANSACTIONS_ENUM, TRANSACTIONS_TYPES, TransactionType, User, USER_ROLE } from '@/types/user'
import api from '@/lib/apiService'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { endOfWeek, format, startOfWeek, subDays } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/userStore'
import Link from 'next/link'
import {  useSearchParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import WalletChart from './@earningOverivew/page'
import InfoTooltip from '@/components/ui/infoTooltip'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'


// Types


interface EarningsData {
  date: string
  earnings: number
}


interface Filters {
    search: string;
    timeRange: string;
    type:TransactionType|'all'
    customStartDate?: Date;
    customEndDate?: Date;
  }
export default function WalletTransactionsPage() {
 const params = useSearchParams();
let id = params.get('id') || undefined;
const searchID = params.get('leadId');
if(!id || id == null) {
  id = undefined;
}

const [transactions, setTransactions] = useState<TransactionInterface[]>([])
const [earningsData, setEarningsData] = useState<EarningsData[]>([])
const [loading, setLoading] = useState(true)
const [transactionsLoading, setTransactionsLoading] = useState(false)
const [earningsLoading, setEarningsLoading] = useState(false)
const [walletSummary, setWalletSummary] = useState<User>(sampleUser)
const [initialLoaded, setinitialLoaded] = useState(false)
const [error, setError] = useState<string | null>(null)
const [filters, setFilters] = useState<Filters>({ 
  search: '',
  type:'all',
  timeRange: 'all',
})
const [pagination, setPagination] = useState({
  page: 1,
  limit: 100,
  total: 0,
  totalPages: 0,
});
const [isSearchMode, setIsSearchMode] = useState(false);
const {user} = useAuthStore()
const abortControllerRef = useRef<AbortController | null>(null);
const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

// Fetch transactions with proper error handling and cancellation
const fetchTransactions = useCallback(async (
  pageNum: number = 1,
  filtersOverride?: Filters,
  searchModeOverride?: boolean
) => {
  // Cancel previous request
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  abortControllerRef.current = new AbortController();

  setTransactionsLoading(true);
  setError(null);

  try {
    const query: any = {
      page: pageNum,
      limit: 100,
      id
    };

    const currentSearchMode = searchModeOverride ?? isSearchMode;
    const currentFilters = filtersOverride ?? filters;

    // Build query based on mode
    if (currentSearchMode && currentFilters.search?.trim()) {
      query.search = currentFilters.search.trim();
    } else if (!currentSearchMode) {
      // Apply filters only when not searching
      if (currentFilters.timeRange && currentFilters.timeRange !== 'all') {
        const now = new Date();
        let startDate, endDate;

        switch (currentFilters.timeRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
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
            if (currentFilters.customStartDate && currentFilters.customEndDate) {
              startDate = new Date(currentFilters.customStartDate);
              endDate = new Date(currentFilters.customEndDate);
            }
            break;
        }
        
        if (startDate && endDate) {
          query.from = startDate.getTime();
          query.to = endDate.getTime();
        }
      }

      if (currentFilters.type && currentFilters.type !== 'all') {
        query.type = currentFilters.type;
      }
    }

    const response = await api.post(`/users/mytrasaction`, query, {
      signal: abortControllerRef.current.signal
    });

    const { data } = response.data;
    if (!data) throw new Error('No data returned from API');

    setTransactions(data.transactions || []);
    setPagination({
      page: data.page || pageNum,
      limit: data.limit || 100,
      total: data.total || 0,
      totalPages: Math.ceil((data.total || 0) / (data.limit || 100))
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Request cancelled');
      return;
    }
    
    const errorMsg = error?.response?.data?.message || error?.message || 'Failed to fetch transactions';
    setError(errorMsg);
    toast.error(errorMsg);
    setTransactions([]);
  } finally {
    setTransactionsLoading(false);
  }
}, [isSearchMode, filters, id]);

// Fetch wallet summary
const fetchWallet = useCallback(async () => {
  try {
    let url = "/users/wallet";
    if (id) {  
      url += `?id=${id}`;
    }
    const res = await api.get(url);
    if (res.data?.data) {
      setWalletSummary(res.data.data);
    }
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch wallet';
    toast.error(errorMsg);
  }
}, [id]);

// Initial load
useEffect(() => {
  let isMounted = true;

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await fetchWallet();

      if (!isMounted) return;

      if (searchID?.trim()) {
        setFilters(prev => ({ ...prev, search: searchID.trim() }));
        setIsSearchMode(true);
        await fetchTransactions(1, 
          { ...filters, search: searchID.trim() }, 
          true
        );
      } else {
        await fetchTransactions(1, filters, false);
      }
    } catch (err: any) {
      console.error('Initial load error:', err);
      if (isMounted) {
        setError('Failed to load initial data');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
        setinitialLoaded(true);
      }
    }
  };
  
  loadInitialData();

  return () => {
    isMounted = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, [searchID, id]);

// Handle pagination changes
useEffect(() => {
  if (!initialLoaded || isSearchMode || transactionsLoading) {
    return;
  }

  fetchTransactions(pagination.page);
}, [pagination.page, initialLoaded, isSearchMode, transactionsLoading, fetchTransactions]);

// Handle filter changes
useEffect(() => {
  if (!initialLoaded || isSearchMode) {
    return;
  }

  if (filters.timeRange === 'custom') {
    if (!filters.customStartDate || !filters.customEndDate) {
      return;
    }
  }

  setPagination(prev => ({ ...prev, page: 1 }));
  fetchTransactions(1);
}, [filters.type, filters.timeRange, filters.customStartDate, filters.customEndDate, initialLoaded, isSearchMode, fetchTransactions]);

// Handle search mode with debouncing
useEffect(() => {
  if (!initialLoaded) {
    return;
  }

  if (searchDebounceRef.current) {
    clearTimeout(searchDebounceRef.current);
  }

  if (!isSearchMode) {
    if (!filters.search?.trim()) {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchTransactions(1, filters, false);
    }
    return;
  }

  // Debounce search requests
  if (filters.search?.trim()) {
    searchDebounceRef.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchTransactions(1, filters, true);
    }, 300);
  }

  return () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
  };
}, [filters.search, isSearchMode, initialLoaded, fetchTransactions, filters]);

// Handle time range filter
const handleTimeRangeFilter = useCallback((timeRange: string) => {
  setIsSearchMode(false);
  setFilters(prev => ({ ...prev, timeRange, search: '' }));
  setPagination(prev => ({ ...prev, page: 1 }));
}, []);

// Handle type filter
const handleTypeFilter = useCallback((value: 'all' | TransactionType) => {
  setIsSearchMode(false);
  setFilters(prev => ({ ...prev, type: value, search: '' }));
  setPagination(prev => ({ ...prev, page: 1 }));
}, []);

// Handle search button click
const handleSearch = useCallback(() => {
  if (!filters.search?.trim()) {
    setIsSearchMode(false);
    return;
  }
  
  setIsSearchMode(true);
}, [filters.search]);

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
  };
}, []);
  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <PageContainer>
    <div className="w-full max-w-full min-w-0 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wallet & Transactions</h1>
          <p className="text-muted-foreground">Manage your finances and track transactions</p>
        </div>
        {/* <Button onClick={() => cache.clear()} variant="outline">
          Clear Cache
        </Button> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full min-w-0">
       

         <Card className='@container/card min-w-0'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {walletSummary.lifetimeEarnings.toFixed(2)}₹
            </div>
            <Separator className='my-1'/>
            <div className="text-xl font-bold text-accent-foreground flex items-center gap-2">
              {walletSummary.lifetimePointsEarnings.toFixed(2)} <Badge className='text-xs'>Points</Badge>
            </div>
          </CardContent>
        </Card>

         <Card className='@container/card min-w-0'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payout</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {walletSummary.lifetimeWithdrawn.toFixed(2)}₹
            </div>
            <Separator className='my-1'/>
            <div className="text-xl font-bold text-accent-foreground flex items-center gap-2">
              {walletSummary.lifetimePointsWithdrawn.toFixed(2)} <Badge className='text-xs'>Points</Badge>
            </div>
          </CardContent>
        </Card>
          <Card className='@container/card min-w-0'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Curent Balance</CardTitle>
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletSummary.balance.toFixed(2)}₹</div>
            <Separator className='my-1'/>
            <div className='flex justify-between'>

            <div className="text-xl font-bold text-accent-foreground flex items-center gap-2">
              {walletSummary.points.toFixed(2)} <Badge className='text-xs'>Points</Badge>
            </div>
            <InfoTooltip message='Points can not be encashed'/>
            </div>
          </CardContent>
        </Card>

         <Card className='@container/card min-w-0'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads Converted</CardTitle>
            <Magnet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletSummary.totalLeadsConv}</div>
            <Separator className='my-2' >

            </Separator>

            <p className="text-xs text-muted-foreground">{walletSummary.totalLeads} Total leads</p>
          </CardContent>
        </Card>
      </div>

     
       

      {/* Transactions Table */}
      {id&&
   

<Alert >
            <AlertTitle>  <Link href={`/dashboard/admin/users/${id}`}> showing result for user : <span className='underline'>{id}</span></Link></AlertTitle>
            </Alert>
    }
  
    <Alert >
           <AlertDescription>{"We do settlement on every friday, still if you want to withdraw your funds, you can reach out to us raikaphotography@gmail.com"}</AlertDescription>
          
            </Alert>
           
           
<div className='w-full max-w-full'>

    <WalletChart id={id}/>
</div>
    
    
       <Card className='@container/card min-w-0'>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View and filter your transaction history</CardDescription>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-full min-w-0 items-center justify-between">
            <div className="relative flex-1/3 flex flex-row gap-4 items-center ">
              <Search className="absolute left-3  h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters((prev)=>({...prev,search:e.target.value.trim()}))}
                className="pl-10"
                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
     <Button  size="sm"   disabled={!filters.search?.trim() || transactionsLoading} onClick={()=>handleSearch()}>
                     {loading ? <Spinner />:
                      <Search className="h-4 w-4" />
                     }
                    </Button>
            </div>
            <div className='flex flex-row gap-4 items-center justify-end flex-wrap'>
                
            
            <Select value={filters.type} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {TRANSACTIONS_TYPES.map((val, idx)=><SelectItem key={`${val}-${idx}-ttable`} value={val}>{val}</SelectItem>)}
              </SelectContent>
            </Select>
          
          {/* Time Range Filter */}
          <div>
              {/* <Label>Time Range</Label> */}
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
                {/* <Label>Custom Range</Label> */}
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
            </CardHeader>
                  <CardContent>
            {transactionsLoading ? (
              <TransactionsTableSkeleton />
            ) : transactions?.length > 0 ? (
              <>
                <div className="w-full overflow-x-auto hidden sm:block">
                  <div className="min-w-[1000px]">
                    <Table className='w-full'>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Transaction Id</TableHead>
                          <TableHead className="whitespace-nowrap">Type</TableHead>
                          <TableHead className="whitespace-nowrap">Amount</TableHead>
                          <TableHead className="whitespace-nowrap">Reference</TableHead>
                          <TableHead className="whitespace-nowrap">Comment</TableHead>
                          <TableHead className="whitespace-nowrap">Date</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.txnId}>
                            <TableCell className="font-medium">
                              <div className="min-w-[120px] max-w-[150px] truncate">
                                {transaction.txnId}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={transaction.type === 'CREDIT' ? 'default' : 'secondary'}>
                                {transaction.type}
                              </Badge>
                            </TableCell>
                            <TableCell className={(transaction.type === TRANSACTIONS_ENUM.CREDIT || transaction.type === TRANSACTIONS_ENUM.LOYALITY_POINT_CREDIT) ? 'text-green-600' : 'text-red-600'}>
                              <div className="min-w-[100px] whitespace-nowrap">
                                {(transaction.type === TRANSACTIONS_ENUM.CREDIT || transaction.type === TRANSACTIONS_ENUM.LOYALITY_POINT_CREDIT) ? '+' : '-'}{transaction.amount.toFixed(2)} ₹
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="min-w-[120px] max-w-[180px] truncate">
                                {transaction.reference}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="min-w-[150px] max-w-[250px] truncate">
                                {transaction.comment}
                              </div>
                            </TableCell>
                            <TableCell className="capitalize whitespace-nowrap">
                              <div className="min-w-[150px]">
                                {format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={transaction.status === 'SUCCESS' ? 'default' : 'secondary'}>
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {user?.role === Role_ENUM.ADMIN && (
                                    <>
                                      <DropdownMenuItem asChild>
                                        <Link href={`admin/users/${transaction.user}`}>
                                          View User
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem asChild>
                                        <Link href={`admin/users/${transaction.createdBy}`}>
                                          View Creator
                                        </Link>
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <TransactionCards transactions={transactions} user={user} />

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="limit-wallet" className="text-sm">Show:</Label>
                    <Select
                      value={pagination.limit.toString()}
                      onValueChange={(value) => setPagination((prev) => ({ ...prev, limit: Number(value), page: 1 }))}
                    >
                      <SelectTrigger className="w-20" id="limit-wallet">
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
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
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
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Alert>
                <AlertDescription>
                  No transactions found matching your filters. Try adjusting your search criteria.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
      </Card>
    </div>
    </PageContainer>
  )
}

// Loading Skeletons
function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className='@container/card min-w-0'>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>

       <Card className='@container/card min-w-0'>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <TransactionsTableSkeleton />
        </CardContent>
      </Card>
    </div>
  )
}

function TransactionsTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}


type TransactionCardProps = {
  transactions: any[];
  user: any;
};

export function TransactionCards({ transactions, user }: TransactionCardProps) {
  const [selectedTxn, setSelectedTxn] = React.useState<any>(null);
  const [openSheet, setOpenSheet] = React.useState(false);

  const handleCardClick = (txn: any) => {
    setSelectedTxn(txn);
    setOpenSheet(true);
  };

  return (
   <>
      {/* Card list */}
      <div className="flex flex-col gap-3 sm:hidden">
        {transactions.map((txn) => (
          <Card
            key={txn.txnId}
            className="p-4 flex flex-col cursor-pointer shadow-sm hover:shadow-md transition-all gap-1"
            onClick={() => handleCardClick(txn)}
          >
            <div className="text-lg font-bold tracking-tight">
              <span
                className={
                  txn.type === 'CREDIT' || txn.type === 'LOYALITY_POINT_CREDIT'
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {(txn.type === 'CREDIT' || txn.type === 'LOYALITY_POINT_CREDIT' ? '+' : '-') +
                  txn.amount.toFixed(2)}{' '}
                ₹
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
              {txn.type}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="p-6 space-y-4">
          {selectedTxn && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold">
                  Transaction Details
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-5 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">
                    Transaction ID
                  </div>
                  <div className="font-medium">{selectedTxn.txnId}</div>
                </div>

                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">
                    Type
                  </div>
                  <Badge
                    variant={
                      selectedTxn.type === 'CREDIT' ? 'default' : 'secondary'
                    }
                  >
                    {selectedTxn.type}
                  </Badge>
                </div>

                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">
                    Amount
                  </div>
                  <div
                    className={`font-semibold text-base ${
                      selectedTxn.type === 'CREDIT' ||
                      selectedTxn.type === 'LOYALITY_POINT_CREDIT'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {(selectedTxn.type === 'CREDIT' ||
                    selectedTxn.type === 'LOYALITY_POINT_CREDIT'
                      ? '+'
                      : '-') + selectedTxn.amount.toFixed(2)}{' '}
                    ₹
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">
                    Reference
                  </div>
                  <div>{selectedTxn.reference || '-'}</div>
                </div>

                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">
                    Comment
                  </div>
                  <div className="break-words">{selectedTxn.comment || '-'}</div>
                </div>

                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">
                    Date
                  </div>
                  <div>
                    {format(new Date(selectedTxn.createdAt), 'dd MMM yyyy HH:mm')}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">
                    Status
                  </div>
                  <div>
                    {selectedTxn.status === 'SUCCESS' ? 'Success' : selectedTxn.status === 'FAILED' ? 'Failed' : 'Pending'}
                    <Badge variant={selectedTxn.status === 'SUCCESS' ? 'default' : 'secondary'}>
                          {selectedTxn.status}
                        </Badge>
                  </div>
                </div>
                {user?.role === Role_ENUM.ADMIN && (
                  <>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wide">
                        User
                      </div>
                      <Link
                        href={`admin/users/${selectedTxn.user}`}
                        className="text-primary font-medium hover:underline"
                      >
                        View User
                      </Link>
                    </div>

                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wide">
                        Created By
                      </div>
                      <Link
                        href={`admin/users/${selectedTxn.createdBy}`}
                        className="text-primary font-medium hover:underline"
                      >
                        View Creator
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
