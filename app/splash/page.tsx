"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SplashScreen } from "@/components/splash-screen"

export default function SplashPage() {
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth")
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])
  return <SplashScreen />
} 