'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Copy, Eye, EyeOff, Share2, Users, TrendingUp } from 'lucide-react';
import { Icon } from '@/components/icons';
import { useAuthStore } from '@/lib/userStore';
import PageContainer from '@/components/layout/page-container';

// Shimmer component for loading states
const Shimmer = ({ className = "" }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}></div>
);

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const {user} = useAuthStore();



  const referralLink = `${process.env.NEXT_PUBLIC_REFERRAL_BASE_URL}/${user?.referralToken}`
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ProfileField = ({ label, value, icon = null }:{label:string,value:string,icon?:React.ReactNode}) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="flex items-center space-x-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <Input value={value} disabled className="bg-muted/50" />
      </div>
    </div>
  );

  const ShimmerField = () => (
    <div className="space-y-2">
      <Shimmer className="h-4 w-24" />
      <Shimmer className="h-10 w-full" />
    </div>
  );

    if(!user) {


    return (  <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Shimmer */}
          <div className="space-y-2">
            <Shimmer className="h-8 w-48" />
            <Shimmer className="h-4 w-96" />
          </div>

          {/* Cards Shimmer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
               <Card className='@container/card min-w-0'>
                <CardHeader>
                  <Shimmer className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <ShimmerField key={i} />
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <ShimmerField key={i} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
               <Card className='@container/card min-w-0'>
                <CardHeader>
                  <Shimmer className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Shimmer className="h-20 w-full" />
                  <Shimmer className="h-10 w-full" />
                  <Shimmer className="h-4 w-full" />
                  <Shimmer className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>);
    
  };
  return (
    <PageContainer>
    <div className="p-4 flex items-center w-full min-w-0">
      <div className="w-full max-w-4xl mx-auto space-y-6 min-w-0">
        {/* Header */}
        <div className="space-y-2 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight break-words">Profile</h1>
          <p className="text-muted-foreground break-words">
            Manage your affiliate account information and referral settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-w-0">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 order-2 md:order-1 min-w-0">
            <Card className="min-w-0">
              <CardHeader className="min-w-0">
                <CardTitle className="break-words">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 min-w-0">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                  <ProfileField label="Full Name" value={user?.name} />
                  <ProfileField label="Email Address" value={user.email} />
                  <ProfileField label="Phone Number" value={user.phone} />
                  {/* <div className="space-y-2"> */}
                    {/* <Label className="text-sm font-medium text-muted-foreground">Password</Label>
                    <div className="flex items-center space-x-2"> */}
                      {/* <div className="relative flex-1">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          value={showPassword ? "mypassword123" : profileData.password}
                          disabled 
                          className="bg-muted/50 pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button> */}
                      {/* </div> */}
                    {/* </div>
                  </div> */}
                </div>

                <Separator />

                {/* Banking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Banking & Payment Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField 
                      label="Bank Account" 
                      value={`${user.accountNumber} - ${user.bankName}`} 
                    />
                    <ProfileField label="IFSC Code" value={user.ifsc || ""} />
                  </div>
                  
                  <ProfileField label="UPI ID" value={user.upiId || ""} />
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Profile information cannot be modified directly. Contact support for any changes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Section */}
          <div className='order-1 md:order-2 min-w-0'>
            <Card className="min-w-0">
              <CardHeader className="min-w-0">
                <CardTitle className="flex items-center space-x-2 break-words">
                  <Share2 className="h-5 w-5 shrink-0" />
                  <span>Referral Program</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 min-w-0">
                {/* Referral Stats */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Referral Code</span>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{user.referralToken}</div>
                </div>

                {/* Referral Link */}
                <div className="space-y-2 min-w-0">
                  <Label className="text-sm font-medium text-muted-foreground">Referral Link</Label>
                  <div className="flex items-center space-x-2 min-w-0">
                    <Input 
                      value={referralLink} 
                      disabled 
                      className="bg-muted/50 text-xs min-w-0 flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyReferralLink}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-600">Link copied to clipboard!</p>
                  )}
                </div>

                {/* Call to Action */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div className="flex items-center space-x-2 text-primary">
                    <Users className="h-4 w-4" />
                    <span className="font-medium text-sm">Grow Your Network</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Share your referral link with potential clients and partners. 
                    Every successful referral helps you earn commissions and build 
                    your affiliate network.
                  </p>
                  <Button className="w-full" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Track your referral performance in the{' '}
                    <span className="text-primary cursor-pointer hover:underline">
                      Analytics Dashboard
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </PageContainer>
  );
};

export default ProfilePage;