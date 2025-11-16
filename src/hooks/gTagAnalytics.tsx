"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams ? "?" + searchParams.toString() : "");

    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);
}
