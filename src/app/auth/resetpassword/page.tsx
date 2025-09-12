'use client'
import { useState, ChangeEvent, JSX } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/lib/apiService';
import {  useRouter, useSearchParams } from 'next/navigation';

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  newPassword?: string;
  confirmPassword?: string;
  submit?: string;
}

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

interface PasswordRequirement {
  key: keyof Omit<PasswordValidation, 'isValid'>;
  text: string;
}

export default function ResetPasswordUI(): JSX.Element {
     const token = useSearchParams().get('token');
      const router = useRouter()
    
  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState<boolean>(false);

  // Password validation rules
  const validatePassword = (password: string): PasswordValidation => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
    };
  };

  const passwordValidation: PasswordValidation = validatePassword(formData.newPassword);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors: ValidationErrors = {};

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.newPassword = 'Password does not meet requirements';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await api.put(`/auth/reset/${token}`,{password:formData.confirmPassword});
      setSuccess(true);
    } catch (error:any) {
      
      setErrors({ submit: error.data?error.data.message : error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string): void => {
    // In a real Next.js app, you'd use useRouter from 'next/router'
    // const router = useRouter();
    // router.push(path);
    window.location.href = path;
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm'): void => {
    if (field === 'new') {
      setShowNewPassword(prev => !prev);
    } else {
      setShowConfirmPassword(prev => !prev);
    }
  };
  if(!token)
    {
        router.push("/");
        return <></>;
    }
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successfully!</h2>
            <p className="text-gray-600 mb-8">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button 
              onClick={() => handleNavigation('/auth')}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 px-4 font-medium hover:bg-indigo-700 transition-colors"
              type="button"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const passwordRequirements: PasswordRequirement[] = [
    { key: 'minLength', text: 'At least 8 characters' },
    { key: 'hasUppercase', text: 'One uppercase letter' },
    { key: 'hasLowercase', text: 'One lowercase letter' },
    { key: 'hasNumber', text: 'One number' },
    { key: 'hasSpecialChar', text: 'One special character' }
  ];

  const isSubmitDisabled: boolean = 
    isLoading || 
    !passwordValidation.isValid || 
    formData.newPassword !== formData.confirmPassword ||
    !formData.newPassword ||
    !formData.confirmPassword;

  return (  
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border text-black rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors pr-12 ${
                    errors.newPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                <div className="space-y-2">
                  {passwordRequirements.map(({ key, text }) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordValidation[key] ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        {passwordValidation[key] && (
                          <div className="w-2 h-2 bg-green-600 rounded-full" />
                        )}
                      </div>
                      <span className={passwordValidation[key] ? 'text-green-700' : 'text-gray-600'}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 text-black border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors pr-12 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 px-4 font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              type="button"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button 
                onClick={() => handleNavigation('/auth')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
                type="button"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  
  );
}