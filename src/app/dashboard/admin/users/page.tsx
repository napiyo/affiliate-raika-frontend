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
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import PageContainer from "@/components/layout/page-container";
import api from "@/lib/apiService";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  MoreHorizontal, 
  Copy,
  Eye,
  Ban,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

// --- Types ---
interface FilterType {
  sortby?: 'balance' | 'lifetimeEarnings' | 'lifetimeWithdrawn' | 'totalLeads' | 'totalLeadsConv' | 'default';
  verified?: 'yes' | 'no' | 'all';
  suspended?: 'yes' | 'no' | 'all';
}

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  balance: number;
  lifetimeWithdrawn: number;
  points: number;
  lifetimePointsWithdrawn: number;
  totalLeads: number;
  totalLeadsConv: number;
  verifiedEmail: boolean;
  suspended: boolean;
  createdAt: string;
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // --- Columns Definition ---
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 capitalize">
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 group">
          <span className="truncate max-w-[180px] text-gray-600">{row.original.email}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => copyToClipboard(row.original.email)}
          >
            <Copy className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {row.original.phone || <span className="text-gray-300">-</span>}
        </span>
      ),
    },
    // Monetary columns: Right Aligned + Monospace for readability
    {
      accessorKey: "balance",
      header: () => <div className="text-right">Balance</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono font-medium text-green-700">
          ${(row.original.balance || 0).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "lifetimeWithdrawn",
      header: () => <div className="text-right">Earnings</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-gray-600">
          ${(row.original.lifetimeWithdrawn || 0).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "points",
      header: () => <div className="text-right">Points</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono font-medium text-blue-600">
          {(row.original.points || 0).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "totalLeads",
      header: () => <div className="text-center">Leads</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-medium">{row.original.totalLeads}</span>
          <span className="text-gray-400 text-xs mx-1">/</span>
          <span className="text-xs text-gray-500">{row.original.totalLeadsConv}</span>
        </div>
      )
    },
    {
      accessorKey: "verifiedEmail",
      header: "Verified",
      cell: ({ row }) =>
        row.original.verifiedEmail ? (
          <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
            <CheckCircle2 className="h-4 w-4" /> <span>Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-600 text-xs font-medium">
            <XCircle className="h-4 w-4" /> <span>Pending</span>
          </div>
        ),
    },
    {
      accessorKey: "suspended",
      header: "Status",
      cell: ({ row }) => (
        row.original.suspended ? (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            Suspended
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Active
          </span>
        )
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`users/${user._id}`} className="w-full cursor-pointer">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => copyToClipboard(user.email)}>
                <Copy className="mr-2 h-4 w-4" /> Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                 <Ban className="mr-2 h-4 w-4" /> 
                 {user.suspended ? "Unsuspend" : "Suspend User"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  // --- Effects & API Calls ---
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
      const query: any = { ...Filters, ...pagination };
      if (Filters.sortby === 'default') delete query.sortby;
      
      const respromise = api.post("/users", query);
      toast.promise(respromise, { loading: "loading users" });
      const res = await respromise;
      const data = res.data.data;
      
      setUsers(data.users || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 100,
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / (data.limit || 100)),
      });
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
      <Card className="w-full min-w-0 border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl font-bold tracking-tight">Manage Users</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 space-y-4">
          
          {/* Filters Container */}
          <div className="flex flex-col xl:flex-row gap-3 justify-between bg-slate-50/50 p-3 rounded-lg border">
            {/* Left: Search */}
            <div className="flex w-full xl:w-auto flex-1 items-center gap-2">
              <div className="relative w-full max-w-md">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                 <Input
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 bg-white"
                />
              </div>
              <Button onClick={userByEmail} variant="default">Find</Button>
            </div>

            {/* Right: Dropdowns */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full xl:w-auto">
              <Select onValueChange={(v: 'all' | 'yes' | 'no') => setFilters((prev) => ({ ...prev, suspended: v }))} defaultValue="all">
                <SelectTrigger className="w-full sm:w-[130px] bg-white">
                  <SelectValue placeholder="Suspended" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="yes">Suspended</SelectItem>
                  <SelectItem value="no">Active</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(v: 'all' | 'yes' | 'no') => setFilters((prev) => ({ ...prev, verified: v }))} defaultValue="all">
                <SelectTrigger className="w-full sm:w-[130px] bg-white">
                  <SelectValue placeholder="Verified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Emails</SelectItem>
                  <SelectItem value="yes">Verified</SelectItem>
                  <SelectItem value="no">Unverified</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(v) => setFilters((prev) => ({ ...prev, sortby: v as FilterType['sortby'] }))} defaultValue="default">
                <SelectTrigger className="col-span-2 sm:col-span-1 w-full sm:w-[160px] bg-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="balance">High Balance</SelectItem>
                  <SelectItem value="points">High Points</SelectItem>
                  <SelectItem value="lifetimeEarnings">High Earnings</SelectItem>
                  <SelectItem value="totalLeads">Most Leads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <ScrollArea className="w-full">
               {/* h-[calc(100vh-300px)] allows table body to scroll vertically while header stays sticky */}
               <div className="max-h-[600px] relative"> 
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-slate-200">
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="text-slate-900 font-semibold whitespace-nowrap h-10">
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
                        <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="py-3">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                             <Search className="h-8 w-8 text-slate-300" />
                             <p>No users found matching your filters.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
               </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows:</span>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => setPagination((prev) => ({ ...prev, limit: Number(value) }))}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="hidden sm:inline">
                 | Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}