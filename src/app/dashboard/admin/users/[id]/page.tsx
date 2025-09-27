'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Edit, Save, X, CreditCard, TrendingUp, Users, Target, CheckCircle, MailWarningIcon, Plus, Award } from 'lucide-react'
import PageContainer from '@/components/layout/page-container'
import api from '@/lib/apiService'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Role_ENUM, sampleUser, TransactionInterface, TRANSACTIONS_TYPES, TRANSACTIONS_TYPES_FOR_SALES, TransactionType, User, USER_ROLE, USER_ROLE_TYPE } from '@/types/user'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { useAuthStore } from '@/lib/userStore'


interface NewTransaction {

  type: 'CREDIT' | 'DEBIT'|'WITHDRAWAL'
  amount: number
  comment: string,
  reference:string,
}

// Shimmer Component
const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
)

export default function AdminUserProfile() {
  const [user, setUser] = useState<User>(sampleUser)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User>(sampleUser)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
 const [newTransaction, setNewTransaction] = useState<{ 
  type: TransactionType,
  amount?: number,
  comment: string,
 
  reference:string,
 }>({
    type: 'CREDIT',
 
    amount: 0,
    comment: '',
    reference:'',

  })
  const {user:CurrentUser} = useAuthStore();

  const transactionTypesAllowed = user?.role==Role_ENUM.ADMIN?TRANSACTIONS_TYPES:user?.role==Role_ENUM.SALES?TRANSACTIONS_TYPES_FOR_SALES:[]
  const [newTransactionLoading, setNewTransactionLoading] = useState(false);
  const handleAddTransaction = async()=>{
    try{
      setNewTransactionLoading(true);
      const resPromise =  api.post('/admin/transactions/addTransaction',{id:user._id,...newTransaction})
      toast.promise(resPromise,{loading:"creating transaction",'success':
       "transaction added",error:"opps transaction failed"
      });
      const res = await resPromise;
      setIsDialogOpen(false);
      setNewTransaction({type:'CREDIT',amount:0,comment:'',reference:''})
       fetchUser()
    }
    catch(err:any)
    {
        toast.error("Failed ! can not add transaction",err)
    }
    finally
    {
      setNewTransactionLoading(false);
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedUser({ ...user })
  }

  const handleSave =async () => {
    try{
        const resPromise = api.post('/users/update',editedUser);
        toast.promise(resPromise,{loading:'Updating users','success':'user updated','error':'opps failed'})
        const res = await resPromise;
        setUser(res.data.data)
    }catch(err:any){
       toast.error(err?.message);
    }
    finally{

      setIsEditing(false)
    }
  
  }

  const handleCancel = () => {
    setEditedUser({ ...user })
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof User, value: string | number) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }))
  }
   
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }
  const {id} = useParams()
  const fetchUser = async()=>{
    console.log("calling fetchUser");
    
    try{

      const res = await api.get(`/users/${id}`);
      setUser(res.data.data)
    }catch(err:any)
    {
      toast.error(err?.message)
    }
  
  }

  useEffect(() => {
    fetchUser();
}, [])
  const conversionRate = user.totalLeads > 0 
    ? ((user.totalLeadsConv / user.totalLeads) * 100).toFixed(1)
    : '0.0'
  
   
  return (
    <PageContainer>
    <div className="bg-background p-4 md:p-8 flex-1">
 
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
            <p className="text-muted-foreground">Manage user information and view statistics</p>
          </div>
          {/* <Badge variant="secondary" className="text-sm px-3 py-1">
            Admin View
          </Badge> */}
        </div>

        {/* User Info Header Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl flex flex-row gap-2 items-center">{user.name}  {user.verifiedEmail ? <CheckCircle className='text-green-500 size-5'/> : <MailWarningIcon className='text-red-400 size-5'/>} {user.suspended && <Badge className='bg-red-500 text-white'>Suspended</Badge>}</CardTitle>
                <CardDescription>User ID: {user._id}</CardDescription>
              </div>
             {CurrentUser?.role == Role_ENUM.ADMIN && <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Information */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>User personal and banking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedUser.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <div className="px-3 py-2 border rounded-md bg-muted/50">{user.name}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                        {user.email}
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                        {user.phone}
                      </div>
                      <p className="text-xs text-muted-foreground">Phone cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      {isEditing ? (
                         <Select onValueChange={(v:USER_ROLE_TYPE) => {
                            // if(!USER_ROLE.includes(v)) return;
                         
                            setEditedUser((prev)=>({...prev,role:v}))
                          }
                          
                          } defaultValue={user.role}>
                         <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="Role" />
                         </SelectTrigger>
                         <SelectContent>
                           {
                            USER_ROLE.map(element => {
                              return <SelectItem value={element}>{element}</SelectItem>
                            })
                           }
                           
                          
                         </SelectContent>
                       </Select>
                      ) : (
                        <div className="px-3 py-2 border rounded-md bg-muted/50 h-10">{user.role }</div>
                      )}
                    </div>
{
      isEditing?
                    <Button onClick={()=>setEditedUser((prev)=>({...prev,suspended:!prev.suspended}))} disabled={!isEditing}>{editedUser.suspended?"Make Active":"Suspend this user"}</Button>
:<Label>{user.suspended?"User is suspended":"User is active"}</Label>
                  }
                  
                  </div>
                </div>

                <Separator />

                {/* Banking Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Banking Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      {isEditing ? (
                        <Input
                          id="bankName"
                          value={editedUser.bankName}
                          onChange={(e) => handleInputChange('bankName', e.target.value)}
                        />
                      ) : (
                        <div className="px-3 py-2 border rounded-md bg-muted/50 h-10">{user.bankName}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      {isEditing ? (
                        <Input
                          id="accountNumber"
                          value={editedUser.accountNumber}
                          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        />
                      ) : (
                        <div className="px-3 py-2 border rounded-md bg-muted/50 h-10">{user.accountNumber}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      {isEditing ? (
                        <Input
                          id="upiId"
                          value={editedUser.upiId}
                          onChange={(e) => handleInputChange('upiId', e.target.value)}
                        />
                      ) : (
                        <div className="px-3 py-2 border rounded-md bg-muted/50 h-10">{user.upiId}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      {isEditing ? (
                        <Input
                          id="ifscCode"
                          value={editedUser.ifsc}
                          onChange={(e) => handleInputChange('ifsc', e.target.value)}
                        />
                      ) : (
                        <div className="px-3 py-2 border rounded-md bg-muted/50 h-10">{user.ifsc}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          

            
             {/* Actions */}

             <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-2'>
                <Link href={`/dashboard/wallet?id=${user._id}`}>
                <Button className="w-full" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Transactions
                </Button>
                </Link>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                {/* <Label htmlFor="name.addNewTransaction">User </Label> */}
                {/* <Input
                  id="dialog.newtransaction.name"
                  placeholder="user Name"
                  value={user.name}
                  disabled 
                  // onChange={(e) => {
                  //   setNewTransaction(prev => ({ ...prev, userPhone: e.target.value }))
                  // }}
                /> */}
              </div>
                <Card>
                  <CardContent className="px-4">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-lg font-bold text-green-600">
                      Current Balance: ₹{user.balance.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
     
              
              <div className='flex flex-row justify-between items-center'>
                <Label htmlFor="type">Transaction Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value: TransactionType) => 
                    transactionTypesAllowed.includes(value) && setNewTransaction(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                  {
                     transactionTypesAllowed.map((val,index)=><SelectItem key={`${val}-${index}`} value={val}>{val}</SelectItem>)
                  }
                  </SelectContent>
                </Select>
              </div>
              
              <div className='flex flex-row justify-between items-center'>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount-newT-input"
                  type="number"
                  placeholder="1000"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount:Number(e.target.value)}))}
                  className='w-fit'
                />
              </div>
              
              <div className='flex flex-col gap-2'>
                <Label htmlFor="referrence">Referrence</Label>
                <Textarea
                  id="referrence"
                  placeholder="Transaction referrence..."
                  value={newTransaction.reference}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, reference: e.target.value }))}
                />
              </div>

              <div className='flex flex-col gap-2'>
                <Label htmlFor="comment-newT">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Transaction comment..."
                  value={newTransaction.comment}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, comment: e.target.value }))}
                />
              </div>
              
              <Button
                onClick={handleAddTransaction}
                disabled={!user || !newTransaction.amount || newTransactionLoading}
                className="w-full"
              >
                {newTransactionLoading ? 'Creating...' : 'Create Transaction'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
              </CardContent>
            </Card>

              

 
          </div>

          {/* Statistics and Actions */}
          <div className="space-y-6">
            
            {/* Financial Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Wallet Balance</span>
                    <span className="font-semibold text-lg text-primary">
                      {formatCurrency(user.balance)}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lifetime Earnings</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(user.lifetimeEarnings)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lifetime Withdrawal</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(user.lifetimeWithdrawn)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
  {/* points Statistics */}
  <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Points Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Points Balance</span>
                    <span className="font-semibold text-lg text-primary">
                      {formatCurrency(user.points||0)}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lifetime Points</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(user.lifetimePointsEarnings || 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lifetime Points Used</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(user.lifetimePointsWithdrawn)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Performance Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-4 w-4 text-muted-foreground mr-1" />
                    </div>
                    <div className="text-2xl font-bold">{user.totalLeads.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Leads</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-4 w-4 text-muted-foreground mr-1" />
                    </div>
                    <div className="text-2xl font-bold">{user.totalLeadsConv.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Converted</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                  <div className="text-xl font-semibold text-primary">{conversionRate}%</div>
                </div>
              </CardContent>
            </Card>

           
          </div>
        </div>
      </div>
    </div>
    </PageContainer>
  )
}