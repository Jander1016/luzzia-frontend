import { SubscribeForm } from "@/components/forms/SubscribeForm"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suscríbete al Newsletter de Luzzia - Alertas de Precios Baratos',
  description: 'Únete a nuestra newsletter y recibe alertas cuando la electricidad esté más barata. No más facturas sorpresa. Suscripción gratuita y cancela cuando quieras.',
  keywords: ['newsletter luzzia', 'alertas precio luz', 'suscripción energía', 'notificaciones electricidad barata'],
  openGraph: {
    title: 'Newsletter Luzzia - Alertas de Electricidad Barata',
    description: 'Recibe alertas cuando la electricidad esté más barata y reduce tu factura automáticamente.',
    type: 'website',
  },
}

export default function page() {
  return (
    //centra el formulario siempre al medio con tailwind
    <section 
      className="min-h-screen flex flex-col items-center justify-baseline bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12"
      >
      <SubscribeForm />
    </section>
  )
}