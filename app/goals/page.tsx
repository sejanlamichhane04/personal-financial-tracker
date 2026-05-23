"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ApiError, createGoal, fetchGoals, updateGoal } from "@/lib/api"
import { useAuthSession } from "@/hooks/use-auth-session"
import type { Goal } from "@/lib/finance"
import { Target, Plus, Calendar, PiggyBank } from "lucide-react"

const goalColors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500", "bg-indigo-500"]

const getGoalColor = (seed: string) => {
  const value = seed.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return goalColors[value % goalColors.length]
}

export default function GoalsPage() {
  const { session, isLoading: isSessionLoading, logout } = useAuthSession()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [progressInputs, setProgressInputs] = useState<Record<string, string>>({})
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    category: "Savings",
  })

  const categories = ["Savings", "Travel", "Electronics", "Home", "Education", "Other"]

  useEffect(() => {
    if (!session) {
      return
    }

    const loadGoals = async () => {
      setIsLoading(true)
      setError("")

      try {
        setGoals(await fetchGoals(session.token))
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          logout()
          return
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load goals.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadGoals()
  }, [session])

  const handleAddGoal = async () => {
    if (!session) {
      return
    }

    const targetAmount = Number(newGoal.targetAmount)
    if (!newGoal.name.trim() || !newGoal.targetDate || !Number.isFinite(targetAmount) || targetAmount <= 0) {
      setError("Please fill in all goal details.")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const goal = await createGoal(session.token, {
        name: newGoal.name.trim(),
        targetAmount,
        targetDate: newGoal.targetDate,
        category: newGoal.category,
      })

      setGoals((currentGoals) => [...currentGoals, goal])
      setNewGoal({ name: "", targetAmount: "", targetDate: "", category: "Savings" })
      setShowAddForm(false)
    } catch (saveError) {
      if (saveError instanceof ApiError && saveError.status === 401) {
        logout()
        return
      }

      setError(saveError instanceof Error ? saveError.message : "Unable to add the goal.")
    } finally {
      setIsSaving(false)
    }
  }

  const updateGoalProgress = async (goal: Goal, amount: number) => {
    if (!session || amount <= 0) {
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const updatedGoal = await updateGoal(session.token, goal.id, {
        currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount),
      })

      setGoals((currentGoals) =>
        currentGoals.map((currentGoal) => (currentGoal.id === updatedGoal.id ? updatedGoal : currentGoal))
      )
      setProgressInputs((currentInputs) => ({ ...currentInputs, [goal.id]: "" }))
    } catch (saveError) {
      if (saveError instanceof ApiError && saveError.status === 401) {
        logout()
        return
      }

      setError(saveError instanceof Error ? saveError.message : "Unable to update goal progress.")
    } finally {
      setIsSaving(false)
    }
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const overallProgress = totalTarget === 0 ? 0 : (totalSaved / totalTarget) * 100

  if (isSessionLoading || !session) {
    return <div className="container mx-auto p-6 max-w-4xl">Loading goals...</div>
  }

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

      {error ? <p className="mb-6 text-sm text-red-500">{error}</p> : null}

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
              <p className="text-2xl font-bold text-purple-600">{overallProgress.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Progress</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {showAddForm ? (
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
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => void handleAddGoal()} disabled={isSaving}>
                {isSaving ? "Saving..." : "Add Goal"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading goals...</p>
        ) : goals.length === 0 ? (
          <p className="text-muted-foreground">No goals yet. Add your first goal to start tracking progress.</p>
        ) : (
          goals.map((goal) => {
            const progress = goal.targetAmount === 0 ? 0 : (goal.currentAmount / goal.targetAmount) * 100
            const daysLeft = Math.ceil(
              (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getGoalColor(goal.id)}`}></div>
                      <div>
                        <CardTitle className="text-xl">{goal.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="mr-1 h-4 w-4" />
                          {daysLeft > 0 ? `${daysLeft} days left` : "Target date passed"}
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

                    <div className="flex items-center space-x-2 pt-2">
                      <Input
                        type="number"
                        placeholder="Add amount"
                        className="flex-1"
                        value={progressInputs[goal.id] ?? ""}
                        onChange={(e) =>
                          setProgressInputs((currentInputs) => ({
                            ...currentInputs,
                            [goal.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const amount = Number(progressInputs[goal.id] ?? "")
                            if (amount > 0) {
                              void updateGoalProgress(goal, amount)
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const amount = Number(progressInputs[goal.id] ?? "")
                          if (amount > 0) {
                            void updateGoalProgress(goal, amount)
                          }
                        }}
                        disabled={isSaving}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
