import { Subscribe } from "@/components/forms/Subscribe"

export default function page() {
  return (
    //centra el formulario siempre al medio con tailwind
    <section 
      className="min-h-screen flex flex-col items-center justify-baseline bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6"
      >
      <Subscribe />
    </section>
  )
}