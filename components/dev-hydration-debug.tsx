"use client";

import { useEffect } from "react";

export default function DevHydrationDebug() {
  useEffect(() => {
    try {
      const attrs = Array.from(document.documentElement.attributes).map(
        (a) => ({ name: a.name, value: a.value })
      );
      // Log attributes present on the client root element so you can compare with server HTML
      // Check browser console after load to see if unexpected attributes (e.g., data-qb-installed) exist.
      // This component should be included only in development and will be tree-shaken in production.
      console.log(
        "DevHydrationDebug: document.documentElement attributes:",
        attrs
      );
    } catch (e) {
      console.warn("DevHydrationDebug error:", e);
    }
  }, []);

  return null;
}
