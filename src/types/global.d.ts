export {};

declare global {
  interface Window {
    __clarity_initialized__?: boolean;
      gtag?: (...args: any[]) => void; 
  }
}
