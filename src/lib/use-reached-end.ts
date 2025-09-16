'use client';

import { useEffect, useRef } from "react";

export function useEndReached(
  onEndReached?: () => void,
  { rootMargin = "200px", debounceMs = 500 } = {}
) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const lastCalledRef = useRef<number>(0);

  useEffect(() => {
    if (!onEndReached || !loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const now = Date.now();
          if (now - lastCalledRef.current > debounceMs) {
            lastCalledRef.current = now;
            onEndReached();
          }
        }
      },
      { root: null, rootMargin, threshold: 0 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [onEndReached, rootMargin, debounceMs]);

  return loaderRef;
}
