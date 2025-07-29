"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, Facebook, Chrome } from "lucide-react"

interface AuthPageProps {
  onAuthSuccess: () => void
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onAuthSuccess()
    }, 2000)
  }

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true)
    // Simulate social auth
    setTimeout(() => {
      setIsLoading(false)
      onAuthSuccess()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-purple-500/5 rounded-full"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-blue-500/5 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-48 h-48 bg-green-500/5 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-yellow-500/5 rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto primary-solid rounded-2xl flex items-center justify-center shadow-2xl neon-glow-purple mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to WealthTracker</h1>
          <p className="text-slate-400">Manage your finances with confidence</p>
        </div>

        {/* Auth Card */}
        <Card className="premium-card border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-white">Get Started</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 glass-effect p-1 h-12">
                <TabsTrigger
                  value="login"
                  className="text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 glass-effect border-white/20 text-white placeholder:text-slate-400 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 glass-effect border-white/20 text-white placeholder:text-slate-400 h-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-600"
                      />
                      <Label htmlFor="remember" className="text-sm text-slate-300">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto">
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full primary-solid text-white h-12 shadow-lg neon-glow-purple hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 glass-effect border-white/20 text-white placeholder:text-slate-400 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 glass-effect border-white/20 text-white placeholder:text-slate-400 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 glass-effect border-white/20 text-white placeholder:text-slate-400 h-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-slate-300">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 glass-effect border-white/20 text-white placeholder:text-slate-400 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-600"
                      required
                    />
                    <Label htmlFor="terms" className="text-sm text-slate-300">
                      I agree to the{" "}
                      <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full primary-solid text-white h-12 shadow-lg neon-glow-purple hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button
                  variant="outline"
                  className="glass-effect border-white/20 text-white hover:bg-white/10 bg-transparent"
                  onClick={() => handleSocialAuth("google")}
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="glass-effect border-white/20 text-white hover:bg-white/10 bg-transparent"
                  onClick={() => handleSocialAuth("facebook")}
                  disabled={isLoading}
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-400">
          <p>© 2024 WealthTracker. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Button variant="link" className="text-slate-400 hover:text-white p-0 h-auto text-sm">
              Privacy
            </Button>
            <Button variant="link" className="text-slate-400 hover:text-white p-0 h-auto text-sm">
              Terms
            </Button>
            <Button variant="link" className="text-slate-400 hover:text-white p-0 h-auto text-sm">
              Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
