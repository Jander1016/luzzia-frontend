# Script para probar las mejoras de rendimiento en Windows
Write-Host "🚀 Probando mejoras de rendimiento en Luzzia Frontend..." -ForegroundColor Green

# Build de la aplicación
Write-Host "📦 Building application..." -ForegroundColor Yellow
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error durante el build" -ForegroundColor Red
    exit 1
}

# Iniciar la aplicación en modo producción
Write-Host "🌐 Starting production server..." -ForegroundColor Yellow
$job = Start-Job -ScriptBlock { pnpm start }

# Esperar a que el servidor esté listo
Start-Sleep -Seconds 10

Write-Host "✅ Servidor iniciado en http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Para probar las mejoras:" -ForegroundColor Cyan
Write-Host "1. Abre Chrome DevTools"
Write-Host "2. Ve a la pestaña 'Lighthouse'"
Write-Host "3. Ejecuta un audit de Performance"
Write-Host "4. Compara los resultados con:"
Write-Host "   - Layout Shift (CLS) debería ser < 0.1"
Write-Host "   - Largest Contentful Paint (LCP) debería ser < 2.5s"
Write-Host "   - First Contentful Paint (FCP) debería ser < 1.8s"
Write-Host ""
Write-Host "📱 También prueba en modo mobile en DevTools" -ForegroundColor Magenta
Write-Host ""
Write-Host "Para detener el servidor, presiona Ctrl+C" -ForegroundColor Yellow

try {
    # Mantener el script corriendo hasta que se presione Ctrl+C
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "🛑 Stopping server..." -ForegroundColor Red
    Stop-Job $job
    Remove-Job $job
}