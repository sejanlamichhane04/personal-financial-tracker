"use client"

import { useEffect, useState } from "react"
import { TrendingUp, DollarSign, BarChart3, Shield } from "lucide-react"

export function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-green-500/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-500/10 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="text-center z-10 space-y-8">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto primary-solid rounded-3xl flex items-center justify-center shadow-2xl neon-glow-purple animate-bounce">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>

          {/* Floating Icons */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-float">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-float delay-1000">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-float delay-2000">
            <Shield className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-white animate-fade-in">WealthTracker</h1>
          <p className="text-xl text-slate-400 animate-fade-in delay-500">Your Personal Finance Companion</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto animate-fade-in delay-1000">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-500/20 rounded-xl flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm text-slate-400">Track</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-xl flex items-center justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-sm text-slate-400">Analyze</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-xl flex items-center justify-center mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-sm text-slate-400">Grow</p>
          </div>
        </div>

        {/* Loading Progress */}
        <div className="space-y-4 animate-fade-in delay-1500">
          <div className="w-64 mx-auto bg-white/10 rounded-full h-2">
            <div
              className="h-2 primary-solid rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-400">Loading your financial dashboard...</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-1500 {
          animation-delay: 1.5s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
