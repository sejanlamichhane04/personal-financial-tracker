"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  FileText, 
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter
} from "lucide-react"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  })

  const [selectedReport, setSelectedReport] = useState("transactions")

  // Mock data for reports
  const mockTransactions = [
    { id: 1, description: "Salary Deposit", amount: 5200.0, type: "income", category: "Salary", date: "2024-01-15" },
    { id: 2, description: "Grocery Shopping", amount: -125.5, type: "expense", category: "Food", date: "2024-01-14" },
    { id: 3, description: "Electric Bill", amount: -89.25, type: "expense", category: "Utilities", date: "2024-01-13" },
    { id: 4, description: "Freelance Project", amount: 750.0, type: "income", category: "Freelance", date: "2024-01-12" },
    { id: 5, description: "Gas Station", amount: -45.0, type: "expense", category: "Transportation", date: "2024-01-11" },
  ]

  const mockBills = [
    { name: "Electric Bill", amount: 89.25, dueDate: "2024-01-25", isPaid: false },
    { name: "Internet Bill", amount: 65.00, dueDate: "2024-01-28", isPaid: false },
    { name: "Credit Card Payment", amount: 250.00, dueDate: "2024-01-20", isPaid: true },
  ]

  const mockGoals = [
    { name: "Emergency Fund", targetAmount: 10000, currentAmount: 6500, progress: 65 },
    { name: "Vacation Fund", targetAmount: 3000, currentAmount: 1200, progress: 40 },
  ]

  const generateCSV = (data: any[], type: string) => {
    let csvContent = ""
    
    if (type === "transactions") {
      csvContent = "Date,Description,Amount,Type,Category\n"
      data.forEach(item => {
        csvContent += `${item.date},${item.description},${item.amount},${item.type},${item.category}\n`
      })
    } else if (type === "bills") {
      csvContent = "Name,Amount,Due Date,Status\n"
      data.forEach(item => {
        csvContent += `${item.name},${item.amount},${item.dueDate},${item.isPaid ? 'Paid' : 'Unpaid'}\n`
      })
    } else if (type === "goals") {
      csvContent = "Goal Name,Target Amount,Current Amount,Progress (%)\n"
      data.forEach(item => {
        csvContent += `${item.name},${item.targetAmount},${item.currentAmount},${item.progress}\n`
      })
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getReportData = () => {
    switch (selectedReport) {
      case "transactions":
        return mockTransactions
      case "bills":
        return mockBills
      case "goals":
        return mockGoals
      default:
        return []
    }
  }

  const getReportStats = () => {
    const data = getReportData()
    
    if (selectedReport === "transactions") {
      const income = data.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const expenses = data.filter(t => t.type === "expense").reduce((sum, t) => sum + Math.abs(t.amount), 0)
      return { income, expenses, net: income - expenses }
    } else if (selectedReport === "bills") {
      const total = data.reduce((sum, b) => sum + b.amount, 0)
      const paid = data.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0)
      return { total, paid, unpaid: total - paid }
    } else if (selectedReport === "goals") {
      const totalTarget = data.reduce((sum, g) => sum + g.targetAmount, 0)
      const totalCurrent = data.reduce((sum, g) => sum + g.currentAmount, 0)
      return { totalTarget, totalCurrent, progress: (totalCurrent / totalTarget) * 100 }
    }
    
    return {}
  }

  const stats = getReportStats()

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reports & Export</h1>
          <p className="text-muted-foreground">Generate reports and export your financial data</p>
        </div>
      </div>

      {/* Report Selection */}
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

      {/* Date Range Filter */}
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
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedReport === "transactions" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">${stats.income?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Income</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">${stats.expenses?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">${stats.net?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Net Amount</p>
              </div>
            </div>
          )}
          
          {selectedReport === "bills" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">${stats.total?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Bills</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">${stats.paid?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">${stats.unpaid?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Unpaid</p>
              </div>
            </div>
          )}
          
          {selectedReport === "goals" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">${stats.totalTarget?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Target</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">${stats.totalCurrent?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Saved</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{stats.progress?.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
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
              <Button onClick={() => generateCSV(getReportData(), selectedReport)}>
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

      {/* Preview Data */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>Preview of the data that will be exported</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  {selectedReport === "transactions" && (
                    <>
                      <th className="border border-gray-200 p-2 text-left">Date</th>
                      <th className="border border-gray-200 p-2 text-left">Description</th>
                      <th className="border border-gray-200 p-2 text-left">Amount</th>
                      <th className="border border-gray-200 p-2 text-left">Type</th>
                      <th className="border border-gray-200 p-2 text-left">Category</th>
                    </>
                  )}
                  {selectedReport === "bills" && (
                    <>
                      <th className="border border-gray-200 p-2 text-left">Name</th>
                      <th className="border border-gray-200 p-2 text-left">Amount</th>
                      <th className="border border-gray-200 p-2 text-left">Due Date</th>
                      <th className="border border-gray-200 p-2 text-left">Status</th>
                    </>
                  )}
                  {selectedReport === "goals" && (
                    <>
                      <th className="border border-gray-200 p-2 text-left">Goal Name</th>
                      <th className="border border-gray-200 p-2 text-left">Target Amount</th>
                      <th className="border border-gray-200 p-2 text-left">Current Amount</th>
                      <th className="border border-gray-200 p-2 text-left">Progress</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {getReportData().slice(0, 5).map((item, index) => (
                  <tr key={index}>
                    {selectedReport === "transactions" && (
                      <>
                        <td className="border border-gray-200 p-2">{item.date}</td>
                        <td className="border border-gray-200 p-2">{item.description}</td>
                        <td className="border border-gray-200 p-2">${item.amount.toFixed(2)}</td>
                        <td className="border border-gray-200 p-2">
                          <Badge variant={item.type === "income" ? "default" : "secondary"}>
                            {item.type}
                          </Badge>
                        </td>
                        <td className="border border-gray-200 p-2">{item.category}</td>
                      </>
                    )}
                    {selectedReport === "bills" && (
                      <>
                        <td className="border border-gray-200 p-2">{item.name}</td>
                        <td className="border border-gray-200 p-2">${item.amount.toFixed(2)}</td>
                        <td className="border border-gray-200 p-2">{item.dueDate}</td>
                        <td className="border border-gray-200 p-2">
                          <Badge variant={item.isPaid ? "default" : "secondary"}>
                            {item.isPaid ? "Paid" : "Unpaid"}
                          </Badge>
                        </td>
                      </>
                    )}
                    {selectedReport === "goals" && (
                      <>
                        <td className="border border-gray-200 p-2">{item.name}</td>
                        <td className="border border-gray-200 p-2">${item.targetAmount.toFixed(2)}</td>
                        <td className="border border-gray-200 p-2">${item.currentAmount.toFixed(2)}</td>
                        <td className="border border-gray-200 p-2">{item.progress}%</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Showing first 5 records. Full data will be included in the export.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 