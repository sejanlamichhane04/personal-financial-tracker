"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  PieChart,
  Filter,
  Download,
  Plus,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TransactionList } from "@/components/transaction-list"
import { BudgetOverview } from "@/components/budget-overview"
import { ExpenseChart } from "@/components/expense-chart"
import { IncomeChart } from "@/components/income-chart"
import { ApiError, createTransaction, fetchGoals, fetchSummary, fetchTransactions } from "@/lib/api"
import type { Goal, Summary, Transaction, TransactionPayload } from "@/lib/finance"

interface DashboardProps {
  token: string
  userName: string
  onLogout: () => void
  onProfileClick: () => void
  onGoalsClick: () => void
  onBillsClick: () => void
  onReportsClick: () => void
}

const buildExpenseBreakdown = (transactions: Transaction[]) => {
  const expenseTotals = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<string, number>>((totals, transaction) => {
      totals[transaction.category] = (totals[transaction.category] ?? 0) + Math.abs(transaction.amount)
      return totals
    }, {})

  return Object.entries(expenseTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((left, right) => right.amount - left.amount)
}

const buildIncomeTrend = (transactions: Transaction[]) => {
  const totalsByMonth = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce<Record<string, number>>((totals, transaction) => {
      const key = transaction.date.slice(0, 7)
      totals[key] = (totals[key] ?? 0) + Math.abs(transaction.amount)
      return totals
    }, {})

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - index))

    const month = String(date.getMonth() + 1).padStart(2, "0")
    const key = `${date.getFullYear()}-${month}`

    return {
      label: date.toLocaleString("en-US", { month: "short" }),
      amount: totalsByMonth[key] ?? 0,
    }
  })
}

export function Dashboard({
  token,
  userName,
  onLogout,
  onProfileClick,
  onGoalsClick,
  onBillsClick,
  onReportsClick,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [summary, setSummary] = useState<Summary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError("")

    try {
      const [nextTransactions, nextGoals, nextSummary] = await Promise.all([
        fetchTransactions(token),
        fetchGoals(token),
        fetchSummary(token),
      ])

      setTransactions(nextTransactions.sort((left, right) => right.date.localeCompare(left.date)))
      setGoals(nextGoals)
      setSummary(nextSummary)
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 401) {
        onLogout()
        return
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard data.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboardData()
  }, [token])

  const handleCreateTransaction = async (payload: TransactionPayload) => {
    setIsSubmitting(true)
    setError("")

    try {
      const createdTransaction = await createTransaction(token, payload)

      setTransactions((currentTransactions) =>
        [createdTransaction, ...currentTransactions].sort((left, right) => right.date.localeCompare(left.date))
      )

      setSummary((currentSummary) => {
        if (!currentSummary) {
          return currentSummary
        }

        const totalIncome =
          currentSummary.totalIncome + (createdTransaction.type === "income" ? createdTransaction.amount : 0)
        const totalExpense =
          currentSummary.totalExpense + (createdTransaction.type === "expense" ? createdTransaction.amount : 0)

        return {
          totalIncome,
          totalExpense,
          net: totalIncome - totalExpense,
        }
      })
    } catch (createError) {
      if (createError instanceof ApiError && createError.status === 401) {
        onLogout()
        return
      }

      setError(createError instanceof Error ? createError.message : "Unable to add the transaction.")
      throw createError
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const expenseBreakdown = buildExpenseBreakdown(transactions)
  const incomeTrend = buildIncomeTrend(transactions)
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onGoalsClick={onGoalsClick}
        onBillsClick={onBillsClick}
        onReportsClick={onReportsClick}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">Financial Dashboard</h1>
              <p className="text-slate-400 text-lg">Welcome back, {userName}. Here's your live financial overview.</p>
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
              <Button
                size="lg"
                className="primary-solid text-white shadow-lg neon-glow-purple hover:bg-purple-700"
                onClick={() => setActiveTab("transactions")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          {error ? <p className="mb-6 text-sm text-red-400">{error}</p> : null}

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
                      ${summary ? summary.net.toLocaleString() : "0"}
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                      <span className="text-slate-400">Income minus expenses across your tracked transactions</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="premium-card border-0 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Recorded Income</CardTitle>
                    <div className="p-2 rounded-lg success-solid">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      +${summary ? summary.totalIncome.toLocaleString() : "0"}
                    </div>
                    <div className="text-sm text-slate-400">Pulled from your backend transaction history</div>
                  </CardContent>
                </Card>

                <Card className="premium-card border-0 shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Recorded Expenses</CardTitle>
                    <div className="p-2 rounded-lg danger-solid">
                      <ArrowDownRight className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      -${summary ? summary.totalExpense.toLocaleString() : "0"}
                    </div>
                    <div className="text-sm text-slate-400">Every expense entry currently stored in the backend</div>
                  </CardContent>
                </Card>

                <Card className="premium-card border-0 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Goal Savings</CardTitle>
                    <div className="p-2 rounded-lg info-solid">
                      <PieChart className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400 mb-2">${totalSavings.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">Current amount saved across your financial goals</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <Card className="premium-card border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                      Expense Breakdown
                    </CardTitle>
                    <CardDescription className="text-slate-400">Your spending by category from saved transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExpenseChart expenses={expenseBreakdown} />
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
                    {isLoading ? (
                      <p className="text-slate-400">Loading transactions...</p>
                    ) : recentTransactions.length === 0 ? (
                      <p className="text-slate-400">No transactions yet. Add one from the Transactions tab.</p>
                    ) : (
                      <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
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
                                {transaction.type === "income" ? "+" : "-"}$
                                {Math.abs(transaction.amount).toLocaleString()}
                              </p>
                              <p className="text-xs text-slate-400">{transaction.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionList
                transactions={transactions}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                onCreateTransaction={handleCreateTransaction}
              />
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
                    <CardDescription className="text-slate-400">Monthly income over the past six months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IncomeChart incomeData={incomeTrend} />
                  </CardContent>
                </Card>

                <Card className="premium-card border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                      Expense Trends
                    </CardTitle>
                    <CardDescription className="text-slate-400">Expense categories pulled from the backend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExpenseChart expenses={expenseBreakdown} />
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
