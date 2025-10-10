#!/bin/bash

# Script para probar las mejoras de rendimiento
echo "🚀 Probando mejoras de rendimiento en Luzzia Frontend..."

# Build de la aplicación
echo "📦 Building application..."
pnpm build

# Iniciar la aplicación en modo producción
echo "🌐 Starting production server..."
pnpm start &
SERVER_PID=$!

# Esperar a que el servidor esté listo
sleep 10

echo "✅ Servidor iniciado en http://localhost:3000"
echo ""
echo "🔍 Para probar las mejoras:"
echo "1. Abre Chrome DevTools"
echo "2. Ve a la pestaña 'Lighthouse'"
echo "3. Ejecuta un audit de Performance"
echo "4. Compara los resultados con:"
echo "   - Layout Shift (CLS) debería ser < 0.1"
echo "   - Largest Contentful Paint (LCP) debería ser < 2.5s"
echo "   - First Contentful Paint (FCP) debería ser < 1.8s"
echo ""
echo "📱 También prueba en modo mobile en DevTools"
echo ""
echo "Para detener el servidor, presiona Ctrl+C"

# Función para limpiar al salir
cleanup() {
    echo "🛑 Stopping server..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Capturar señales para limpiar
trap cleanup SIGINT SIGTERM

# Mantener el script corriendo
wait $SERVER_PID