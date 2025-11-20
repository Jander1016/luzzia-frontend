import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '¿Qué es Luzzia? - Tu Aliado Inteligente para el Ahorro Energético',
  description: 'Descubre cómo Luzzia te ayuda a reducir tu factura eléctrica hasta un 30% con análisis inteligente de precios de luz, recomendaciones personalizadas y alertas en tiempo real.',
  keywords: ['ahorro energético', 'precio luz', 'factura eléctrica', 'smart home', 'eficiencia energética', 'tarifa eléctrica'],
  openGraph: {
    title: '¿Qué es Luzzia? - Ahorra hasta 30% en tu factura de luz',
    description: 'Revoluciona tu consumo eléctrico con Luzzia. Análisis inteligente, alertas en tiempo real y recomendaciones que te harán ahorrar.',
    type: 'website',
  },
}

export default function AboutMePage() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            ¿Qué es <span className="text-blue-400">Luzzia</span>?
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Tu compañero inteligente para <strong className="text-white">reducir tu factura eléctrica hasta un 30%</strong> 
            sin cambiar tu estilo de vida.
          </p>
        </section>

        {/* Problema y Solución */}
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              El Problema que <span className="text-red-400">Todos</span> Enfrentamos
            </h2>
            <div className="space-y-4 text-lg text-slate-300">
              <p>🔥 Los precios de la electricidad cambian cada hora, pero nadie te avisa</p>
              <p>💸 Usas electrodomésticos en las horas más caras sin saberlo</p>
              <p>😵 Tu factura de luz sigue subiendo mes tras mes</p>
              <p>🤷‍♀️ No sabes cuándo es el mejor momento para lavar, cocinar o cargar dispositivos</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 rounded-2xl border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">La Solución: Luzzia</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Imagínate recibir una notificación que te dice: <strong className="text-blue-400">"¡Ahora es el mejor momento para lavar la ropa!"</strong> 
              O saber que si esperas 2 horas, podrías ahorrar €3 en tu próxima carga de coche eléctrico.
            </p>
          </div>
        </section>

        {/* Características Principales */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            ¿Cómo Te Ayuda <span className="text-blue-400">Luzzia</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Precios en Tiempo Real",
                description: "Conoce el precio exacto de la electricidad cada hora del día. Datos directos del mercado eléctrico español."
              },
              {
                icon: "📱",
                title: "Alertas Inteligentes",
                description: "Recibe notificaciones cuando los precios están bajos. ¡Perfecto para programar electrodomésticos!"
              },
              {
                icon: "💰",
                title: "Calculadora de Ahorro",
                description: "Ve exactamente cuánto puedes ahorrar cambiando tus hábitos de consumo."
              },
            
            ].map((feature, index) => (
              <div key={index} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Casos de Uso Reales */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Casos Reales de <span className="text-green-400">Ahorro</span>
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-8 rounded-2xl border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">👨‍👩‍👧‍👦 Familia García</h3>
              <p className="text-slate-300 mb-4">
                Programaron su lavadora y lavavajillas para funcionar durante las horas más baratas.
              </p>
              <div className="text-3xl font-bold text-green-400">-28% en su factura</div>
              <div className="text-sm text-slate-400 mt-2">Ahorro: €45/mes</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-8 rounded-2xl border border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">🚗 Carlos (Coche Eléctrico)</h3>
              <p className="text-slate-300 mb-4">
                Carga su Tesla solo durante las horas de precio mínimo que Luzzia le indica.
              </p>
              <div className="text-3xl font-bold text-blue-400">-35% en carga</div>
              <div className="text-sm text-slate-400 mt-2">Ahorro: €67/mes</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-8 rounded-2xl border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">🏢 Pyme Innovadora</h3>
              <p className="text-slate-300 mb-4">
                Ajustaron los horarios de equipos no críticos basándose en los datos de Luzzia.
              </p>
              <div className="text-3xl font-bold text-purple-400">-22% en costes</div>
              <div className="text-sm text-slate-400 mt-2">Ahorro: €234/mes</div>
            </div>
          </div>
        </section>

        {/* Visión de Futuro */}
        <section className="text-center mb-16">
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-12 rounded-3xl border border-blue-500/20">
            <h2 className="text-4xl font-bold text-white mb-6">
              Nuestra <span className="text-blue-400">Visión</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Creemos en un futuro donde cada hogar español tenga el poder de controlar su gasto eléctrico. 
              Donde la tecnología trabaje para ti, no contra tu bolsillo. Donde ahorrar energía sea tan 
              fácil como recibir una notificación.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">100k+</div>
                <div className="text-slate-300">Hogares Impactados (Meta 2025)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">€2M+</div>
                <div className="text-slate-300">Ahorrados Colectivamente</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">50%</div>
                <div className="text-slate-300">Reducción de Huella de Carbono</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para <span className="text-green-400">Comenzar a Ahorrar</span>?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de españoles que ya están reduciendo su factura eléctrica con Luzzia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              📧 Suscríbete al Newsletter
            </Link>
            <Link 
              href="/" 
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl border border-slate-600 transition-all duration-300"
            >
              📊 Ver Precios en Vivo
            </Link>
          </div>
        </section>
      </div>
    // </div>
  )
}