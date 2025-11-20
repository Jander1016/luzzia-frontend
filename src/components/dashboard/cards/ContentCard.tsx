import { GradientTextStyles } from "@/components/ui/gradientText";
import { TrendingUp, Users, Zap } from "lucide-react"

import { memo } from 'react'

interface ContentCardProps {
    icon: React.ReactNode;
    title: React.ReactNode;
    description: React.ReactNode;
}

const DATA: ContentCardProps[] = [
    {
        icon: <Zap className="w-7 h-7 text-emerald-500" />,
        title: <><span className="font-extrabold text-emerald-500">Ahorra hasta 30%</span></>,
        description: <>Aprovechando <span className="font-bold text-emerald-500">las horas más baratas de luz.</span> </>,
    },
    {
        icon: <TrendingUp className="w-7 h-7 text-sky-400" />,
        title: <span className="font-extrabold text-sky-400">Datos Oficiales</span>,
        description: <>Información del precio de la luz hoy actualizados en tiempo real desde<span className="font-bold text-sky-400"> la Red Eléctrica de España (REE)</span>.</>,
    },
    {
        icon: <Users className="w-7 h-7 text-amber-500" />,
        title: <span className="font-extrabold text-amber-500">Más de 1,000 usuarios</span>,
        description: <>Ya reducen su factura eléctrica con <span className="font-bold text-amber-500">Luzzia.</span></>,
    }
]

export const ContentCard = () => {
    return (
        <section className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
                ¿Por qué usar <span className={`${GradientTextStyles}`}>Luzzia</span>?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DATA.map((feature, idx) => (
                    <div
                        key={`feature-title-${idx}`}
                        className="group flex flex-col items-center justify-center text-center bg-slate-900/70 p-8 rounded-2xl border-[1px] border-violet-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        // className="group flex flex-col items-center justify-center text-center bg-slate-900/70 p-8 rounded-2xl border border-slate-800 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
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
    )
}