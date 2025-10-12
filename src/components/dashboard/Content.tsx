
import { use } from 'react';
import { electricityService } from '@/services/electricityService';
import Hero from './Hero';
import { TrendingUp, Zap, Users } from 'lucide-react';

import DashboardContentClient from './DashboardContentClient';
import PriceChartClientWrapper from './PriceChartClientWrapper';


export function DashboardContent() {
  // Fetch de datos críticos en Server Component usando use
  const stats = use(electricityService.getDashboardStats());

  return (
    <div className="min-h-screen">
      <div className="container">
        {/* Hero Section - Siempre visible, datos opcionales */}
        <section>
          <Hero stats={stats} />
        </section>

        {/* Price Chart Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Precios de la Electricidad
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Consulta los precios actuales y históricos del mercado eléctrico español.
              Datos oficiales actualizados cada hora.
            </p>
          </div>
          <div className="relative">
            <PriceChartClientWrapper />
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ahorra hasta 30%</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Descubre las horas más baratas para usar tus electrodomésticos
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Datos Oficiales</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Información directa de Red Eléctrica de España (REE)
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">+1,000 usuarios</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Únete a miles de personas que ya ahorran en su factura
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Section - Progressive Loading (Client Component) */}
        <DashboardContentClient />
      </div>
    </div>
  );
}
