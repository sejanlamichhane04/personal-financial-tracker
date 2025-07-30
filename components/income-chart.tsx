"use client"

export function IncomeChart() {
  const incomeData = [
    { month: "Jan", amount: 4800 },
    { month: "Feb", amount: 5200 },
    { month: "Mar", amount: 4900 },
    { month: "Apr", amount: 5400 },
    { month: "May", amount: 5100 },
    { month: "Jun", amount: 5200 },
  ]

  const maxAmount = Math.max(...incomeData.map((item) => item.amount))

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between h-48 space-x-3">
        {incomeData.map((item, index) => {
          const height = (item.amount / maxAmount) * 100
          return (
            <div key={index} className="flex flex-col items-center space-y-3 flex-1">
              <div className="w-full bg-white/10 rounded-t-lg flex items-end" style={{ height: "160px" }}>
                <div
                  className="w-full primary-solid rounded-t-lg transition-all duration-500 hover:shadow-lg neon-glow-purple"
                  style={{ height: `${height}%` }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">{item.month}</p>
                <p className="text-xs text-slate-400">${item.amount.toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
