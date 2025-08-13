"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  CreditCard
} from "lucide-react"

interface Bill {
  id: number
  name: string
  amount: number
  dueDate: string
  category: string
  isPaid: boolean
  recurring: boolean
  frequency: string
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 1,
      name: "Electric Bill",
      amount: 89.25,
      dueDate: "2024-01-25",
      category: "Utilities",
      isPaid: false,
      recurring: true,
      frequency: "Monthly"
    },
    {
      id: 2,
      name: "Internet Bill",
      amount: 65.00,
      dueDate: "2024-01-28",
      category: "Utilities",
      isPaid: false,
      recurring: true,
      frequency: "Monthly"
    },
    {
      id: 3,
      name: "Credit Card Payment",
      amount: 250.00,
      dueDate: "2024-01-20",
      category: "Credit",
      isPaid: true,
      recurring: true,
      frequency: "Monthly"
    },
    {
      id: 4,
      name: "Car Insurance",
      amount: 120.00,
      dueDate: "2024-02-15",
      category: "Insurance",
      isPaid: false,
      recurring: true,
      frequency: "Monthly"
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "Utilities",
    recurring: false,
    frequency: "Monthly"
  })

  const categories = ["Utilities", "Credit", "Insurance", "Rent", "Phone", "Other"]
  const frequencies = ["Monthly", "Quarterly", "Yearly"]

  const handleAddBill = () => {
    if (newBill.name && newBill.amount && newBill.dueDate) {
      const bill: Bill = {
        id: Date.now(),
        name: newBill.name,
        amount: parseFloat(newBill.amount),
        dueDate: newBill.dueDate,
        category: newBill.category,
        isPaid: false,
        recurring: newBill.recurring,
        frequency: newBill.frequency
      }
      setBills([...bills, bill])
      setNewBill({ name: "", amount: "", dueDate: "", category: "Utilities", recurring: false, frequency: "Monthly" })
      setShowAddForm(false)
    }
  }

  const togglePaid = (id: number) => {
    setBills(bills.map(bill => 
      bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
    ))
  }

  const deleteBill = (id: number) => {
    setBills(bills.filter(bill => bill.id !== id))
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (dueDate: string, isPaid: boolean) => {
    if (isPaid) return "text-green-600"
    const daysLeft = getDaysUntilDue(dueDate)
    if (daysLeft < 0) return "text-red-600"
    if (daysLeft <= 3) return "text-orange-600"
    return "text-blue-600"
  }

  const totalDue = bills.filter(bill => !bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0)
  const overdueBills = bills.filter(bill => !bill.isPaid && getDaysUntilDue(bill.dueDate) < 0)
  const upcomingBills = bills.filter(bill => !bill.isPaid && getDaysUntilDue(bill.dueDate) >= 0 && getDaysUntilDue(bill.dueDate) <= 7)

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

      {/* Summary Cards */}
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

      {/* Add Bill Form */}
      {showAddForm && (
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
                  onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                  placeholder="e.g., Electric Bill"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billAmount">Amount ($)</Label>
                <Input
                  id="billAmount"
                  type="number"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                  placeholder="89.25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newBill.category}
                  onChange={(e) => setNewBill({...newBill, category: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <select
                  id="frequency"
                  value={newBill.frequency}
                  onChange={(e) => setNewBill({...newBill, frequency: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 flex items-center">
                <input
                  id="recurring"
                  type="checkbox"
                  checked={newBill.recurring}
                  onChange={(e) => setNewBill({...newBill, recurring: e.target.checked})}
                  className="mr-2"
                />
                <Label htmlFor="recurring">Recurring Bill</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBill}>
                Add Bill
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bills List */}
      <div className="space-y-4">
        {bills.map((bill) => {
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
                        {bill.recurring && (
                          <Badge variant="secondary" className="text-xs">
                            {bill.frequency}
                          </Badge>
                        )}
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
                                : `${daysLeft} days left`
                          }
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
                        onClick={() => togglePaid(bill.id)}
                      >
                        {bill.isPaid ? "Mark Unpaid" : "Mark Paid"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteBill(bill.id)}
                      >
                        Delete
                      </Button>
                    </div>
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