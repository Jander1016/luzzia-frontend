
import { use } from 'react';
import { electricityService } from '@/services/electricityService';
import Hero from './Hero';
import { TrendingUp } from 'lucide-react';

import DashboardContentClient from './DashboardContentClient';
import PriceChartClientWrapper from '../charts/PriceChartClientWrapper';

import { ContentCard } from '../cards/ContentCard';


export function DashboardContent() {
  // Fetch de datos críticos en Server Component usando use
  const stats = use(electricityService.getDashboardStats());

  return (
    // <div className=" bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <div className="container min-h-screen mx-auto p-4">
      {/* Hero Section - Siempre visible, datos opcionales */}
      <section className="mb-16">
        <Hero stats={stats} />
      </section>

      {/* Value Proposition Section - Cards estilo ¿Qué es Luzzia? */}
      <ContentCard />

      {/* Price Chart Section - Card estilo ¿Qué es Luzzia? */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Precios de la Electricidad
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Consulta los precios actuales y históricos del mercado eléctrico español. Datos oficiales actualizados cada hora.
          </p>
        </div>
        <PriceChartClientWrapper />
      </section>



      {/* Newsletter Section - Progressive Loading (Client Component) */}
      <DashboardContentClient />
    </div>
    // </div>
  );
}
