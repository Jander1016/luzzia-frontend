import {  LineChart as RechartsLineChar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTodayPrices } from '@/hooks/useElectricityData.simple'

export function LineChart() {
  const { data: prices, isLoading, error } = useTodayPrices();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Error cargando los precios</p>
        <p className="text-red-600 text-sm mt-1">Intenta recargar la página</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
    );
  }

  const chartData = prices?.map(price => ({
    hour: `${price.hour}h`,
    price: Number(price.price.toFixed(4)),
    isFallback: price.isFallback,
  })) || [];

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Precio por hora hoy</h3>
      <ResponsiveContainer width="100%" height={250}>
        <RechartsLineChar data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            width={50}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(4)} €/kWh`, 'Precio']}
            labelFormatter={(label) => `Hora: ${label}`}
            contentStyle={{ 
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#4f46e5" 
            strokeWidth={3}
            dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#3730a3' }}
          />
        </RechartsLineChar>
      </ResponsiveContainer>
    </div>
  );
}
