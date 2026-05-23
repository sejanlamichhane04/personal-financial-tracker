"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthPage } from "@/components/auth-page"
import { getStoredAuth, setStoredAuth } from "@/lib/auth"
import type { AuthSession } from "@/lib/finance"

export default function Auth() {
  const router = useRouter()

  useEffect(() => {
    if (getStoredAuth()) {
      router.replace("/dashboard")
    }
  }, [router])

  const handleAuthSuccess = (session: AuthSession) => {
    setStoredAuth(session)
    router.push("/dashboard")
  }

  return <AuthPage onAuthSuccess={handleAuthSuccess} />
}
