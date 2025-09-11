'use client'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RecentSalesSkeleton } from './recent-sales-skeleton';
import api from '@/lib/apiService';
import { Role_ENUM, User } from '@/types/user';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/userStore';

export function TopLeadsUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const {user} = useAuthStore();
   
 
  useEffect(() => {
    if (!user || user.role !== Role_ENUM.ADMIN) return; 
    const load = async () => {
      try {
        const res = await api.get('/dashboard/topusers')
        setUsers(res.data.data || [])
      } catch (err) {
        toast.error('Failed to load top users')
      } finally {
        setLoading(false)
      }
    }
    load()
   
  }, [user])

  if(user?.role != Role_ENUM.ADMIN) return null;
  return (
    <Card className="h-full shadow-lg border-0 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">🏆 Top Users by Leads</CardTitle>
        <CardDescription>Users with the most generated leads</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <RecentSalesSkeleton />
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <Link key={user._id} href={`/dashboard/admin/users/${user._id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-xs ${
                        index === 0
                          ? 'bg-yellow-500'
                          : index === 1
                          ? 'bg-gray-400'
                          : index === 2
                          ? 'bg-orange-400'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Earnings: ₹{user.lifetimeEarnings?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      Leads: {user.totalLeads}
                    </Badge>
                    <Badge className="bg-primary text-white text-xs">
                      Conv: {user.totalLeadsConv}
                    </Badge>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
