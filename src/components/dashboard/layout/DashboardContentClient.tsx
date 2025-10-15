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
            ¿Quieres Ahorrar Más?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Suscríbete a nuestra newsletter y recibe alertas personalizadas cuando
            los precios estén en su punto más bajo. <span className="text-emerald-400 font-semibold">
            Es completamente gratis.
            </span>
          </p>
        </div>
        {/* Solo renderizar form cuando está visible */}
        <div className="flex justify-center">
          {subscribeInView && <SubscribeForm />}
        </div>
        {/* Social proof */}
        <div className="pt-8 border-t border-slate-700/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Trusted by <span className="text-emerald-400 font-semibold">1,000+ usuarios</span> •
            Promedio de ahorro: <span className="text-emerald-400 font-semibold">25% mensual</span>
          </p>
        </div>
      </div>
    </section>
  );
}
