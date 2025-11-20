
import { use } from 'react';
import { electricityService } from '@/services/electricityService';
import Hero from './Hero';
import { TrendingUp, Zap, Users } from 'lucide-react';

import DashboardContentClient from './DashboardContentClient';
import PriceChartClientWrapper from '../charts/PriceChartClientWrapper';


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
          {/* <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 rounded-2xl border border-blue-500/30 shadow-lg"> */}
            <PriceChartClientWrapper />
          {/* </div> */}
        </section>

        {/* Value Proposition Section - Cards estilo ¿Qué es Luzzia? */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            ¿Por qué usar <span className="text-blue-400">Luzzia</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-7 h-7 text-emerald-500" />,
                title: <><span className="font-extrabold text-emerald-500">Ahorra hasta 30%</span></>,
                description: <><span className="font-bold text-emerald-500">Descubre</span> las horas más <span className="font-bold text-emerald-500">baratas</span> para usar tus electrodomésticos.</>,
              },
              {
                icon: <TrendingUp className="w-7 h-7 text-blue-500" />,
                title: <span className="font-extrabold text-blue-500">Datos Oficiales</span>,
                description: <>Información directa de <span className="font-bold text-blue-500">Red Eléctrica de España (REE)</span>.</>,
              },
              {
                icon: <Users className="w-7 h-7 text-pink-500" />,
                title: <span className="font-extrabold text-pink-500">+1,000 usuarios</span>,
                description: <><span className="font-bold text-pink-500">Únete</span> a miles de personas que ya <span className="font-bold text-pink-500">ahorran</span> en su factura.</>,
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center justify-center text-center bg-slate-900/70 p-8 rounded-2xl border border-slate-800 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                tabIndex={0}
                aria-label={typeof feature.title === 'string' ? feature.title : undefined}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-extrabold mb-2">{feature.title}</h3>
                <p className="text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section - Progressive Loading (Client Component) */}
        <DashboardContentClient />
      </div>
    // </div>
  );
}
