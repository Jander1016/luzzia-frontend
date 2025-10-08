'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Shield, CheckCircle, X, Settings, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Siempre requeridas
  analytics: false,
  marketing: false,
  functional: false
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Verificar si ya se han aceptado las cookies
    const hasConsent = localStorage.getItem('luzzia-cookie-consent')
    if (!hasConsent) {
      // Mostrar banner después de 2 segundos para mejor UX
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    } else {
      // Cargar preferencias guardadas
      try {
        const savedPreferences = JSON.parse(hasConsent)
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
    setShowSettings(false)
    setIsLoading(false)

    // Aquí irían las configuraciones de terceros
    if (prefs.analytics) {
      // Configurar Google Analytics, etc.
      console.log('Analytics enabled')
    }
    if (prefs.marketing) {
      // Configurar cookies de marketing
      console.log('Marketing cookies enabled')
    }
  }

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    savePreferences(allAccepted)
  }

  const acceptEssential = () => {
    savePreferences(defaultPreferences)
  }

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookiePreferences,
      title: 'Cookies Necesarias',
      description: 'Esenciales para el funcionamiento básico del sitio web.',
      disabled: true,
      icon: <Shield className="w-4 h-4" />
    },
    {
      key: 'functional' as keyof CookiePreferences,
      title: 'Cookies Funcionales',
      description: 'Mejoran tu experiencia recordando tus preferencias.',
      disabled: false,
      icon: <Settings className="w-4 h-4" />
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Cookies Analíticas',
      description: 'Nos ayudan a entender cómo usas nuestro sitio web.',
      disabled: false,
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Cookies de Marketing',
      description: 'Personalizan anuncios y contenido relevante para ti.',
      disabled: false,
      icon: <ExternalLink className="w-4 h-4" />
    }
  ]

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-lg border-t shadow-2xl"
      >
        <div className="container mx-auto max-w-6xl">
          {!showSettings ? (
            // Banner principal
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Respetamos tu Privacidad 🍪
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Utilizamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. 
                    Puedes personalizar tus preferencias o aceptar todas las cookies.
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <Link href="/privacy-policy" className="hover:text-primary underline flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Política de Privacidad
                    </Link>
                    <Link href="/cookie-policy" className="hover:text-primary underline flex items-center gap-1">
                      <Cookie className="w-3 h-3" />
                      Política de Cookies
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Personalizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptEssential}
                  disabled={isLoading}
                >
                  Solo Esenciales
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aceptar Todo
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Panel de configuración
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configurar Cookies
                  </CardTitle>
                  <CardDescription>
                    Personaliza qué tipos de cookies quieres permitir
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cookieTypes.map((cookie, index) => (
                  <div key={cookie.key}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-1.5 bg-primary/10 rounded">
                          {cookie.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{cookie.title}</h4>
                            {cookie.key === 'necessary' && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                                Requeridas
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
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
                      />
                    </div>
                    {index < cookieTypes.length - 1 && <Separator />}
                  </div>
                ))}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={acceptEssential}
                    disabled={isLoading}
                  >
                    Solo Esenciales
                  </Button>
                  <Button
                    onClick={() => savePreferences(preferences)}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Guardar Preferencias'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}