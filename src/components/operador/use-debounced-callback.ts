"use client"

import { useEffect, useRef, useCallback } from "react"

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fnRef = useRef(fn)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => {
        fnRef.current(...args)
      }, delay)
    },
    [delay],
  )
}
