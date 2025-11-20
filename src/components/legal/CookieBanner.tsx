'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Shield, X, Settings, Eye, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'

interface CookiePreferences {
  necessary: boolean
  preferences: boolean
  statistics: boolean
  marketing: boolean
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Siempre requeridas
  preferences: false,
  statistics: false,
  marketing: false
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Verificar si ya se han aceptado las cookies
    const consent = localStorage.getItem('luzzia-cookie-consent')
    if (!consent) {
      // Mostrar banner inmediatamente para evitar layout shift
      setShowBanner(true)
    } else {
      // El usuario ya ha dado consentimiento
      setHasConsent(true)
      try {
        const savedPreferences = JSON.parse(consent)
        setPreferences(savedPreferences)
      } catch {
        setPreferences(defaultPreferences)
      }
    }
  }, [])

  const savePreferences = async (prefs: CookiePreferences) => {
    setIsLoading(true)
    
    // Simular guardado (aquí irían las llamadas a analytics, etc.)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.setItem('luzzia-cookie-consent', JSON.stringify(prefs))
    setPreferences(prefs)
    setShowBanner(false)
    setShowPreferences(false)
    setHasConsent(true)
    setIsLoading(false)

    // Aquí irían las configuraciones de terceros
    if (prefs.statistics) {
      console.log('Analytics enabled')
    }
    if (prefs.marketing) {
      console.log('Marketing cookies enabled')
    }
  }

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true
    }
    savePreferences(allAccepted)
  }

  const acceptNecessary = () => {
    savePreferences(defaultPreferences)
  }

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookiePreferences,
      title: 'Estrictamente necesarias',
      description: 'Estas cookies son necesarias para que el sitio web funcione y no se pueden desactivar en nuestros sistemas. Usualmente están configuradas para responder a acciones hechas por usted para recibir servicios.',
      disabled: true,
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      count: 5
    },
    {
      key: 'preferences' as keyof CookiePreferences,
      title: 'Cookies de rendimiento',
      description: 'Estas cookies nos permiten contar las visitas y fuentes de circulación para poder medir y mejorar el desempeño de nuestro sitio.',
      disabled: false,
      icon: <Eye className="w-5 h-5 text-gray-600" />,
      count: 3
    },
    {
      key: 'statistics' as keyof CookiePreferences,
      title: 'Cookies funcionales',
      description: 'Estas cookies permiten que el sitio ofrezca una mejor funcionalidad y personalización. Pueden ser establecidas por nosotros o por terceros.',
      disabled: false,
      icon: <Settings className="w-5 h-5 text-gray-600" />,
      count: 7
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Cookies de publicidad',
      description: 'Estas cookies pueden ser puestas a través de nuestro sitio por nuestros socios publicitarios para construir un perfil de sus intereses.',
      disabled: false,
      icon: <Target className="w-5 h-5 text-gray-600" />,
      count: 12
    }
  ]

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t shadow-2xl"
          >
            <div className="max-w-7xl mx-auto p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Contenido principal */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Cookie className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Privacidad y Cookies
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                    Utilizamos cookies propias y de terceros para analizar nuestros servicios y mostrarte publicidad relacionada con tus preferencias en base a un perfil elaborado a partir de tus hábitos de navegación (por ejemplo, páginas visitadas). Puedes obtener más información en{' '}
                    <Link href="/cookie-policy" className="text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200 underline font-medium">
                      nuestra política de cookies
                    </Link>.
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreferences(true)}
                    className="whitespace-nowrap border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Configurar cookies
                  </Button>
                  <Button
                    variant="outline"
                    onClick={acceptNecessary}
                    disabled={isLoading}
                    className="whitespace-nowrap border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Rechazar todas
                  </Button>
                  <Button
                    onClick={acceptAll}
                    disabled={isLoading}
                    className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Aceptar todas'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de preferencias estilo OneTrust */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPreferences(false)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Centro de Preferencias de Privacidad
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p className="mb-4">
                    Cuando visita cualquier sitio web, puede almacenar o recuperar información en su navegador, principalmente en forma de cookies. Esta información podría ser sobre usted, sus preferencias o su dispositivo y se usa principalmente para hacer que el sitio funcione como usted espera.
                  </p>
                  <p>
                    La información generalmente no lo identifica directamente, pero puede brindarle una experiencia web más personalizada. Respetamos su derecho a la privacidad, por lo que puede optar por no permitir algunos tipos de cookies.
                  </p>
                </div>

                {/* Lista de tipos de cookies */}
                <div className="space-y-4">
                  {cookieTypes.map((cookie) => (
                    <div key={cookie.key} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {cookie.icon}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {cookie.title}
                                </h4>
                                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                  {cookie.count} cookies
                                </span>
                                
                              </div>
                              <div className='py-2'>
                                {cookie.key === 'necessary' && (
                                  <span className="py-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded">
                                    Siempre activo
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {cookie.description}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={preferences[cookie.key]}
                            onCheckedChange={(checked) => {
                              if (!cookie.disabled) {
                                setPreferences(prev => ({
                                  ...prev,
                                  [cookie.key]: checked
                                }))
                              }
                            }}
                            disabled={cookie.disabled}
                            className="ml-4"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex gap-3">
                  <Link 
                    href="/privacy-policy" 
                    className="text-sm text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200 font-medium underline"
                  >
                    Política de Privacidad
                  </Link>
                  <Link 
                    href="/cookie-policy" 
                    className="text-sm text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200 font-medium underline"
                  >
                    Política de Cookies
                  </Link>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={acceptNecessary}
                    disabled={isLoading}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Rechazar todas
                  </Button>
                  <Button
                    onClick={() => savePreferences(preferences)}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Confirmar'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icono persistente de galleta (siempre visible después del consentimiento) */}
      <AnimatePresence>
        {hasConsent && !showBanner && !showPreferences && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreferences(true)}
            className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
            title="Configurar preferencias de cookies"
          >
            <Cookie className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}