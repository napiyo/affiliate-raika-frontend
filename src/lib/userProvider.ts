"use client";

import { PropsWithChildren, useEffect } from "react";
import { useAuthStore } from "./userStore";
import api from "./apiService";
import { toast } from "sonner";

export default function UserProvider({ children }: PropsWithChildren) {
  
    const { login, logout, isLoggedIn } = useAuthStore();

    useEffect(() => {
      if (!isLoggedIn) return;
  
      api.get('/auth/me', {headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }}).then((res)=>{    
    
        if(res.data?.data)
        {
            login(res.data.data);
        }
          
         
      }).catch((error)=>{
          toast.error(error.message);
      });
    }, [isLoggedIn, login, logout]);
  

  return (children);
}
