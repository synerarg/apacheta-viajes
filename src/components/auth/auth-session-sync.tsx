"use client"

import { useEffect, useEffectEvent, useRef } from "react"
import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export function AuthSessionSync() {
  const router = useRouter()
  const lastSyncedUserIdRef = useRef<string | null>(null)

  const syncSession = useEffectEvent(async (forceRefresh = false) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    let shouldRefresh = forceRefresh

    if (user && lastSyncedUserIdRef.current !== user.id) {
      await fetch("/api/auth/sync-profile", {
        method: "POST",
        credentials: "same-origin",
      })

      lastSyncedUserIdRef.current = user.id
      shouldRefresh = true
    }

    if (!user && lastSyncedUserIdRef.current) {
      lastSyncedUserIdRef.current = null
      shouldRefresh = true
    }

    if (shouldRefresh) {
      router.refresh()
    }
  })

  useEffect(() => {
    void syncSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        void syncSession(true)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return null
}
