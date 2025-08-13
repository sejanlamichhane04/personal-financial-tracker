"use client"
import { Dashboard } from "@/components/dashboard"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  return (
    <Dashboard 
      onLogout={() => router.push("/auth")} 
      onProfileClick={() => router.push("/profile")}
      onGoalsClick={() => router.push("/goals")}
      onBillsClick={() => router.push("/bills")}
      onReportsClick={() => router.push("/reports")}
    />
  )
} 