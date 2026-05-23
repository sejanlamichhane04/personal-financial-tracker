"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { ApiError } from "@/lib/api"
import type { Transaction, TransactionPayload, TransactionType } from "@/lib/finance"

interface TransactionListProps {
  transactions: Transaction[]
  isLoading?: boolean
  isSubmitting?: boolean
  onCreateTransaction?: (payload: TransactionPayload) => Promise<void>
}

export function TransactionList({
  transactions,
  isLoading = false,
  isSubmitting = false,
  onCreateTransaction,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [formError, setFormError] = useState("")
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "expense" as TransactionType,
    category: "",
    date: new Date().toISOString().slice(0, 10),
  })

  const categories = Array.from(new Set(transactions.map((transaction) => transaction.category))).sort()

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    const matchesType = filterType === "all" || transaction.type === filterType
    return matchesSearch && matchesCategory && matchesType
  })

  const handleCreateTransaction = async () => {
    if (!onCreateTransaction) {
      return
    }

    setFormError("")

    const amount = Number(newTransaction.amount)
    if (!newTransaction.description.trim() || !newTransaction.category.trim() || !Number.isFinite(amount) || amount <= 0) {
      setFormError("Please fill in all transaction details.")
      return
    }

    try {
      await onCreateTransaction({
        description: newTransaction.description.trim(),
        amount,
        type: newTransaction.type,
        category: newTransaction.category.trim(),
        date: newTransaction.date,
      })

      setNewTransaction({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().slice(0, 10),
      })
      setShowAddForm(false)
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message)
      } else {
        setFormError("Unable to add the transaction.")
      }
    }
  }

  return (
    <div className="space-y-8">
      <Card className="premium-card border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
            Transaction Filters
          </CardTitle>
          <CardDescription className="text-slate-400">Filter and search your transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 glass-effect border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px] h-12 glass-effect border-white/20 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-white/20">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] h-12 glass-effect border-white/20 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-white/20">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="h-12 primary-solid text-white shadow-lg hover:bg-purple-700"
              onClick={() => setShowAddForm((currentValue) => !currentValue)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {showAddForm ? (
            <div className="grid gap-4 rounded-2xl glass-effect p-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-slate-300" htmlFor="transaction-description">
                  Description
                </Label>
                <Input
                  id="transaction-description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="glass-effect border-white/20 text-white"
                  placeholder="Salary, groceries, rent..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300" htmlFor="transaction-category">
                  Category
                </Label>
                <Input
                  id="transaction-category"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="glass-effect border-white/20 text-white"
                  placeholder="Food, Salary, Utilities..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300" htmlFor="transaction-amount">
                  Amount
                </Label>
                <Input
                  id="transaction-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="glass-effect border-white/20 text-white"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300" htmlFor="transaction-date">
                  Date
                </Label>
                <Input
                  id="transaction-date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="glass-effect border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value) =>
                    setNewTransaction({ ...newTransaction, type: value as TransactionType })
                  }
                >
                  <SelectTrigger className="glass-effect border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-white/20">
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => void handleCreateTransaction()} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Transaction"}
                </Button>
              </div>
              {formError ? <p className="text-sm text-red-400 md:col-span-2">{formError}</p> : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="premium-card border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
            All Transactions
          </CardTitle>
          <CardDescription className="text-slate-400">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-slate-400">Loading transactions...</p>
          ) : filteredTransactions.length === 0 ? (
            <p className="text-slate-400">
              {transactions.length === 0
                ? "No transactions saved yet. Add your first transaction above."
                : "No transactions match your current filters."}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-6 rounded-2xl glass-effect hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${transaction.type === "income" ? "success-solid" : "danger-solid"}`}>
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">{transaction.description}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="secondary" className="text-xs bg-white/10 text-slate-300 border-white/20">
                          {transaction.category}
                        </Badge>
                        <span className="text-sm text-slate-400">{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-400 capitalize">{transaction.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
