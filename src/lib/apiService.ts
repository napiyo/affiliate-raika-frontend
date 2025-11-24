// lib/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { z } from "zod";

// --- Error schema validation with Zod ---
const ApiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

// export type ApiError = z.infer<typeof ApiErrorSchema>;

// --- Axios instance ---
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE,
  withCredentials: true, // needed for secure cookies
});

// --- Response interceptor ---
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    let { response } = error;

    if (response?.data) {
      const parsed = ApiErrorSchema.safeParse(response.data);

      if (
        parsed.success &&
        parsed.data.message.startsWith("invalid-user")
      ) {
      
        if (typeof window !== "undefined") {
          if (!window.location.pathname.startsWith('/auth')) {
            window.location.href = "/auth";
          }
        }
      }
    }
    
    return Promise.reject((response?response.data:error));
  }
);

export default api;
