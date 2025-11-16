"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "next/link";
import PageContainer from "@/components/layout/page-container";
import api from "@/lib/apiService";
import { CheckCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
interface FilterType
{
  // email?:string,
  sortby?:'balance'|'lifetimeEarnings'|'lifetimeWithdrawn'|'totalLeads'|'totalLeadsConv'|'default',
  verified?:'yes'|'no'|'all',
  suspended?:'yes'|'no'|'all'
}





export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [Filters, setFilters] = useState<FilterType>({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if(search === '')
    {
      loadUsers()
    }
  }, [search])
  
  async function userByEmail() {
    try{
      setLoading(true);
      const res = await api.post('/users/userbyemail',{search});
      // console.log(res);
      
      setUsers(res.data.data);
    }
    catch(err:any)
    {
      toast.error(err?.message||"opps")
    }
    finally{
      setLoading(false)
    }
  }
async function loadUsers() {
  
  try{
    setLoading(true);


    
    const query = {...Filters,...pagination};

      if(Filters.sortby === 'default') {
          delete query.sortby;
      }
      const respromise =  api.post("/users", 
       query
      );
      toast.promise(respromise,{loading:"loading users"});
      const res = await respromise;
    const data = res.data.data;
    setUsers(data.users);
  
    
    setPagination({page:data.page,limit:data.limit,total:data.total,totalPages:Math.ceil(data.total/data.limit)})
    return res.data.data;
}catch(err:any)
{
    toast.error(err?.message)
}
finally{

  setLoading(false);
}
}
  useEffect(() => {
 
   

      loadUsers();
    
  }, [ pagination.limit, pagination.page, Filters.sortby , Filters.suspended , Filters.verified]);

 

  return (
    <PageContainer>
      <Card className="w-full min-w-0">
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 w-full max-w-full min-w-0">
          {/* Filters */}
          <div className="flex gap-3 w-full max-w-full min-w-0 flex-row flex-wrap">
            <div className="flex flex-1 min-w-0 flex-row items-center gap-3 flex-wrap">

            <Input
              placeholder="Search user"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-[200px]"
              />
              <Button onClick={userByEmail}>
                <Search >Find</Search>
              </Button>
              </div>
            <Select onValueChange={(v:'all'|'yes'|'no') => setFilters((prev)=>({...prev,suspended:v}))} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Suspended" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Suspended</SelectItem>
                <SelectItem value="no">Active</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v:'all'|'yes'|'no') => setFilters((prev)=>({...prev,verified:v}))} defaultValue="all">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Verified Email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Verified</SelectItem>
                <SelectItem value="no">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(v) => setFilters((prev)=>({...prev,sortby:v as FilterType['sortby']}))} defaultValue="default">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Suspended" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="balance">Balance</SelectItem>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="lifetimePointsEarnings">Points Earned</SelectItem>
                <SelectItem value="lifetimeEarnings">Earnings</SelectItem>
                <SelectItem value="lifetimeWithdrawn">Payout</SelectItem>
                <SelectItem value="totalLeads">total leads</SelectItem>
                <SelectItem value="totalLeadsConv">convered leads</SelectItem>
              </SelectContent>
            </Select>

            {/* <Button onClick={() => { setPage(1); loadUsers(); }}>Apply</Button> */}
          </div>

          {/* Users Table */}
       
       <CardContent className="w-full min-w-0">
     

  <div className="w-full min-w-0">
    <Table className="text-sm w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
                <TableHead className="whitespace-nowrap">Phone</TableHead>
                <TableHead className="whitespace-nowrap">Balance</TableHead>
                <TableHead className="whitespace-nowrap">Earnings</TableHead>
                <TableHead className="whitespace-nowrap">Points</TableHead>
                <TableHead className="whitespace-nowrap">L.Points</TableHead>
                <TableHead className="whitespace-nowrap">Leads</TableHead>
                <TableHead className="whitespace-nowrap">Conv. Leads</TableHead>
                <TableHead className="whitespace-nowrap">Verified</TableHead>
                <TableHead className="whitespace-nowrap">Suspended</TableHead>
                <TableHead className="whitespace-nowrap">Created</TableHead>
                <TableHead className="whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="max-w-[200px] truncate">{user.email}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{user.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.role}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.phone || "-"}</TableCell>
                  <TableCell className="whitespace-nowrap">{typeof user.balance === 'number' ? user.balance.toFixed(2) : user.balance}</TableCell>
                  <TableCell className="whitespace-nowrap">{typeof user.lifetimeWithdrawn === 'number' ? user.lifetimeWithdrawn.toFixed(2) : user.lifetimeWithdrawn}</TableCell>
                  <TableCell className="whitespace-nowrap">{typeof user.points === 'number' ? user.points.toFixed(2) : user.points}</TableCell>
                  <TableCell className="whitespace-nowrap">{typeof user.lifetimePointsWithdrawn === 'number' ? user.lifetimePointsWithdrawn.toFixed(2) : user.lifetimePointsWithdrawn}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.totalLeads}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.totalLeadsConv}</TableCell>
                  <TableCell className="whitespace-nowrap">
                  {user.verifiedEmail ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" /> Yes
                          </span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                        </TableCell>
                  <TableCell className="whitespace-nowrap">{user.suspended ? "Yes" : "No"}</TableCell>
                  <TableCell className="whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Link href={`users/${user._id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          </CardContent>
       
         {/* Pagination */}
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 w-full min-w-0">
         <div className="flex items-center gap-2">
              <Label htmlFor="limit" className="text-sm">Show:</Label>
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
                <div className="text-sm text-gray-500 whitespace-nowrap">
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
                  <span className="text-sm whitespace-nowrap">
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
        </CardContent>
      </Card>
    </PageContainer>
  );
}
