import { useRef } from "react";

export function useDebounce(fn: Function, delay: number) {
  const timeoutRef = useRef<any>(null);

  function debouncedFn(...args: any) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }

  return debouncedFn;
}