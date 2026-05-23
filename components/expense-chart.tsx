"use client"

interface ExpenseChartProps {
  expenses: Array<{
    category: string
    amount: number
  }>
}

const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-red-500", "bg-pink-500"]

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  if (expenses.length === 0 || total === 0) {
    return <p className="text-slate-400">No expense data yet. Add expense transactions to see the breakdown.</p>
  }

  return (
    <div className="space-y-6">
      {expenses.map((expense, index) => {
        const percentage = (expense.amount / total) * 100
        const color = colors[index % colors.length]

        return (
          <div key={`${expense.category}-${index}`} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${color}`} />
                <span className="text-sm font-semibold text-white">{expense.category}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">${expense.amount.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className={`h-2 rounded-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
