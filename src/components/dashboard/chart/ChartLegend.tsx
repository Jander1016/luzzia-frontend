import { LegendItem, PriceData } from './types'
// import { formatPrice } from './types'

interface ChartLegendProps {
  legend: LegendItem[]
  prices?: PriceData[]
}

export function ChartLegend({ legend }: ChartLegendProps) {
  return (
    <div className="mt-8">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {legend.map((item, index) => (
          <div key={`${index}-${item.label}`} className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${item.color}`} />
            <div>
              <div className={`${item.textColor} font-medium text-sm`}>{item.label}</div>
              <div className={`${item.textColor} text-xs`}>
                {item.range}
              </div>
              <div className="text-slate-500 text-xs">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}