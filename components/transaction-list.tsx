"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaction {
  id: number
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
}

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const categories = [
    "Food",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Salary",
    "Freelance",
  ]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    const matchesType = filterType === "all" || transaction.type === filterType
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="space-y-8">
      {/* Filters */}
      <Card className="premium-card border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
            Transaction Filters
          </CardTitle>
          <CardDescription className="text-slate-400">Filter and search your transactions</CardDescription>
        </CardHeader>
        <CardContent>
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
              <SelectTrigger className="w-[150px] h-12 glass-effect border-white/20 text-white">
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
            <Button className="h-12 primary-solid text-white shadow-lg hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
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
        </CardContent>
      </Card>
    </div>
  )
}
