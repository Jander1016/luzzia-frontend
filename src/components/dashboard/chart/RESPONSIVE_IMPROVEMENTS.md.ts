// Componente de documentación para las mejoras de responsive
// Este archivo documenta las optimizaciones realizadas

/*
MEJORAS DE RESPONSIVE IMPLEMENTADAS:

1. BARCHART MEJORADO:
   ✅ Tabla de datos para móvil (estilo como en la imagen)
   ✅ Barras más grandes y touch-friendly
   ✅ Scroll horizontal suave con indicadores
   ✅ Tooltips optimizados para pantallas pequeñas
   ✅ Menos líneas de grilla en móvil
   ✅ Colores simplificados y más contrastados

2. LINECHART RESPONSIVO:
   ✅ Versión SVG optimizada para móvil
   ✅ Tabla de resumen como en BarChart
   ✅ Puntos más grandes para touch
   ✅ Etiquetas adaptativas (menos en móvil)
   ✅ Scroll horizontal con viewBox dinámico

3. CHART SELECTOR:
   ✅ Diseño horizontal compacto para móvil
   ✅ Iconos y emojis para mejor UX
   ✅ Transiciones suaves
   ✅ Estados hover/active optimizados

4. ESTILOS CSS:
   ✅ Media queries específicas para móvil/tablet
   ✅ Scrollbar oculta pero funcional
   ✅ Touch scrolling optimizado
   ✅ Grid layouts responsivos

5. PATRONES DE LA IMAGEN:
   ✅ Tabla de datos arriba del gráfico
   ✅ Colores diferenciados por categoría
   ✅ Espaciado adecuado para móvil
   ✅ Tipografía legible en pantallas pequeñas
   ✅ Elementos touch-friendly (mín. 44px)

BREAKPOINTS UTILIZADOS:
- Móvil: < 768px (sm)
- Tablet: 768px - 1024px (md)
- Desktop: > 1024px (lg)

COMPONENTES AFECTADOS:
- BarChart.tsx (completamente reescrito)
- LineChart.responsive.tsx (nuevo componente)
- ChartTypeSelector.tsx (optimizado)
- charts.css (media queries añadidas)
*/

export const RESPONSIVE_IMPROVEMENTS = {
  mobile: {
    dataTable: "Tabla de resumen arriba del gráfico",
    touchTargets: "Elementos mínimo 44px para touch",
    scrolling: "Scroll horizontal suave con indicadores",
    typography: "Texto más grande y legible",
    colors: "Mayor contraste para pantallas pequeñas"
  },
  tablet: {
    hybrid: "Combina características móvil/desktop",
    spacing: "Espaciado intermedio optimizado",
    layout: "Grids adaptativos 2-3 columnas"
  },
  desktop: {
    fullFeatures: "Todas las características disponibles",
    hover: "Estados hover/focus completos",
    tooltips: "Tooltips detallados y posicionados"
  }
} as const

export default RESPONSIVE_IMPROVEMENTS