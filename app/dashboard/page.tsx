"use client"

import { useRouter } from "next/navigation"
import { Dashboard } from "@/components/dashboard"
import { useAuthSession } from "@/hooks/use-auth-session"

export default function DashboardPage() {
  const router = useRouter()
  const { session, isLoading, logout } = useAuthSession()

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
        Loading dashboard...
      </div>
    )
  }

  return (
    <Dashboard
      token={session.token}
      userName={session.user.username}
      onLogout={logout}
      onProfileClick={() => router.push("/profile")}
      onGoalsClick={() => router.push("/goals")}
      onBillsClick={() => router.push("/bills")}
      onReportsClick={() => router.push("/reports")}
    />
  )
}
