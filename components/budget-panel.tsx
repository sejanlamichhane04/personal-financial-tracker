"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Target, DollarSign, Calendar } from "lucide-react"

interface BudgetPanelProps {
  onAddBudget: (budget: {
    category: string
    amount: number
    period: string
    color: string
  }) => void
}

const budgetCategories = [
  { name: "Food & Dining", color: "bg-blue-500" },
  { name: "Transportation", color: "bg-green-500" },
  { name: "Entertainment", color: "bg-purple-500" },
  { name: "Shopping", color: "bg-pink-500" },
  { name: "Utilities", color: "bg-yellow-500" },
  { name: "Healthcare", color: "bg-red-500" },
  { name: "Education", color: "bg-indigo-500" },
  { name: "Travel", color: "bg-orange-500" },
  { name: "Housing", color: "bg-teal-500" },
  { name: "Insurance", color: "bg-gray-500" },
  { name: "Savings", color: "bg-emerald-500" },
  { name: "Other", color: "bg-slate-500" },
]

const budgetPeriods = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
]

export function BudgetPanel({ onAddBudget }: BudgetPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly",
    customCategory: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount) return

    const selectedCategory = budgetCategories.find(cat => cat.name === formData.category)
    const categoryName = formData.category === "Other" ? formData.customCategory : formData.category
    
    onAddBudget({
      category: categoryName,
      amount: parseFloat(formData.amount),
      period: formData.period,
      color: selectedCategory?.color || "bg-slate-500",
    })

    // Reset form
    setFormData({
      category: "",
      amount: "",
      period: "monthly",
      customCategory: "",
    })
    
    setIsOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="primary-solid text-white shadow-lg hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="premium-card border-0 shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Add New Budget
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Set up a new budget category to track your spending
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-slate-300">Budget Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="glass-effect border-white/20 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {budgetCategories.map((category) => (
                  <SelectItem key={category.name} value={category.name} className="text-white hover:bg-slate-700">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Category Input */}
          {formData.category === "Other" && (
            <div className="space-y-3">
              <Label htmlFor="customCategory" className="text-slate-300">Custom Category Name</Label>
              <Input
                id="customCategory"
                value={formData.customCategory}
                onChange={(e) => handleInputChange("customCategory", e.target.value)}
                placeholder="Enter custom category name"
                className="glass-effect border-white/20 text-white placeholder:text-slate-400"
                required
              />
            </div>
          )}

          {/* Budget Amount */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-slate-300">Budget Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                className="pl-10 glass-effect border-white/20 text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* Budget Period */}
          <div className="space-y-3">
            <Label htmlFor="period" className="text-slate-300">Budget Period</Label>
            <Select value={formData.period} onValueChange={(value) => handleInputChange("period", value)}>
              <SelectTrigger className="glass-effect border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {budgetPeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value} className="text-white hover:bg-slate-700">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{period.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Budget Suggestions */}
          <div className="space-y-3">
            <Label className="text-slate-300">Quick Budget Suggestions</Label>
            <div className="grid grid-cols-2 gap-2">
              <Card className="glass-effect border-white/10 cursor-pointer hover:bg-white/10 transition-all" onClick={() => handleInputChange("amount", "500")}>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-white">$500</p>
                  <p className="text-xs text-slate-400">Standard</p>
                </CardContent>
              </Card>
              <Card className="glass-effect border-white/10 cursor-pointer hover:bg-white/10 transition-all" onClick={() => handleInputChange("amount", "1000")}>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-white">$1000</p>
                  <p className="text-xs text-slate-400">Generous</p>
                </CardContent>
              </Card>
              <Card className="glass-effect border-white/10 cursor-pointer hover:bg-white/10 transition-all" onClick={() => handleInputChange("amount", "250")}>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-white">$250</p>
                  <p className="text-xs text-slate-400">Conservative</p>
                </CardContent>
              </Card>
              <Card className="glass-effect border-white/10 cursor-pointer hover:bg-white/10 transition-all" onClick={() => handleInputChange("amount", "750")}>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-white">$750</p>
                  <p className="text-xs text-slate-400">Comfortable</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 primary-solid text-white shadow-lg hover:bg-purple-700"
              disabled={!formData.category || !formData.amount}
            >
              Add Budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 