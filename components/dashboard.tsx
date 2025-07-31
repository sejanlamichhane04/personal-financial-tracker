"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Plus,
  Filter,
  Download,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TransactionList } from "@/components/transaction-list"
import { BudgetOverview } from "@/components/budget-overview"
import { ExpenseChart } from "@/components/expense-chart"
import { IncomeChart } from "@/components/income-chart"

interface DashboardProps {
  onLogout: () => void
  onProfileClick: () => void
}

export function Dashboard({ onLogout, onProfileClick }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const financialData = {
    totalBalance: 12450.75,
    monthlyIncome: 5200.0,
    monthlyExpenses: 3850.25,
    savings: 8600.5,
    balanceChange: 12.5,
    incomeChange: 8.2,
    expenseChange: -5.1,
    savingsChange: 15.3,
  }

  const recentTransactions = [
    { id: 1, description: "Salary Deposit", amount: 5200.0, type: "income", category: "Salary", date: "2024-01-15" },
    { id: 2, description: "Grocery Shopping", amount: -125.5, type: "expense", category: "Food", date: "2024-01-14" },
    { id: 3, description: "Electric Bill", amount: -89.25, type: "expense", category: "Utilities", date: "2024-01-13" },
    {
      id: 4,
      description: "Freelance Project",
      amount: 750.0,
      type: "income",
      category: "Freelance",
      date: "2024-01-12",
    },
    {
      id: 5,
      description: "Gas Station",
      amount: -45.0,
      type: "expense",
      category: "Transportation",
      date: "2024-01-11",
    },
  ]

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} onProfileClick={onProfileClick} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">Financial Dashboard</h1>
              <p className="text-slate-400 text-lg">Welcome back! Here's your financial overview</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="glass-effect border-slate-600 hover:bg-slate-700 bg-transparent text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="glass-effect border-slate-600 hover:bg-slate-700 bg-transparent text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="lg" className="primary-solid text-white shadow-lg neon-glow-purple hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 glass-effect p-1 h-14">
              <TabsTrigger
                value="overview"
                className="text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="budget"
                className="text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Budget
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Financial Overview Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="premium-card border-0 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Total Balance</CardTitle>
                    <div className="p-2 rounded-lg primary-solid">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-2">
                      ${financialData.totalBalance.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                      <span className="text-green-400">+{financialData.balanceChange}%</span>
                      <span className="text-slate-400 ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="premium-card border-0 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Monthly Income</CardTitle>
                    <div className="p-2 rounded-lg success-solid">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      +${financialData.monthlyIncome.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                      <span className="text-green-400">+{financialData.incomeChange}%</span>
                      <span className="text-slate-400 ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="premium-card border-0 shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Monthly Expenses</CardTitle>
                    <div className="p-2 rounded-lg danger-solid">
                      <ArrowDownRight className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      -${financialData.monthlyExpenses.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingDown className="w-4 h-4 mr-1 text-green-400" />
                      <span className="text-green-400">{financialData.expenseChange}%</span>
                      <span className="text-slate-400 ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="premium-card border-0 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Total Savings</CardTitle>
                    <div className="p-2 rounded-lg info-solid">
                      <PieChart className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      ${financialData.savings.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                      <span className="text-green-400">+{financialData.savingsChange}%</span>
                      <span className="text-slate-400 ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Recent Transactions */}
              <div className="grid gap-8 lg:grid-cols-2">
                <Card className="premium-card border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                      Expense Breakdown
                    </CardTitle>
                    <CardDescription className="text-slate-400">Your spending by category this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExpenseChart />
                  </CardContent>
                </Card>

                <Card className="premium-card border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      Recent Transactions
                    </CardTitle>
                    <CardDescription className="text-slate-400">Your latest financial activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.slice(0, 5).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-xl glass-effect hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                transaction.type === "income"
                                  ? "bg-green-400 shadow-lg shadow-green-400/50"
                                  : "bg-red-400 shadow-lg shadow-red-400/50"
                              }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-white">{transaction.description}</p>
                              <p className="text-xs text-slate-400">{transaction.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-sm font-semibold ${
                                transaction.type === "income" ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400">{transaction.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionList transactions={recentTransactions} />
            </TabsContent>

            <TabsContent value="budget">
              <BudgetOverview />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid gap-8 lg:grid-cols-2">
                <Card className="premium-card border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      Income Trends
                    </CardTitle>
                    <CardDescription className="text-slate-400">Monthly income over the past year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IncomeChart />
                  </CardContent>
                </Card>

                <Card className="premium-card border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                      Expense Trends
                    </CardTitle>
                    <CardDescription className="text-slate-400">Monthly expenses by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExpenseChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
