"use client";

import { useEffect } from "react";

export default function ClarityProvider() {
  useEffect(() => {
    // Prevent double init (Next hot reload or React strict mode)
    if (typeof window !== "undefined" && window.__clarity_initialized__) {
      return;
    }
    window.__clarity_initialized__ = true;

    // Load Clarity when browser is idle (best performance)
    const loadClarity = () => {
      (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.async = true;

        // ⭐ ORIGINAL CLARITY SCRIPT (unchanged)
        t.src = "https://www.clarity.ms/tag/u6uxi0st3d";

        y = l.getElementsByTagName(r)[0];
        y.parentNode!.insertBefore(t, y);
      })(window, document, "clarity", "script", "u6uxi0st3d");
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadClarity);
    } else {
      // Fallback for Safari
      setTimeout(loadClarity, 1);
    }
  }, []);

  return null;
}
