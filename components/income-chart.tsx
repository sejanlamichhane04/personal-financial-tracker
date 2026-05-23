"use client"

interface IncomeChartProps {
  incomeData: Array<{
    label: string
    amount: number
  }>
}

export function IncomeChart({ incomeData }: IncomeChartProps) {
  const maxAmount = Math.max(...incomeData.map((item) => item.amount), 0)

  if (maxAmount === 0) {
    return <p className="text-slate-400">No income data yet. Add income transactions to populate this chart.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between h-48 space-x-3">
        {incomeData.map((item, index) => {
          const height = maxAmount === 0 ? 0 : (item.amount / maxAmount) * 100

          return (
            <div key={`${item.label}-${index}`} className="flex flex-col items-center space-y-3 flex-1">
              <div className="w-full bg-white/10 rounded-t-lg flex items-end" style={{ height: "160px" }}>
                <div
                  className="w-full primary-solid rounded-t-lg transition-all duration-500 hover:shadow-lg neon-glow-purple"
                  style={{ height: `${height}%` }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-slate-400">${item.amount.toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
