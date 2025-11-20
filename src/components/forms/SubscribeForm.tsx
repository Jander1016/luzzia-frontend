"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { CheckCircle, Mail, User, Loader2, AlertCircle, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ContactFormData, ContactSchema } from "@/app/contact/validate.contact"
import { safeContactForm } from "@/services/contactService"

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function SubscribeForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onChange", // Validación en tiempo real
  })

  // Reset del mensaje después de 5 segundos
  useEffect(() => {
    if (formState === 'success' || formState === 'error') {
      const timer = setTimeout(() => {
        setFormState('idle')
        setMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [formState])

  async function onSubmit(data: ContactFormData) {
    setFormState('loading')
    setMessage('')
    
    try {
      await safeContactForm(data)
      setFormState('success')
      setMessage('¡Gracias! Te contactaremos pronto con las mejores ofertas energéticas.')
      setShowConfetti(true)
      form.reset()
      
      // Reset confetti después de 3 segundos
      setTimeout(() => setShowConfetti(false), 3000)
      
    } catch (error: unknown) {
      setFormState('error')
      let errorMsg = 'Error al enviar. Intenta nuevamente.'
      
      if (error instanceof Error) {
        errorMsg = error.message.includes(':') ? error.message.split(':')[1] : error.message
      }
      
      setMessage(errorMsg)
    }
  }

  const getButtonContent = () => {
    switch (formState) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            ¡Enviado!
          </>
        )
      default:
        return (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Suscríbete Gratis
          </>
        )
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-slate-900/25 transition-all duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-3">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
            Únete a +1,000 usuarios
          </h3>
          <p className="text-slate-400 text-sm">
            Recibe alertas cuando la electricidad esté más barata
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel htmlFor="subscribe-name" className="text-white font-medium text-sm">Nombre</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="subscribe-name"
                          placeholder="Tu nombre completo" 
                          autoComplete="name"
                          className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 h-11 ${
                            fieldState.error ? 'border-red-400 focus:border-red-400' : ''
                          } ${
                            field.value && !fieldState.error ? 'border-emerald-400' : ''
                          }`}
                          {...field} 
                        />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel htmlFor="subscribe-email" className="text-white font-medium text-sm">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="subscribe-email"
                          type="email"
                          placeholder="tu@email.com" 
                          autoComplete="email"
                          className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 h-11 ${
                            fieldState.error ? 'border-red-400 focus:border-red-400' : ''
                          } ${
                            field.value && !fieldState.error ? 'border-emerald-400' : ''
                          }`}
                          {...field} 
                        />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-lg border transition-all duration-300 ${
                formState === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <div className="flex items-start space-x-2">
                  {formState === 'success' ? (
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className={`w-full py-3 h-12 font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                formState === 'success' 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                  : formState === 'error'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/25'
              }`}
              disabled={formState === 'loading' || formState === 'success'}
              aria-label={`${formState === 'loading' ? 'Enviando formulario de suscripción' : 'Suscribirse gratis a alertas de precios de electricidad'}`}
            >
              {getButtonContent()}
            </Button>

            {/* Trust indicators */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                🔒 Protegemos tu privacidad • Sin spam • Cancela cuando quieras
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
