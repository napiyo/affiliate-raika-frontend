'use client'
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/apiService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/userStore';



interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  phone: string;
}




export default  function AuthContainer() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'forgot' | 'verification'>('login');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  // Form states
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState<SignupForm>({ 
    name: '', email: '', password: '', phone: '' 
  });
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const {login} = useAuthStore(); 
  // Clear messages when view changes
  useEffect(() => {
    setError('');
    setSuccess('');
    setShowPassword(false);
  }, [currentView]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = async () => {
    clearMessages();
    
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
      await api.post('/auth/login',loginForm).then((res)=>{
        login(res.data.data)
        toast.success("welcome");        
        setSuccess('Login successful! Redirecting...');
      router.push("/");
   }).catch((error)=>{
    setError(error.data?error.data.message:error.message);
   });
   setLoading(false);
  }

  const handleSignup = async () => {
    clearMessages();
    
    const { name, email, password, phone } = signupForm;
    if (!name || !email || !password || !phone) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const allowedChars = /^[0-9+\s]+$/;
    if (!allowedChars.test(phone)) {
      setError('Invalid mobile number');
      return;
    }
  
    // Remove spaces
    let cleaned = phone.replace(/\s+/g, "");
  
    // Handle country/leading prefixes
    if (cleaned.startsWith("+91")) {
      cleaned = cleaned.slice(3);
    }
    else if (cleaned.startsWith("091")) {
      cleaned = cleaned.slice(3);
    } else if (cleaned.startsWith("91")) {
      cleaned = cleaned.slice(2);
    } else if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }
   
    if(cleaned.length != 10)
    {
      setError('Phone number is not valid ');
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register",{name:signupForm.name,email:signupForm.email,password:signupForm.password,phone:signupForm.phone})
      setUserEmail(email);
      setCurrentView('verification');
      setSuccess('Verification email sent successfully!');
    } catch (err:any) {
      setError(err.data?err.data.message:err.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    clearMessages();
    
    if (!forgotEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/forgotpassword',{email:forgotEmail});
      setSuccess('Password reset email sent successfully!');
    } catch (err:any) {
      setError(err.data?err.data.message:err.message);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return ( <div className="bg-gradient-to-br flex-1 relative from-black via-gray-900 to-black flex  items-center justify-center p-4">
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
      </div>

      {/* Main container */}
      <div className="relative w-full flex-1 max-w-md">
        <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            {/* Login Form */}
            {currentView === 'login' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-gray-400">Sign in to your account</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5 pointer-events-none z-10" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                      className="w-full pl-10 pr-4 py-4 bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5 pointer-events-none z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                      className="w-full pl-10 pr-12 py-4 bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentView('forgot')}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border bg-red-950/40 border-red-500/30 text-red-200">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border bg-green-950/40 border-green-500/30 text-green-200">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{success}</span>
                    </div>
                  )}

                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-gray-400">Don't have an account? </span>
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            )}

            {/* Signup Form */}
            {currentView === 'signup' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Create Account
                  </h1>
                  <p className="text-gray-400">Join us today</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5 pointer-events-none z-10" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, handleSignup)}
                      className="w-full pl-10 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5 pointer-events-none z-10" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, handleSignup)}
                      className="w-full pl-10 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5 pointer-events-none z-10" />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, handleSignup)}
                      className="w-full pl-10 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5 pointer-events-none z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password (min 8 characters)"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, handleSignup)}
                      className="w-full pl-10 pr-12 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border bg-red-950/40 border-red-500/30 text-red-200">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border bg-green-950/40 border-green-500/30 text-green-200">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{success}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Create Account
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-gray-400">Already have an account? </span>
                  <button
                    onClick={() => setCurrentView('login')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Form */}
            {currentView === 'forgot' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Reset Password
                  </h1>
                  <p className="text-gray-400">Enter your email to receive reset instructions</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5 pointer-events-none z-10" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleForgotPassword)}
                      className="w-full pl-10 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border bg-red-950/40 border-red-500/30 text-red-200">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border bg-green-950/40 border-green-500/30 text-green-200">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{success}</span>
                    </div>
                  )}

                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Send Reset Email
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setCurrentView('login')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-semibold flex items-center gap-2 mx-auto"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </button>
                </div>
              </div>
            )}

            {/* Verification Message */}
            {currentView === 'verification' && (
              <div className="space-y-6 text-center">
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Check Your Email
                  </h1>
                  <p className="text-gray-400 max-w-md mx-auto">
                    We've sent a verification link to <span className="text-white font-semibold">{userEmail}</span>. 
                    Please click the link to verify your account before signing in.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center gap-3 text-yellow-200">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">Check your email. verify your email to continue</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCurrentView('login')}
                    className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Sign In
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-sm"></div>
      </div>

      {/* Demo instructions */}
      {/* <div className="absolute bottom-4 left-4 right-4 text-center">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 max-w-md mx-auto">
          <p className="text-gray-400 text-sm">
            <strong>Demo:</strong> Login with test@example.com / password or try signup with any details
          </p>
        </div>
      </div> */}
    </div>
   
  );
};

