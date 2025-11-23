"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import PageContainer from "@/components/layout/page-container";
import api from "@/lib/apiService";
import { 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  MoreHorizontal, 
  AlertCircle,
  User as UserIcon
} from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User } from "@/types/user";

interface FilterType {
  sortby?: 'balance' | 'lifetimeEarnings' | 'lifetimeWithdrawn' | 'totalLeads' | 'totalLeadsConv' | 'default';
  verified?: 'yes' | 'no' | 'all';
  suspended?: 'yes' | 'no' | 'all';
}



export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [Filters, setFilters] = useState<FilterType>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: "Contact Details",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
             <span className="max-w-[200px] truncate font-medium">{row.original.email || "-"}</span>
             {/* Verified Status Icon moved here */}
             {row.original.verifiedEmail ? (
               <CheckCircle className="h-4 w-4 text-green-600" aria-label="Verified" />
             ) : (
               <AlertCircle className="h-4 w-4 text-red-500" aria-label="Unverified" />
             )}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.phone || "No Phone"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="max-w-[150px] truncate">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) =>
        typeof row.original.balance === 'number'
          ? `₹${row.original.balance.toFixed(2)}`
          : row.original.balance,
    },
    {
      accessorKey: "lifetimeEarnings",
      header: "Earnings",
      cell: ({ row }) =>
        typeof row.original.lifetimeEarnings === 'number'
          ? `₹${row.original.lifetimeEarnings.toFixed(2)}`
          : row.original.lifetimeEarnings,
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) =>
        typeof row.original.points === 'number'
          ? row.original.points.toFixed(2)
          : row.original.points,
    },
    {
      accessorKey: "lifetimePointsEarnings",
      header: "L.Points",
      cell: ({ row }) =>
        typeof row.original.lifetimePointsEarnings === 'number'
          ? row.original.lifetimePointsEarnings.toFixed(2)
          : row.original.lifetimePointsEarnings,
    },
    // Merged Leads Column
    {
      accessorKey: "totalLeads",
      header: "Leads",
      cell: ({ row }) => (
        <div className="font-medium">
          <span className="text-green-600">{row.original.totalLeadsConv}</span>
          <span className="text-muted-foreground mx-1">/</span>
          <span>{row.original.totalLeads}</span>
        </div>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`users/${row.original._id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                Open Profile
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  useEffect(() => {
    if (search === '') {
      loadUsers();
    }
  }, [search]);

  async function userByEmail() {
    try {
      setLoading(true);
      const res = await api.post('/users/userbyemail', { search });
      setUsers(res.data.data);
    } catch (err: any) {
      toast.error(err?.message || "opps");
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    try {
      setLoading(true);

      const query = { ...Filters, ...pagination };

      if (Filters.sortby === 'default') {
        delete query.sortby;
      }
      const respromise = api.post("/users", query);
      toast.promise(respromise, { loading: "loading users" });
      const res = await respromise;
      const data = res.data.data;
      setUsers(data.users);

      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: Math.ceil(data.total / data.limit),
      });
      return res.data.data;
    } catch (err: any) {
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [pagination.limit, pagination.page, Filters.sortby, Filters.suspended, Filters.verified]);

  return (
    <PageContainer>
      <Card className="w-full min-w-0">
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 w-full max-w-full min-w-0">
          {/* Filters */}
          <div className="flex gap-3 w-full max-w-full min-w-0 flex-row flex-wrap">
            <div className="flex flex-1 min-w-0 flex-row items-center gap-3">
              <Input
                placeholder="Search user"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
              <Button onClick={userByEmail}>
                <Search>Find</Search>
              </Button>
            </div>
            <Select
              onValueChange={(v: 'all' | 'yes' | 'no') =>
                setFilters((prev) => ({ ...prev, suspended: v }))
              }
              defaultValue="all"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Suspended" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Suspended</SelectItem>
                <SelectItem value="no">Active</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(v: 'all' | 'yes' | 'no') =>
                setFilters((prev) => ({ ...prev, verified: v }))
              }
              defaultValue="all"
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Verified Email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Verified</SelectItem>
                <SelectItem value="no">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, sortby: v as FilterType['sortby'] }))
              }
              defaultValue="default"
            >
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
          </div>

          {/* TanStack Table */}
          <div className="w-full overflow-x-auto min-w-0">
             <ScrollArea className='h-full w-full'>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className={row.original.suspended ? "bg-red-50 hover:bg-red-100" : ""}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Added scroll bar to fix horizontal scrolling */}
            <ScrollBar orientation="horizontal" /> 
            </ScrollArea>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 w-full min-w-0">
            <div className="flex items-center gap-2">
              <Label htmlFor="limit" className="text-sm">Show:</Label>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => setPagination((prev) => ({ ...prev, limit: Number(value) }))}
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
            <div className="text-sm text-gray-500 ">
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
        </CardContent>
      </Card>
    </PageContainer>
  );
}