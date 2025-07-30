"use client"

export function ExpenseChart() {
  const expenses = [
    { category: "Food", amount: 650, color: "bg-blue-500" },
    { category: "Transport", amount: 280, color: "bg-green-500" },
    { category: "Entertainment", amount: 240, color: "bg-yellow-500" },
    { category: "Shopping", amount: 320, color: "bg-purple-500" },
    { category: "Utilities", amount: 180, color: "bg-red-500" },
  ]

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-6">
      {expenses.map((expense, index) => {
        const percentage = (expense.amount / total) * 100
        return (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${expense.color}`} />
                <span className="text-sm font-semibold text-white">{expense.category}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">${expense.amount.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${expense.color} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
    