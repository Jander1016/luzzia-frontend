import { Metadata } from 'next'
import { Cookie, Settings, BarChart, Target, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Política de Cookies - Luzzia',
  description: 'Información sobre el uso de cookies en Luzzia y cómo gestionarlas.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-6">
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Política de Cookies</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Información sobre cómo utilizamos las cookies en Luzzia para mejorar tu experiencia
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                ¿Qué son las Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando 
                visitas un sitio web. Nos ayudan a hacer que el sitio web funcione, mejorar tu experiencia, 
                entender cómo interactúas con el sitio y mostrarte contenido relevante.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Tipos de Cookies que Utilizamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Cookies Necesarias */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h4 className="font-semibold">Cookies Necesarias</h4>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                    Siempre Activas
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Estas cookies son esenciales para el funcionamiento básico del sitio web y no se pueden desactivar.
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>luzzia-cookie-consent:</strong> Almacena tus preferencias de cookies</div>
                  <div><strong>theme:</strong> Recuerda tu preferencia de tema (claro/oscuro)</div>
                  <div><strong>Duración:</strong> 1 año</div>
                </div>
              </div>

              {/* Cookies Funcionales */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h4 className="font-semibold">Cookies Funcionales</h4>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                    Opcional
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Mejoran tu experiencia recordando tus preferencias y configuraciones.
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>notifications-preferences:</strong> Configuración de notificaciones</div>
                  <div><strong>chart-settings:</strong> Preferencias de visualización de gráficos</div>
                  <div><strong>Duración:</strong> 6 meses</div>
                </div>
              </div>

              {/* Cookies Analíticas */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h4 className="font-semibold">Cookies Analíticas</h4>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full">
                    Opcional
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Nos ayudan a entender cómo usas el sitio web para poder mejorarlo.
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Google Analytics:</strong> _ga, _ga_*, _gid</div>
                  <div><strong>Finalidad:</strong> Análisis de tráfico y comportamiento</div>
                  <div><strong>Duración:</strong> 2 años (GA), 24 horas (_gid)</div>
                  <div><strong>Proveedor:</strong> Google LLC</div>
                </div>
              </div>

              {/* Cookies de Marketing */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <h4 className="font-semibold">Cookies de Marketing</h4>
                  <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded-full">
                    Opcional
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Se utilizan para mostrarte anuncios más relevantes y medir la efectividad de las campañas.
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Facebook Pixel:</strong> _fbp, _fbc</div>
                  <div><strong>Google Ads:</strong> _gcl_*</div>
                  <div><strong>Finalidad:</strong> Publicidad personalizada y remarketing</div>
                  <div><strong>Duración:</strong> 90 días</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Gestión de Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4>Cómo controlar las cookies:</h4>
              
              <h5>1. Panel de Preferencias de Luzzia</h5>
              <p>
                Puedes gestionar tus preferencias de cookies en cualquier momento haciendo clic en el 
                enlace "Configuración de Cookies" en el pie de página de nuestro sitio web.
              </p>
              
              <h5>2. Configuración del Navegador</h5>
              <p>También puedes controlar las cookies a través de la configuración de tu navegador:</p>
              <ul>
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                <li><strong>Firefox:</strong> Preferencias → Privacidad y seguridad → Cookies</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                <li><strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
              </ul>
              
              <h5>3. Herramientas de Exclusión</h5>
              <ul>
                <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
                <li><a href="https://www.facebook.com/help/568137493302217" target="_blank" rel="noopener" className="text-primary hover:underline">Facebook Pixel Opt-out</a></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Cookies de Terceros
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Algunos de nuestros socios de confianza también establecen cookies en tu dispositivo 
                cuando visitas nuestro sitio web:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Servicio</th>
                      <th className="border border-border p-2 text-left">Finalidad</th>
                      <th className="border border-border p-2 text-left">Política</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2">Google Analytics</td>
                      <td className="border border-border p-2">Análisis de tráfico web</td>
                      <td className="border border-border p-2">
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline text-sm">
                          Ver política
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">Vercel Analytics</td>
                      <td className="border border-border p-2">Rendimiento del sitio</td>
                      <td className="border border-border p-2">
                        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-primary hover:underline text-sm">
                          Ver política
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Consecuencias de Rechazar Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>Puedes rechazar las cookies no esenciales, pero ten en cuenta que esto puede afectar:</p>
              <ul>
                <li><strong>Personalización:</strong> No recordaremos tus preferencias de tema y configuración</li>
                <li><strong>Análisis:</strong> No podremos mejorar el sitio basándonos en datos de uso</li>
                <li><strong>Funcionalidad:</strong> Algunas características avanzadas pueden no funcionar correctamente</li>
              </ul>
              
              <p>
                <strong>Importante:</strong> Las cookies necesarias no se pueden rechazar ya que son 
                esenciales para el funcionamiento básico del sitio web.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actualizaciones de esta Política</h3>
              <p className="text-muted-foreground mb-4">
                Podemos actualizar esta política de cookies periódicamente. Te notificaremos sobre 
                cambios significativos a través de nuestro sitio web o por email.
              </p>
              <p className="text-sm text-muted-foreground">
                Para preguntas sobre cookies, contacta: 
                <a href="mailto:privacy@luzzia.es" className="text-primary hover:underline ml-1">
                  privacy@luzzia.es
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}