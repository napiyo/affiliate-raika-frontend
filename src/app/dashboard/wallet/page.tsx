'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CalendarIcon, DollarSign, TrendingUp, TrendingDown, Search, Filter, ChevronRight, ChevronLeft, IndianRupee, IndianRupeeIcon, UserIcon, Magnet } from 'lucide-react'
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
import { useParams, useSearchParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import WalletChart from './@earningOverivew/page'
import InfoTooltip from '@/components/ui/infoTooltip'
import { AlertDialogContent } from '@/components/ui/alert-dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

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
  // State
  let id = useSearchParams().get('id') || undefined;
  if(!id || id == null)
  {
    id = undefined;
  }

 

  const [transactions, setTransactions] = useState<TransactionInterface[]>([])
  const [earningsData, setEarningsData] = useState<EarningsData[]>([])
  const [loading, setLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [earningsLoading, setEarningsLoading] = useState(false)
  const [walletSummary, setWalletSummary] = useState<User>(sampleUser)
  const [filters, setFilters] = useState<Filters>({ search: '',type:'all',
    timeRange: 'all',})
const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  });
    const {user} = useAuthStore()

 const searchTransaction = async()=>
 {
            if(filters.search.trim() == '') return;
        try{
            
            setTransactionsLoading(true);
         
            const response = await api.post(`/users/mytrasaction`,{search:filters.search,id});
            
            
            //   const response = await mockTransactionsApi(page, itemsPerPage, newFilters)
            const {data} = response.data;
            setTransactions(data.transactions || [])
            setPagination((prev)=>({page:data.page,limit:data.limit,total:data.total,totalPages: Math.ceil(data.total/data.limit)}))
        }
        catch(err:any){
            toast.error(err.message);
        }
        finally{
            setTransactionsLoading(
                false
            )
        }
             
 }
  // Fetch transactions
  const fetchTransactions = async ( newFilters = filters) => {
  

    setTransactionsLoading(true)

    try {
        
         const query:any = {page:pagination.page,limit:pagination.limit,id};
        
        
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
             
                      query.from = startDate.getTime();
                       query.to=endDate.getTime()};
                   
                     
                     }
                     if(filters.type)
                     {
                        query.type=filters.type
                     }

            
        const response = await api.post(`/users/mytrasaction`,query);
        
        
    //   const response = await mockTransactionsApi(page, itemsPerPage, newFilters)
      setTransactions(response.data.data.transactions || [])
      const {data} = response.data;
      setPagination((prev)=>({page:data.page,limit:data.limit,total:data.total,totalPages: Math.ceil(data.total/data.limit)}))

      
      // Cache the response
    //   cache.set(cacheKey, { data: response.data, total: response.data.total })
    } catch (error) {
    //   console.error('Failed to fetch transactions:', error)
    toast.error('Failed to fetch transactions')
    } finally {
      setTransactionsLoading(false)
    }
  }

  const fetchWallet = async()=>{
    try{
        let url :string= "/users/wallet";
      
        if(id && id != null)
        {  
            url+= '?id='+id
        }
        const res =  await api.get(url); // yup, ?id is wrong, me is for me, but due to time issue, Im doing it
        // console.log(res);
        
       
        
        setWalletSummary(res.data.data);
    }
    catch(err:any){
        toast.error(err.message);
    }
  }
  useEffect(() => {
   fetchWallet()
   
  }, [])
  
  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
       setLoading(true);
     
       await fetchTransactions()
     
      setLoading(false)
    }
    if(filters.timeRange==='custom')
    {
        if(!filters.customStartDate 
            || !filters.customEndDate)
            {
                return;
            }
    }
    loadInitialData()
  }, [filters.type,filters.timeRange,filters.customEndDate,filters.customStartDate,pagination.page,pagination.limit])
   useEffect(() => {
       if(!filters.search|| filters.search.trim()=='')
       {
        fetchTransactions()
       }
   }, [filters.search])


 


  if (loading) {
    return <LoadingSkeleton />
  }
  const handleTimeRangeFilter = (timeRange: string) => {
    setFilters(prev => ({ ...prev, timeRange }));
    // setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <PageContainer>
    <div className="container mx-auto space-y-8">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
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

        <Card>
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

        <Card>
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

        <Card>
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
            <Card>
              <CardContent>
           
<div className='w-full max-w-full'>

    <WalletChart id={id}/>
</div>
    </CardContent>
    </Card>
    
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View and filter your transaction history</CardDescription>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 max-w-full items-center justify-between">
            <div className="relative flex-1/3 flex flex-row gap-4 items-center ">
              <Search className="absolute left-3  h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters((prev)=>({...prev,search:e.target.value.trim()}))}
                className="pl-10"
              />
     <Button  size="sm"  disabled={!filters.search || transactionsLoading} onClick={()=>searchTransaction()}>
                     {loading ? <Spinner />:
                      <Search className="h-4 w-4" />
                     }
                    </Button>
            </div>
            <div className='flex flex-row gap-4 items-center justify-end flex-wrap'>
                
            
            <Select value={filters.type} onValueChange={(value:'all'| TransactionType) => setFilters((prev)=>({...prev,type:value}))}>
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
              <Table className='hidden sm:block w-full table-auto'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction Id</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Referrence</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>

                    {user?.role == Role_ENUM.ADMIN &&<TableHead>User</TableHead> }
                    {user?.role == Role_ENUM.ADMIN &&<TableHead>Created by</TableHead> }

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.txnId}>
                      <TableCell className="font-medium">
                        {transaction.txnId}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'CREDIT' ? 'default' : 'secondary'}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={(transaction.type === TRANSACTIONS_ENUM.CREDIT || transaction.type === TRANSACTIONS_ENUM.LOYALITY_POINT_CREDIT )  ? 'text-green-600' : 'text-red-600'}>
                        { (transaction.type === TRANSACTIONS_ENUM.CREDIT || transaction.type === TRANSACTIONS_ENUM.LOYALITY_POINT_CREDIT ) ? '+' : '-'}{transaction.amount.toFixed(2)} ₹
                      </TableCell>
                      <TableCell>
                        
                          {transaction.reference}                                                                                                                           
                       
                      </TableCell>
                      <TableCell className='max-w-xs truncate min-w-0'>
                       {transaction.comment}
                      </TableCell>
                      <TableCell className="capitalize">
                     { format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'SUCCESS' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      {user?.role == Role_ENUM.ADMIN &&

                          <TableCell >
                        <Link href={`admin/users/${transaction.user}`} className='bg-primary text-primary-foreground px-3 py-1 rounded-2xl' >
                          User
                        </Link>
                      </TableCell>
                    }
                     {user?.role == Role_ENUM.ADMIN &&

                  <TableCell >
                  <Link href={`admin/users/${transaction.createdBy}`} className='bg-primary text-primary-foreground px-3 py-1 rounded-2xl' >
                   created By
                  </Link>
                  </TableCell>
                  }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TransactionCards transactions={transactions} user={user} />

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
         <div className="flex items-center gap-2">
              <Label htmlFor="limit-wallet" className="text-sm">Show:</Label>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => setPagination((prev)=>({...prev,limit:Number(value)}))}
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
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination((prev)=>({...prev,page:prev.page - 1}))}
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
                    onClick={() => setPagination((prev)=>({...prev,page:prev.page + 1}))}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} transactions
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination((prev)=>({...prev,page:prev.page-1}))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPagination((prev)=>({...prev,page}))}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination((prev)=>({...prev,page:prev.page+1}))}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )} */}
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

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>

      <Card>
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
