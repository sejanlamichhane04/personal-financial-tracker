"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { clearStoredAuth, getStoredAuth } from "@/lib/auth"
import type { AuthSession } from "@/lib/finance"

export function useAuthSession() {
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedSession = getStoredAuth()

    if (!storedSession) {
      clearStoredAuth()
      router.replace("/auth")
      setIsLoading(false)
      return
    }

    setSession(storedSession)
    setIsLoading(false)
  }, [router])

  const logout = () => {
    clearStoredAuth()
    setSession(null)
    router.replace("/auth")
  }

  return { session, isLoading, logout }
}
