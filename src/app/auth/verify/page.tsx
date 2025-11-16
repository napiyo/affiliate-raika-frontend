'use client'
import {  useRouter, useSearchParams } from 'next/navigation';

import React, { JSX, useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import api from '@/lib/apiService';
import { useAuthStore } from '@/lib/userStore';
import { toast } from 'sonner';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';


export default function EmailVerificationPage() {
  const token = useSearchParams().get('token');
  const {login} = useAuthStore();
  const router = useRouter();
  if(!token)
  {
     router.push("/");
     return <></>
  }
  useEffect(() => {
      const res = api.get(`/auth/verify/${token}`).then((response)=>{
        login(response.data.data);
        toast.success("Your email is verified")
       updateStatus('success','Your email is verified, You can login now')
       router.push("/");
       
      }).catch((err)=>{
         if(err.status == 400)
         {
          updateStatus('expired',"Link is invalid or Expired");
         }
         else
         {
          updateStatus("error",err.data?err.data.message:err.message);
         }
         
        
      })
  }, [])
  
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState<string>('Verifying your email address...');

  // You can call these functions from your API logic
  const updateStatus = (newStatus: VerificationStatus, newMessage: string) => {
    setStatus(newStatus);
    setMessage(newMessage);
  };

  const getStatusIcon = (): JSX.Element => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
      case 'expired':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Mail className="w-16 h-16 text-gray-400" />;
    }
  };

  const getStatusColor = (): string => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBackgroundColor = (): string => {
    switch (status) {
      case 'loading':
        return 'bg-blue-50';
      case 'success':
        return 'bg-green-50';
      case 'error':
      case 'expired':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getStatusTitle = (): string => {
    switch (status) {
      case 'loading':
        return 'Verifying Email...';
      case 'success':
        return 'Verification Successful!';
      case 'error':
        return 'Verification Failed';
      case 'expired':
        return 'Link Expired';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-1 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>
          <p className="text-gray-600">Please wait while we verify your email address</p>
        </div>

        <div className={`rounded-lg shadow-md p-8 ${getBackgroundColor()}`}>
          <div className="text-center space-y-6">
            {/* Status Icon */}
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>

            {/* Status Message */}
            <div>
              <h2 className={`text-xl font-semibold ${getStatusColor()} mb-2`}>
                {getStatusTitle()}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {status === 'success' && (
                <div className="text-sm text-gray-600">
                  Redirecting to login page in 3 seconds...
                </div>
              )}

              {(status === 'error' || status === 'expired')  && (
                <button
                  onClick={()=> router.push("/")}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Back to Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Having trouble? <a href="/contact" className="text-blue-600 hover:text-blue-700">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

