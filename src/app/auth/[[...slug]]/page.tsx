'use client'
import React, { useState, useEffect } from 'react';
import { Phone, Lock, User, ArrowRight, CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react';
import api from '@/lib/apiService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/userStore';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import PageContainer from '@/components/layout/page-container';
import Image from 'next/image';
import raikaLogo from '@/app/icon.png'
interface PhoneAuthState {
  phone: string;
  otp: string;
  name: string;
  email?:string;
}

export default function PhoneOTPAuth() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [currentView, setCurrentView] = useState<'phone' | 'otp' | 'details'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<PhoneAuthState>({ phone: '', otp: '', name: '' });
  const [otpTimer, setOtpTimer] = useState(0);
  const [userPhone, setUserPhone] = useState('');

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Clear messages on view change
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [currentView]);

  const cleanPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/\s+/g, '');
    
    if (cleaned.startsWith('+91')) cleaned = cleaned.slice(3);
    else if (cleaned.startsWith('091')) cleaned = cleaned.slice(3);
    else if (cleaned.startsWith('91')) cleaned = cleaned.slice(2);
    else if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
    
    return cleaned;
  };

  const validatePhone = (phone: string) => {
    const allowedChars = /^[0-9+\s]+$/;
    if (!allowedChars.test(phone)) {
      setError('Invalid phone number format');
      return false;
    }
    
    const cleaned = cleanPhoneNumber(phone);
    if (cleaned.length !== 10) {
      setError('Phone number must be 10 digits');
      return false;
    }
    
    return true;
  };

  const handleSendOTP = async () => {
    setError('');
    setSuccess('');

    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhone(formData.phone)) {
      return;
    }

    setLoading(true);
    try {
      const cleanedPhone = cleanPhoneNumber(formData.phone);
      await api.post('/auth/send-otp', { phone: cleanedPhone });
      setUserPhone(cleanedPhone);
      setCurrentView('otp');
      setOtpTimer(60);
      setSuccess('OTP sent successfully!');
      toast.success('OTP sent to your phone');
    } catch (err: any) {
      const errorMsg = err.data?.message || err.message || 'Failed to send OTP';
      setError(errorMsg);
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setError('');
    setSuccess('');

    if (!formData.otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (formData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        phone: userPhone,
        otp: formData.otp,
      });

      // Check if user is new
      if (response.data.data.isNewUser) {
        setCurrentView('details');
        setSuccess('OTP verified! Please complete your profile');
        toast.success('OTP verified!');
      } else {
        // Existing user - login directly
        login(response.data.data.user);
        toast.success('Welcome back!');
        setSuccess('Welcome back! Redirecting...');
        router.push('/');
      }
    } catch (err: any) {
      const errorMsg = err.data?.message || err.message || 'Invalid OTP';
      setError(errorMsg);
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  const handleCompleteProfile = async () => {
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
   if (formData.email && formData.email?.trim()) {
    const email = formData.email.trim();
    
    // Regular Expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        // If the email is NOT valid according to the regex:
        setError('Please enter a valid email address.');
        return; // Stop execution/submission
    }
  }

    setLoading(true);
    try {
      const response = await api.post('/auth/complete-profile', {
        phone: userPhone,
        name: formData.name.trim(),
        email:formData.email?.trim()
      });

      login(response.data.data.user);
      toast.success('Account created successfully!');
      setSuccess('Account created! Redirecting...');
      router.push('/');
    } catch (err: any) {
      const errorMsg = err.data?.message || err.message || 'Failed to complete profile';
      setError(errorMsg);
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: cleaned }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      {/* Main container */}
      <div className="w-full max-w-sm ">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-500 p-8 ">
          <div className="space-y-8 ">
            {/* Phone Input View */}
            {currentView === 'phone' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="text-center space-y-3">
                  <Image src={raikaLogo} alt='raika' width={120} className='m-auto'></Image>
                  <h1 className="text-3xl font-semibold text-gray-900">
                    Welcome
                  </h1>
                  <p className="text-gray-500 text-sm">Sign in with your phone number</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-gray-900 focus-within:bg-white transition-all duration-200">
                      <span className="text-lg mr-2">🇮🇳</span>
                      {/* <span className="text-gray-700 font-medium">+91</span> */}
                      <input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={formData.phone}
                        onChange={handlePhoneInput}
                        onKeyPress={(e) => handleKeyPress(e, handleSendOTP)}
                        maxLength={10}
                        className="w-full pl-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 animate-in slide-in-from-top duration-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-medium text-white bg-amber-500 hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Verification View */}
            {currentView === 'otp' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="text-center space-y-3">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    Verify OTP
                  </h1>
                  <p className="text-gray-500 text-sm">Enter the 6-digit code sent to</p>
                  <p className="text-gray-900 font-medium">+91 {userPhone}</p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={formData.otp}
                      onChange={(value) => setFormData(prev => ({ ...prev, otp: value }))}
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-12 text-lg font-semibold border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-gray-900 focus:ring-0 transition-all duration-200"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 animate-in slide-in-from-top duration-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || formData.otp.length !== 6}
                    className="w-full py-3 rounded-lg font-medium text-white bg-amber-500 hover:bg-amber-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify OTP
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={() => {
                      setCurrentView('phone');
                      setFormData(prev => ({ ...prev, otp: '' }));
                    }}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Change number
                  </button>
                  <div className="text-gray-500">
                    {otpTimer > 0 ? (
                      <span>Resend in <span className="text-gray-900 font-medium">{otpTimer}s</span></span>
                    ) : (
                      <button
                        onClick={handleSendOTP}
                        className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
                        disabled={loading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Complete Profile View */}
            {currentView === 'details' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="text-center space-y-3">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    Complete Profile
                  </h1>
                  <p className="text-gray-500 text-sm">Tell us your name to get started</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-gray-900 focus-within:bg-white transition-all duration-200 mb-3">
                      <User className="w-4 h-4 text-gray-400 mr-3" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        onKeyPress={(e) => handleKeyPress(e, handleCompleteProfile)}
                        className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                      />
                    </div>
                     <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-gray-900 focus-within:bg-white transition-all duration-200">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <input
                        type="email"
                        placeholder="admin@raikaphotography.com"
                        value={formData.email || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        onKeyPress={(e) => handleKeyPress(e, handleCompleteProfile)}
                        className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                      />
                    </div>
                    <div className='text-sm text-gray-400 mx-5'>Email is optional</div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 animate-in slide-in-from-top duration-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 animate-in slide-in-from-top duration-300">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{success}</span>
                    </div>
                  )}

                  <button
                    onClick={handleCompleteProfile}
                    disabled={loading || !formData.name.trim()}
                    className="w-full py-3 rounded-lg font-medium text-white bg-amber-500 hover:bg-amber-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}