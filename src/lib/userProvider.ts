"use client";

import { PropsWithChildren, useEffect, useRef } from "react";
import { useAuthStore } from "./userStore";
import api from "./apiService";
import { toast } from "sonner";


export default function UserProvider({ children }: PropsWithChildren) {
  
    const { login, logout ,isLoggedIn} = useAuthStore();
const hasFetched = useRef(false);

    useEffect(() => {
      if(!isLoggedIn)return;
      
     if (hasFetched.current) return;
    hasFetched.current = true;
      api.get('/auth/me', {headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }}).then((res)=>{    
        if(res.data?.data)
        {
            login(res.data.data);
        }
        else{
          logout()
        }
         
      }).catch((error)=>{
    
        
        logout()
          toast.error(error.message);
      });
  
    }, []);
  

  return (children);
}
