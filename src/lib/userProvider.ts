"use client";
import { PropsWithChildren, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "./userStore";
import api from "./apiService";

export default function UserProvider({ children }: PropsWithChildren) {
  const { login, logout, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    // Always check auth on mount, regardless of persisted state
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me', {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });
        
        if (res.data?.data) {
          login(res.data.data);
        } else {
          logout();
        }
      } catch (error: any) {
        // Silent logout if request fails (cookie expired/invalid)
        logout();
        
        // Only show error if it's not a 401 (unauthorized)
        if (error.response?.status !== 401) {
          // console.error('Auth check failed:', error);
          toast.error("Not authorized")
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Only run once on mount

 

  return children;
}
