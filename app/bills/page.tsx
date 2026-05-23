"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ApiError, createBill, deleteBill, fetchBills, updateBill } from "@/lib/api"
import { useAuthSession } from "@/hooks/use-auth-session"
import type { Bill } from "@/lib/finance"
import { Calendar, Plus, AlertTriangle, CheckCircle, Clock, DollarSign, CreditCard } from "lucide-react"

export default function BillsPage() {
  const { session, isLoading: isSessionLoading, logout } = useAuthSession()
  const [bills, setBills] = useState<Bill[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "Utilities",
    recurring: false,
    frequency: "Monthly",
  })

  const categories = ["Utilities", "Credit", "Insurance", "Rent", "Phone", "Other"]
  const frequencies = ["Monthly", "Quarterly", "Yearly"]

  useEffect(() => {
    if (!session) {
      return
    }

    const loadBills = async () => {
      setIsLoading(true)
      setError("")

      try {
        setBills(await fetchBills(session.token))
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          logout()
          return
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load bills.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadBills()
  }, [session])

  const handleAddBill = async () => {
    if (!session) {
      return
    }

    const amount = Number(newBill.amount)
    if (!newBill.name.trim() || !newBill.dueDate || !Number.isFinite(amount) || amount <= 0) {
      setError("Please fill in all bill details.")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const bill = await createBill(session.token, {
        name: newBill.name.trim(),
        amount,
        dueDate: newBill.dueDate,
        category: newBill.category,
        recurring: newBill.recurring,
        frequency: newBill.frequency,
      })

      setBills((currentBills) => [...currentBills, bill])
      setNewBill({
        name: "",
        amount: "",
        dueDate: "",
        category: "Utilities",
        recurring: false,
        frequency: "Monthly",
      })
      setShowAddForm(false)
    } catch (saveError) {
      if (saveError instanceof ApiError && saveError.status === 401) {
        logout()
        return
      }

      setError(saveError instanceof Error ? saveError.message : "Unable to add the bill.")
    } finally {
      setIsSaving(false)
    }
  }

  const togglePaid = async (bill: Bill) => {
    if (!session) {
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const updatedBill = await updateBill(session.token, bill.id, { isPaid: !bill.isPaid })
      setBills((currentBills) => currentBills.map((currentBill) => (currentBill.id === bill.id ? updatedBill : currentBill)))
    } catch (saveError) {
      if (saveError instanceof ApiError && saveError.status === 401) {
        logout()
        return
      }

      setError(saveError instanceof Error ? saveError.message : "Unable to update the bill.")
    } finally {
      setIsSaving(false)
    }
  }

  const removeBill = async (billId: string) => {
    if (!session) {
      return
    }

    setIsSaving(true)
    setError("")

    try {
      await deleteBill(session.token, billId)
      setBills((currentBills) => currentBills.filter((bill) => bill.id !== billId))
    } catch (saveError) {
      if (saveError instanceof ApiError && saveError.status === 401) {
        logout()
        return
      }

      setError(saveError instanceof Error ? saveError.message : "Unable to delete the bill.")
    } finally {
      setIsSaving(false)
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getStatusColor = (dueDate: string, isPaid: boolean) => {
    if (isPaid) return "text-green-600"
    const daysLeft = getDaysUntilDue(dueDate)
    if (daysLeft < 0) return "text-red-600"
    if (daysLeft <= 3) return "text-orange-600"
    return "text-blue-600"
  }

  const totalDue = bills.filter((bill) => !bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0)
  const overdueBills = bills.filter((bill) => !bill.isPaid && getDaysUntilDue(bill.dueDate) < 0)
  const upcomingBills = bills.filter(
    (bill) => !bill.isPaid && getDaysUntilDue(bill.dueDate) >= 0 && getDaysUntilDue(bill.dueDate) <= 7
  )

  if (isSessionLoading || !session) {
    return <div className="container mx-auto p-6 max-w-4xl">Loading bills...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bill Reminders</h1>
          <p className="text-muted-foreground">Never miss a payment again</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bill
        </Button>
      </div>

      {error ? <p className="mb-6 text-sm text-red-500">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">${totalDue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Due</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{overdueBills.length}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{upcomingBills.length}</p>
                <p className="text-sm text-muted-foreground">Due This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddForm ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Bill</CardTitle>
            <CardDescription>Add a recurring bill to track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billName">Bill Name</Label>
                <Input
                  id="billName"
                  value={newBill.name}
                  onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                  placeholder="e.g., Electric Bill"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billAmount">Amount ($)</Label>
                <Input
                  id="billAmount"
                  type="number"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                  placeholder="89.25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newBill.category}
                  onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <select
                  id="frequency"
                  value={newBill.frequency}
                  onChange={(e) => setNewBill({ ...newBill, frequency: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 flex items-center">
                <input
                  id="recurring"
                  type="checkbox"
                  checked={newBill.recurring}
                  onChange={(e) => setNewBill({ ...newBill, recurring: e.target.checked })}
                  className="mr-2"
                />
                <Label htmlFor="recurring">Recurring Bill</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => void handleAddBill()} disabled={isSaving}>
                {isSaving ? "Saving..." : "Add Bill"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground">Loading bills...</p>
        ) : bills.length === 0 ? (
          <p className="text-muted-foreground">No bills yet. Add your first bill to keep track of due dates.</p>
        ) : (
          bills.map((bill) => {
            const daysLeft = getDaysUntilDue(bill.dueDate)
            const statusColor = getStatusColor(bill.dueDate, bill.isPaid)

            return (
              <Card key={bill.id} className={bill.isPaid ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${bill.isPaid ? "bg-green-100" : "bg-blue-100"}`}>
                        {bill.isPaid ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{bill.name}</h3>
                          {bill.recurring ? (
                            <Badge variant="secondary" className="text-xs">
                              {bill.frequency}
                            </Badge>
                          ) : null}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-muted-foreground">{bill.category}</span>
                          <span className={`text-sm font-medium ${statusColor} flex items-center`}>
                            <Calendar className="mr-1 h-4 w-4" />
                            {bill.isPaid
                              ? "Paid"
                              : daysLeft < 0
                                ? `${Math.abs(daysLeft)} days overdue`
                                : daysLeft === 0
                                  ? "Due today"
                                  : `${daysLeft} days left`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-lg font-semibold">${bill.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Amount</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={bill.isPaid ? "outline" : "default"}
                          onClick={() => void togglePaid(bill)}
                          disabled={isSaving}
                        >
                          {bill.isPaid ? "Mark Unpaid" : "Mark Paid"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void removeBill(bill.id)}
                          disabled={isSaving}
                        >
                          Delete
                        </Button>
                      </div>
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
