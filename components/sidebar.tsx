"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  CreditCard,
  Target,
  TrendingUp,
  User,
  LogOut,
  PiggyBank,
  Calendar,
  FileText,
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
  onProfileClick: () => void
  onGoalsClick: () => void
  onBillsClick: () => void
  onReportsClick: () => void
}

export function Sidebar({ activeTab, setActiveTab, onLogout, onProfileClick, onGoalsClick, onBillsClick, onReportsClick }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "budget", label: "Budget", icon: Target },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <div className="w-80 glass-effect border-r border-white/10 p-8">
      {/* Logo Section */}
      <div className="flex items-center space-x-3 mb-12">
        <div className="w-12 h-12 primary-solid rounded-2xl flex items-center justify-center shadow-lg neon-glow-purple">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">WealthTracker</h2>
          <p className="text-sm text-slate-400">Premium Finance</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="mb-8 p-4 rounded-2xl glass-effect cursor-pointer hover:bg-white/10 transition-all duration-200" onClick={onProfileClick}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 primary-solid rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">John Doe</p>
            <p className="text-xs text-slate-400">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-3 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-12 text-left rounded-xl transition-all duration-200",
                activeTab === item.id
                  ? "primary-solid text-white shadow-lg neon-glow-purple hover:bg-purple-700"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="w-5 h-5 mr-4" />
              <span className="font-medium">{item.label}</span>
            </Button>
          )
        })}
      </nav>

      {/* Additional Options */}
      <div className="space-y-3 pt-8 border-t border-white/10 mb-8">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl"
          onClick={onGoalsClick}
        >
          <PiggyBank className="w-5 h-5 mr-4" />
          <span className="font-medium">Goals</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl"
          onClick={onBillsClick}
        >
          <Calendar className="w-5 h-5 mr-4" />
          <span className="font-medium">Bills</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl"
          onClick={onReportsClick}
        >
          <FileText className="w-5 h-5 mr-4" />
          <span className="font-medium">Reports</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl"
        >
          <CreditCard className="w-5 h-5 mr-4" />
          <span className="font-medium">Cards</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl"
        >
          <Settings className="w-5 h-5 mr-4" />
          <span className="font-medium">Settings</span>
        </Button>
      </div>

      {/* Logout Button */}
      <Button
        onClick={onLogout}
        variant="ghost"
        className="w-full justify-start h-12 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl mb-8"
      >
        <LogOut className="w-5 h-5 mr-4" />
        <span className="font-medium">Sign Out</span>
      </Button>

      {/* Upgrade Card */}
      <div className="p-6 rounded-2xl bg-slate-800/50 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-white mb-2">Upgrade to Pro</h3>
        <p className="text-sm text-slate-300 mb-4">Unlock advanced analytics and unlimited transactions</p>
        <Button className="w-full primary-solid text-white shadow-lg hover:bg-purple-700">Upgrade Now</Button>
      </div>
    </div>
  )
}
