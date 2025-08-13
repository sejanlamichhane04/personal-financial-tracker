"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Plus, 
  TrendingUp,
  Calendar,
  DollarSign,
  PiggyBank
} from "lucide-react"

interface Goal {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
  color: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 6500,
      targetDate: "2024-06-30",
      category: "Savings",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Vacation Fund",
      targetAmount: 3000,
      currentAmount: 1200,
      targetDate: "2024-08-15",
      category: "Travel",
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "New Laptop",
      targetAmount: 1500,
      currentAmount: 800,
      targetDate: "2024-05-20",
      category: "Electronics",
      color: "bg-purple-500"
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    category: "Savings"
  })

  const categories = ["Savings", "Travel", "Electronics", "Home", "Education", "Other"]

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetDate) {
      const goal: Goal = {
        id: Date.now(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        targetDate: newGoal.targetDate,
        category: newGoal.category,
        color: getRandomColor()
      }
      setGoals([...goals, goal])
      setNewGoal({ name: "", targetAmount: "", targetDate: "", category: "Savings" })
      setShowAddForm(false)
    }
  }

  const getRandomColor = () => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500", "bg-indigo-500"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const updateGoalProgress = (id: number, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    ))
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">Track your savings progress and achieve your financial dreams</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PiggyBank className="mr-2 h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${totalSaved.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">${totalTarget.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Target</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{((totalSaved / totalTarget) * 100).toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Progress</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={(totalSaved / totalTarget) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Add Goal Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Goal</CardTitle>
            <CardDescription>Set a new financial goal to track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  placeholder="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGoal}>
                Add Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="grid gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          
          return (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${goal.color}`}></div>
                    <div>
                      <CardTitle className="text-xl">{goal.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="mr-1 h-4 w-4" />
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Target date passed'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{goal.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">${goal.currentAmount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Saved</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${goal.targetAmount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Target</p>
                    </div>
                  </div>
                  
                  {/* Quick Add Amount */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Input
                      type="number"
                      placeholder="Add amount"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement
                          const amount = parseFloat(input.value)
                          if (amount > 0) {
                            updateGoalProgress(goal.id, amount)
                            input.value = ''
                          }
                        }
                      }}
                    />
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        const amount = parseFloat(input.value)
                        if (amount > 0) {
                          updateGoalProgress(goal.id, amount)
                          input.value = ''
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 