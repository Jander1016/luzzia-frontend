import { Metadata } from 'next'
import { Shield, Cookie, Mail, Clock, Lock, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Política de Privacidad - Luzzia',
  description: 'Conoce cómo protegemos tu privacidad y tratamos tus datos personales en Luzzia.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En Luzzia valoramos tu privacidad y estamos comprometidos con la protección de tus datos personales
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Quick overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Lock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Datos Seguros</h3>
              <p className="text-sm text-muted-foreground">
                Protegemos tu información con las mejores prácticas de seguridad
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No Compartimos</h3>
              <p className="text-sm text-muted-foreground">
                Nunca vendemos ni compartimos tus datos con terceros
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Control Total</h3>
              <p className="text-sm text-muted-foreground">
                Puedes acceder, modificar o eliminar tus datos en cualquier momento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                1. Responsable del Tratamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                <strong>Luzzia</strong> es el responsable del tratamiento de tus datos personales.
              </p>
              <ul>
                <li><strong>Responsable:</strong> Jander Gómez</li>
                <li><strong>Email de contacto:</strong> privacy@luzzia.es</li>
                <li><strong>Sitio web:</strong> https://luzzia.es</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                2. Qué Datos Recopilamos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4>Datos que nos proporcionas directamente:</h4>
              <ul>
                <li><strong>Información de contacto:</strong> Nombre y dirección de email cuando te suscribes a nuestro newsletter</li>
                <li><strong>Comunicaciones:</strong> Mensajes que nos envías a través del formulario de contacto</li>
              </ul>
              
              <h4>Datos recopilados automáticamente:</h4>
              <ul>
                <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo</li>
                <li><strong>Datos de uso:</strong> Páginas visitadas, tiempo de permanencia, interacciones</li>
                <li><strong>Cookies:</strong> Pequeños archivos para mejorar tu experiencia (ver nuestra Política de Cookies)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                3. Cómo Usamos tus Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>Utilizamos tus datos personales para:</p>
              <ul>
                <li><strong>Proporcionar nuestros servicios:</strong> Mostrar precios de electricidad actualizados</li>
                <li><strong>Comunicación:</strong> Enviar newsletters y alertas de precios (solo si te has suscrito)</li>
                <li><strong>Mejora del servicio:</strong> Analizar el uso del sitio para mejorar la experiencia</li>
                <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y fiscales</li>
                <li><strong>Seguridad:</strong> Proteger nuestro sitio web y prevenir fraudes</li>
              </ul>
              
              <h4>Base legal del tratamiento:</h4>
              <ul>
                <li><strong>Consentimiento:</strong> Para newsletter y cookies no esenciales</li>
                <li><strong>Interés legítimo:</strong> Para análisis de uso y mejora del servicio</li>
                <li><strong>Cumplimiento legal:</strong> Para obligaciones fiscales y legales</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                4. Tus Derechos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>Bajo el RGPD, tienes los siguientes derechos:</p>
              <ul>
                <li><strong>Acceso:</strong> Obtener información sobre qué datos tenemos sobre ti</li>
                <li><strong>Rectificación:</strong> Corregir datos incorrectos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos ("derecho al olvido")</li>
                <li><strong>Limitación:</strong> Restringir el procesamiento de tus datos</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en formato legible por máquina</li>
                <li><strong>Oposición:</strong> Oponerte al tratamiento basado en interés legítimo</li>
                <li><strong>Retirada del consentimiento:</strong> Retirar el consentimiento en cualquier momento</li>
              </ul>
              
              <p>
                Para ejercer cualquiera de estos derechos, contacta con nosotros en{' '}
                <a href="mailto:privacy@luzzia.es" className="text-primary hover:underline">
                  privacy@luzzia.es
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                5. Seguridad de los Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos:</p>
              <ul>
                <li><strong>Cifrado:</strong> Todas las comunicaciones están cifradas con SSL/TLS</li>
                <li><strong>Acceso limitado:</strong> Solo personal autorizado tiene acceso a los datos</li>
                <li><strong>Respaldos seguros:</strong> Realizamos copias de seguridad regulares</li>
                <li><strong>Actualizaciones:</strong> Mantenemos nuestros sistemas actualizados</li>
                <li><strong>Monitoreo:</strong> Supervisamos continuamente la seguridad</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                6. Retención de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <ul>
                <li><strong>Datos de newsletter:</strong> Hasta que te des de baja o solicites la eliminación</li>
                <li><strong>Datos de contacto:</strong> 3 años desde el último contacto</li>
                <li><strong>Datos de uso:</strong> 25 meses (Google Analytics)</li>
                <li><strong>Logs técnicos:</strong> 12 meses para seguridad</li>
              </ul>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">¿Tienes Preguntas?</h3>
              <p className="text-muted-foreground mb-4">
                Si tienes alguna pregunta sobre esta política de privacidad o sobre cómo tratamos tus datos, 
                no dudes en contactarnos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:privacy@luzzia.es"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  privacy@luzzia.es
                </a>
                <span className="text-muted-foreground">
                  Responderemos en un plazo máximo de 30 días
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}