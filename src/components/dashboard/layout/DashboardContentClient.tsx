"use client";
import { useInView } from '@/hooks/useInView';
import { SubscribeForm } from '@/components/forms/SubscribeForm';

export default function DashboardContentClient() {
  const { ref: subscribeRef, inView: subscribeInView } = useInView({
    threshold: 0.2,
    rootMargin: '50px',
  });

  return (
    <section ref={subscribeRef} className="py-16 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 rounded-3xl"></div>
      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Suscríbete
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            ¿Quieres saber cuándo baja el precio de la luz?
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Recibe alertas con el precio de la luz por horas y la mejor hora para poner la lavadora. <span className="text-emerald-400 font-semibold">
              Suscríbete gratis y ahorra en tu factura eléctrica.
            </span>
          </p>
        </div>
        {/* Solo renderizar form cuando está visible */}
        <div className="flex justify-center">
          {subscribeInView && <SubscribeForm />}
        </div>
        {/* Social proof */}
        <div className="pt-8 text-center border-t border-slate-700/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Trusted by <span className="text-emerald-400 font-semibold">Más de 1,000 usuarios</span> •
            Promedio de ahorro: <span className="text-emerald-400 font-semibold">30% mensual</span>
          </p>
        </div>
      </div>
    </section>
  );
}
