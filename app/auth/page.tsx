    "use client"
import { AuthPage } from "@/components/auth-page"
import { useRouter } from "next/navigation"

export default function Auth() {
  const router = useRouter()
  return <AuthPage onAuthSuccess={() => router.push("/dashboard")}/>
} 