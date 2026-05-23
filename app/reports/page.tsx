"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ApiError, fetchBills, fetchGoals, fetchTransactions } from "@/lib/api"
import { useAuthSession } from "@/hooks/use-auth-session"
import type { Bill, Goal, Transaction } from "@/lib/finance"
import {
  Download,
  FileText,
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react"

type ReportType = "transactions" | "bills" | "goals"

export default function ReportsPage() {
  const { session, isLoading: isSessionLoading, logout } = useAuthSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  const [selectedReport, setSelectedReport] = useState<ReportType>("transactions")

  useEffect(() => {
    if (!session) {
      return
    }

    const loadReportsData = async () => {
      setIsLoading(true)
      setError("")

      try {
        const [nextTransactions, nextBills, nextGoals] = await Promise.all([
          fetchTransactions(session.token),
          fetchBills(session.token),
          fetchGoals(session.token),
        ])

        setTransactions(nextTransactions)
        setBills(nextBills)
        setGoals(nextGoals)
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          logout()
          return
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load reports.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadReportsData()
  }, [session])

  const isWithinDateRange = (value: string) => {
    if (dateRange.startDate && value < dateRange.startDate) {
      return false
    }

    if (dateRange.endDate && value > dateRange.endDate) {
      return false
    }

    return true
  }

  const filteredTransactions = transactions.filter((transaction) => isWithinDateRange(transaction.date))
  const filteredBills = bills.filter((bill) => isWithinDateRange(bill.dueDate))
  const filteredGoals = goals.filter((goal) => isWithinDateRange(goal.targetDate))

  const transactionIncome = filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const transactionExpenses = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalBills = filteredBills.reduce((sum, bill) => sum + bill.amount, 0)
  const paidBills = filteredBills.filter((bill) => bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0)

  const totalGoalTarget = filteredGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalGoalCurrent = filteredGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const goalProgress = totalGoalTarget === 0 ? 0 : (totalGoalCurrent / totalGoalTarget) * 100

  const generateCSV = () => {
    let csvContent = ""

    if (selectedReport === "transactions") {
      csvContent = "Date,Description,Amount,Type,Category\n"
      filteredTransactions.forEach((transaction) => {
        csvContent += `${transaction.date},${transaction.description},${transaction.amount},${transaction.type},${transaction.category}\n`
      })
    }

    if (selectedReport === "bills") {
      csvContent = "Name,Amount,Due Date,Status,Category\n"
      filteredBills.forEach((bill) => {
        csvContent += `${bill.name},${bill.amount},${bill.dueDate},${bill.isPaid ? "Paid" : "Unpaid"},${bill.category}\n`
      })
    }

    if (selectedReport === "goals") {
      csvContent = "Goal Name,Target Amount,Current Amount,Target Date,Category\n"
      filteredGoals.forEach((goal) => {
        csvContent += `${goal.name},${goal.targetAmount},${goal.currentAmount},${goal.targetDate},${goal.category}\n`
      })
    }

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement("a")

    anchor.href = url
    anchor.download = `${selectedReport}_report_${new Date().toISOString().split("T")[0]}.csv`
    anchor.click()
    window.URL.revokeObjectURL(url)
  }

  if (isSessionLoading || !session) {
    return <div className="container mx-auto p-6 max-w-4xl">Loading reports...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reports & Export</h1>
          <p className="text-muted-foreground">Generate reports and export your financial data</p>
        </div>
      </div>

      {error ? <p className="mb-6 text-sm text-red-500">{error}</p> : null}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Select Report Type
          </CardTitle>
          <CardDescription>Choose what type of data you want to export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={selectedReport === "transactions" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setSelectedReport("transactions")}
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Transactions</span>
            </Button>
            <Button
              variant={selectedReport === "bills" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setSelectedReport("bills")}
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span>Bills</span>
            </Button>
            <Button
              variant={selectedReport === "goals" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => setSelectedReport("goals")}
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Goals</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Date Range (Optional)
          </CardTitle>
          <CardDescription>Filter data by date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedReport === "transactions" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">${transactionIncome.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Income</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">${transactionExpenses.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">${(transactionIncome - transactionExpenses).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Net Amount</p>
              </div>
            </div>
          ) : null}

          {selectedReport === "bills" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">${totalBills.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Bills</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">${paidBills.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">${(totalBills - paidBills).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Unpaid</p>
              </div>
            </div>
          ) : null}

          {selectedReport === "goals" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">${totalGoalTarget.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Target</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">${totalGoalCurrent.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Saved</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{goalProgress.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Download your data in different formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">CSV Export</h3>
                <p className="text-sm text-muted-foreground">Download as CSV file for Excel or other spreadsheet software</p>
              </div>
              <Button onClick={generateCSV} disabled={isLoading}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">PDF Report</h3>
                <p className="text-sm text-muted-foreground">Generate a formatted PDF report (Coming Soon)</p>
              </div>
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>Preview of the data that will be exported</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading report data...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      {selectedReport === "transactions" ? (
                        <>
                          <th className="border border-gray-200 p-2 text-left">Date</th>
                          <th className="border border-gray-200 p-2 text-left">Description</th>
                          <th className="border border-gray-200 p-2 text-left">Amount</th>
                          <th className="border border-gray-200 p-2 text-left">Type</th>
                          <th className="border border-gray-200 p-2 text-left">Category</th>
                        </>
                      ) : null}
                      {selectedReport === "bills" ? (
                        <>
                          <th className="border border-gray-200 p-2 text-left">Name</th>
                          <th className="border border-gray-200 p-2 text-left">Amount</th>
                          <th className="border border-gray-200 p-2 text-left">Due Date</th>
                          <th className="border border-gray-200 p-2 text-left">Status</th>
                        </>
                      ) : null}
                      {selectedReport === "goals" ? (
                        <>
                          <th className="border border-gray-200 p-2 text-left">Goal Name</th>
                          <th className="border border-gray-200 p-2 text-left">Target Amount</th>
                          <th className="border border-gray-200 p-2 text-left">Current Amount</th>
                          <th className="border border-gray-200 p-2 text-left">Progress</th>
                        </>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport === "transactions"
                      ? filteredTransactions.slice(0, 5).map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="border border-gray-200 p-2">{transaction.date}</td>
                            <td className="border border-gray-200 p-2">{transaction.description}</td>
                            <td className="border border-gray-200 p-2">${transaction.amount.toFixed(2)}</td>
                            <td className="border border-gray-200 p-2">
                              <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                                {transaction.type}
                              </Badge>
                            </td>
                            <td className="border border-gray-200 p-2">{transaction.category}</td>
                          </tr>
                        ))
                      : null}
                    {selectedReport === "bills"
                      ? filteredBills.slice(0, 5).map((bill) => (
                          <tr key={bill.id}>
                            <td className="border border-gray-200 p-2">{bill.name}</td>
                            <td className="border border-gray-200 p-2">${bill.amount.toFixed(2)}</td>
                            <td className="border border-gray-200 p-2">{bill.dueDate}</td>
                            <td className="border border-gray-200 p-2">
                              <Badge variant={bill.isPaid ? "default" : "secondary"}>
                                {bill.isPaid ? "Paid" : "Unpaid"}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      : null}
                    {selectedReport === "goals"
                      ? filteredGoals.slice(0, 5).map((goal) => (
                          <tr key={goal.id}>
                            <td className="border border-gray-200 p-2">{goal.name}</td>
                            <td className="border border-gray-200 p-2">${goal.targetAmount.toFixed(2)}</td>
                            <td className="border border-gray-200 p-2">${goal.currentAmount.toFixed(2)}</td>
                            <td className="border border-gray-200 p-2">
                              {goal.targetAmount === 0 ? 0 : ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Showing first 5 records. Full data will be included in the export.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
