# 🌟 Luzzia - Smart Energy Management Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Optimiza tu consumo eléctrico con datos en tiempo real del mercado energético español**

[🚀 Demo en Vivo](https://luzzia.es) • [📚 Documentación](https://luzzia.es/aboutme) • [🐛 Reportar Bug](https://github.com/Jander1016/luzzia-frontend/issues)

</div>

---

## 📋 Tabla de Contenidos

- [🎯 Características](#-características)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [⚡ Instalación Rápida](#-instalación-rápida)
- [🚀 Desarrollo](#-desarrollo)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🎨 Diseño y UI](#-diseño-y-ui)
- [📊 Componentes Principales](#-componentes-principales)
- [🔧 Configuración](#-configuración)
- [📱 Responsive Design](#-responsive-design)
- [🌐 SEO Optimization](#-seo-optimization)
- [🚀 Despliegue](#-despliegue)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

---

## 🎯 Características

### ⚡ Funcionalidades Principales
- **📈 Análisis en Tiempo Real**: Datos actualizados del mercado eléctrico español (PVPC)
- **💰 Ahorro Inteligente**: Recomendaciones para reducir hasta un 30% en tu factura
- **📊 Visualización Avanzada**: Gráficos interactivos con Recharts
- **🔔 Alertas Personalizadas**: Notificaciones cuando los precios son óptimos
- **📱 100% Responsive**: Optimizado para todos los dispositivos
- **🎨 Tema Oscuro**: Interfaz moderna con soporte para tema oscuro
- **⚡ Performance**: Optimizado con Next.js 15 y React Compiler

### 🌟 Valor Único
- **Datos Oficiales**: Integración directa con Red Eléctrica de España (REE)
- **Predicciones Inteligentes**: Algoritmos que analizan patrones de consumo
- **Interfaz Intuitiva**: Diseño centrado en la experiencia del usuario
- **Acceso Gratuito**: Información valiosa sin costos ocultos

---

## 🛠️ Stack Tecnológico

### Frontend Core
- **[Next.js 15.5.4](https://nextjs.org/)** - Framework React con SSR/SSG
- **[React 19.1.0](https://reactjs.org/)** - Biblioteca de UI con React Compiler
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first

### UI & Visualización
- **[Recharts](https://recharts.org/)** - Gráficos interactivos en React
- **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos accesibles
- **[Lucide React](https://lucide.dev/)** - Iconos SVG modernos
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes reutilizables

### Herramientas de Desarrollo
- **[ESLint](https://eslint.org/)** - Linting y calidad de código
- **[Class Variance Authority](https://cva.style/)** - Gestión de variantes CSS
- **[CLSX](https://github.com/lukeed/clsx)** - Utilidad para clases condicionales

---

## ⚡ Instalación Rápida

### Prerrequisitos
```bash
node >= 18.0.0
pnpm >= 8.0.0  # Recomendado para mejor performance
```

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jander1016/luzzia-frontend.git
cd luzzia-frontend
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

```env
# .env.local
NEXT_PUBLIC_API_URL=https://luzzia-backend-production.up.railway.app/api/v1
NEXT_PUBLIC_APP_URL=https://luzzia.es
GOOGLE_SITE_VERIFICATION=tu_codigo_google
```

### 4. Ejecutar en desarrollo
```bash
pnpm dev
```

🎉 **¡Listo!** Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🚀 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo
pnpm build        # Construye para producción
pnpm start        # Inicia servidor de producción
pnpm lint         # Ejecuta ESLint
pnpm type-check   # Verifica tipos TypeScript
```

### Flujo de Desarrollo
1. **Feature Branch**: Crear rama desde `main`
2. **Desarrollo**: Implementar funcionalidad
3. **Testing**: Verificar en diferentes dispositivos
4. **Build**: Asegurar compilación exitosa
5. **Pull Request**: Revisar código antes de merge

---

## 📁 Estructura del Proyecto

```
luzzia-frontend/
├── 📁 src/
│   ├── 📁 app/                 # App Router (Next.js 13+)
│   │   ├── 📄 layout.tsx       # Layout principal
│   │   ├── 📄 page.tsx         # Página de inicio
│   │   ├── 📄 sitemap.ts       # Sitemap dinámico
│   │   ├── 📁 prices/          # Página de precios
│   │   ├── 📁 health/          # Diagnóstico del sistema
│   │   ├── 📁 aboutme/         # Información sobre Luzzia
│   │   ├── 📁 blog/            # Blog y artículos
│   │   └── 📁 contact/         # Formulario de contacto
│   │
│   ├── 📁 components/          # Componentes reutilizables
│   │   ├── 📁 ui/              # Componentes base (Shadcn)
│   │   ├── 📁 dashboard/       # Componentes del dashboard
│   │   ├── 📁 forms/           # Formularios
│   │   ├── 📁 layout/          # Componentes de layout
│   │   └── 📁 notifications/   # Sistema de notificaciones
│   │
│   ├── 📁 hooks/               # Custom hooks
│   │   ├── 📄 useElectricityData.ts    # Datos eléctricos
│   │   ├── 📄 useNotifications.ts      # Notificaciones
│   │   └── 📄 useResponsive.ts         # Responsive utilities
│   │
│   ├── 📁 lib/                 # Utilidades y configuraciones
│   │   ├── 📄 utils.ts         # Funciones utilitarias
│   │   └── 📁 api/             # Cliente API
│   │
│   ├── 📁 services/            # Servicios de datos
│   │   ├── 📄 apiClient.ts     # Cliente HTTP
│   │   ├── 📄 electricityService.ts
│   │   └── 📄 notificationService.ts
│   │
│   ├── 📁 styles/              # Estilos globales
│   └── 📁 types/               # Definiciones TypeScript
│
├── 📁 public/                  # Recursos estáticos
│   ├── 🖼️ logo.webp           # Logo optimizado
│   ├── 📄 robots.txt           # SEO robots
│   └── 📄 manifest.json        # PWA manifest
│
├── 📄 package.json             # Dependencias del proyecto
├── 📄 tailwind.config.ts       # Configuración Tailwind
├── 📄 tsconfig.json            # Configuración TypeScript
└── 📄 next.config.ts           # Configuración Next.js
```

---

## 🎨 Diseño y UI

### Tema de Colores
```css
/* Paleta principal */
--primary: #4f46e5      /* Indigo vibrante */
--secondary: #06b6d4    /* Cyan energético */
--accent: #f59e0b       /* Amber para alertas */
--success: #10b981      /* Verde para ahorros */
--danger: #ef4444       /* Rojo para precios altos */

/* Gradientes */
background: linear-gradient(135deg, #09121a, #1b2c62, #471581)
```

### Principios de Diseño
- **🎯 Claridad**: Información compleja presentada de forma simple
- **⚡ Performance**: Carga rápida y transiciones fluidas
- **📱 Mobile First**: Diseñado primero para móviles
- **♿ Accesibilidad**: WCAG 2.1 AA compliance
- **🎨 Consistencia**: Sistema de diseño coherente

---

## 📊 Componentes Principales

### 📈 LineChart (Dashboard)
```tsx
// Gráfico interactivo con datos en tiempo real
<LineChart 
  prices={electricityData} 
  period="today"
  showArea={false}
/>
```

### 🔔 NotificationSystem
```tsx
// Sistema de alertas inteligentes
<NotificationBell />
<NotificationPanel />
```

### 🎛️ PriceChart
```tsx
// Componente principal del dashboard
<PriceChart />
```

### 📱 Responsive Components
- **Mobile**: Optimizado para pantallas < 768px
- **Tablet**: Adaptado para 768px - 1024px  
- **Desktop**: Experiencia completa > 1024px

---

## 🔧 Configuración

### Variables de Entorno

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.luzzia.es/v1
NEXT_PUBLIC_APP_URL=https://luzzia.es

# SEO & Analytics
GOOGLE_SITE_VERIFICATION=codigo_verificacion
GOOGLE_ANALYTICS_ID=GA_TRACKING_ID

# Feature Flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_PWA=true
```

### Next.js Configuration
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    reactCompiler: true,  // React Compiler habilitado
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['luzzia.es'],
  },
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind breakpoints personalizados */
sm: '640px'   /* Móviles grandes */
md: '768px'   /* Tablets */
lg: '1024px'  /* Desktop pequeño */
xl: '1280px'  /* Desktop grande */
2xl: '1536px' /* Pantallas 4K */
```

### Estrategia Mobile-First
- **📊 Gráficos**: Puntos cada 3 horas en móvil
- **📊 Navegación**: Menu hamburguesa en dispositivos pequeños
- **⚡ Performance**: Lazy loading de componentes pesados
- **🖱️ Touch**: Gestos optimizados para táctil

---

## 🌐 SEO Optimization

### Metadatos Avanzados
- **🏷️ Open Graph**: Compartir optimizado en redes sociales
- **🔗 LinkedIn Cards**: Metadatos específicos para LinkedIn
- **🗺️ Sitemap**: Generación automática con `sitemap.ts`
- **🤖 Robots.txt**: Configuración de crawling
- **📊 Schema.org**: Structured data para mejor indexación

### Performance SEO
- **⚡ Core Web Vitals**: Optimizado para métricas de Google
- **🖼️ Imágenes**: Formato WebP con lazy loading
- **📦 Bundle**: Code splitting automático
- **💾 Caché**: Headers optimizados

---

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Deploy automático conectando GitHub
# 1. Conectar repositorio en vercel.com
# 2. Configurar variables de entorno
# 3. Deploy automático en cada push
```

### Manual Build
```bash
pnpm build        # Generar build optimizado
pnpm start        # Servidor de producción
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --only=production
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

---

## 🤝 Contribución

### Guías de Contribución
1. **🍴 Fork** el repositorio
2. **🌿 Crear** feature branch: `git checkout -b feature/nueva-funcionalidad`
3. **💻 Desarrollar** siguiendo las convenciones del proyecto
4. **✅ Testing** en diferentes dispositivos
5. **📝 Commit** con mensajes descriptivos
6. **🔄 Push** a tu fork
7. **📬 Pull Request** con descripción detallada

### Convenciones de Código
- **📝 TypeScript**: Tipado estricto requerido
- **🎨 Prettier**: Formateo automático
- **📏 ESLint**: Reglas de calidad seguidas
- **📱 Mobile First**: Diseño responsive obligatorio

### Reportar Issues
- **🐛 Bugs**: Usar template de bug report
- **💡 Features**: Usar template de feature request
- **📚 Documentación**: Mejoras siempre bienvenidas

---

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License**.

```
Copyright (c) 2025 Jander Gomez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

Ver [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **⚡ Red Eléctrica de España**: Por proporcionar datos públicos del mercado eléctrico
- **🎨 Shadcn/ui**: Por los componentes base excepcionales
- **📊 Recharts**: Por la biblioteca de gráficos potente y flexible
- **💙 Next.js Team**: Por el framework increíble

---

<div align="center">

**¿Te gusta Luzzia? ¡Dale una ⭐ en GitHub!**

[🌐 Sitio Web](https://luzzia.es) • [📧 Contacto](https://luzzia.es/contact) • [🐦 Twitter](https://twitter.com/luzzia_es)

Hecho con ❤️ en España 🇪🇸

</div>