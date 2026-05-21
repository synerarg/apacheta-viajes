"use client"

import { useEffect, useMemo, useRef } from "react"

export type DebouncedFn<T extends (...args: never[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  flush: () => void
  cancel: () => void
}

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): DebouncedFn<T> {
  const fnRef = useRef(fn)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<Parameters<T> | null>(null)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return useMemo(() => {
    const debounced = ((...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      pendingRef.current = args
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        const pending = pendingRef.current
        pendingRef.current = null
        if (pending) fnRef.current(...pending)
      }, delay)
    }) as DebouncedFn<T>

    debounced.flush = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      const pending = pendingRef.current
      pendingRef.current = null
      if (pending) fnRef.current(...pending)
    }

    debounced.cancel = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      pendingRef.current = null
    }

    return debounced
  }, [delay])
}
