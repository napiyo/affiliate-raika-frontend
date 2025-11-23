"use client";
import { PropsWithChildren, useEffect, useRef } from "react";
import { useAuthStore } from "./userStore";
import api from "./apiService";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function UserProvider({ children }: PropsWithChildren) {
  const { login, logout, isLoggedIn } = useAuthStore();
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Verify auth once when component mounts
    if (hasFetchedRef.current || isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

  

    api
      .get("/auth/me", {
        withCredentials: true, // Ensure cookies are sent
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      .then((res) => {
       
        if (res.data?.data) {
          login(res.data.data);
         
        } else {
          logout();
          toast.error("Session expired. Please log in again.");
        }
      })
      .catch((error: AxiosError) => {
        // Handle different error scenarios
        if (error.response?.status === 401) {
          logout();
          toast.error("Session expired. Please log in again.");
        } else if (error.response?.status && error.response.status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          logout();
          toast.error("Authentication failed. Please log in again.");
        }
       
      })
      .finally(() => {
        hasFetchedRef.current = true;
        isFetchingRef.current = false;
      });
  }, [login, logout]); // Removed isLoggedIn from dependencies

  return children
}