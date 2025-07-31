"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertTriangle, CheckCircle, Target } from "lucide-react"

export function BudgetOverview() {
  const budgets = [
    {
      category: "Food & Dining",
      budgeted: 800,
      spent: 650,
      color: "bg-blue-500",
    },
    {
      category: "Transportation",
      budgeted: 300,
      spent: 280,
      color: "bg-green-500",
    },
    {
      category: "Entertainment",
      budgeted: 200,
      spent: 240,
      color: "bg-red-500",
    },
    {
      category: "Shopping",
      budgeted: 400,
      spent: 320,
      color: "bg-purple-500",
    },
    {
      category: "Utilities",
      budgeted: 250,
      spent: 180,
      color: "bg-yellow-500",
    },
    {
      category: "Healthcare",
      budgeted: 150,
      spent: 75,
      color: "bg-pink-500",
    },
  ]

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)

  return (
    <div className="space-y-8">
      {/* Budget Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="premium-card border-0 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Total Budgeted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totalBudgeted.toLocaleString()}</div>
            <p className="text-sm text-slate-400">This month</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-0 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">${totalSpent.toLocaleString()}</div>
            <p className="text-sm text-slate-400">{((totalSpent / totalBudgeted) * 100).toFixed(1)}% of budget</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-0 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">${(totalBudgeted - totalSpent).toLocaleString()}</div>
            <p className="text-sm text-slate-400">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card className="premium-card border-0 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
              Budget Categories
            </CardTitle>
            <CardDescription className="text-slate-400">Track your spending against your budget goals</CardDescription>
          </div>
          <Button className="primary-solid text-white shadow-lg hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {budgets.map((budget, index) => {
              const percentage = (budget.spent / budget.budgeted) * 100
              const isOverBudget = budget.spent > budget.budgeted
              const isNearLimit = percentage > 80 && !isOverBudget

              return (
                <div key={index} className="space-y-4 p-6 rounded-2xl glass-effect">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${budget.color}`}></div>
                      <h4 className="font-semibold text-white text-lg">{budget.category}</h4>
                      {isOverBudget && (
                        <Badge className="text-xs danger-solid text-white border-0">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Over Budget
                        </Badge>
                      )}
                      {isNearLimit && (
                        <Badge className="text-xs warning-solid text-white border-0">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Near Limit
                        </Badge>
                      )}
                      {percentage < 80 && (
                        <Badge className="text-xs success-solid text-white border-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          On Track
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        ${budget.spent.toLocaleString()} / ${budget.budgeted.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-400">{percentage.toFixed(1)}% used</p>
                    </div>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-3 bg-white/10" />
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>${(budget.budgeted - budget.spent).toLocaleString()} remaining</span>
                    <span>{(100 - percentage).toFixed(1)}% left</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
