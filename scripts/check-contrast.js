#!/usr/bin/env node

/**
 * Contrast Checker for WCAG 2.1 AAA Compliance
 * Verifica que todos los colores cumplan con ratio 7:1
 */

const colorCombinations = [
  // Cards de precio - las 3 específicas requeridas (versiones AAA)
  { name: 'Card Precio Actual (Azul)', bg: '#1e3a8a', text: '#ffffff', expected: 7.0 },
  { name: 'Card Precio Más Bajo (Verde)', bg: '#166534', text: '#ffffff', expected: 7.0 },
  { name: 'Card Precio Más Alto (Rojo)', bg: '#991b1b', text: '#ffffff', expected: 7.0 },
  
  // Textos principales
  { name: 'Texto principal', bg: '#ffffff', text: '#171717', expected: 7.0 },
  { name: 'Texto secundario', bg: '#ffffff', text: '#525252', expected: 7.0 },
  
  // Enlaces y botones
  { name: 'Link principal', bg: '#ffffff', text: '#1e40af', expected: 7.0 },
  { name: 'Botón primario', bg: '#1e40af', text: '#ffffff', expected: 7.0 },
];

/**
 * Convierte hex a RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calcula la luminancia relativa
 */
function getLuminance(rgb) {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcula el ratio de contraste
 */
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Verifica todas las combinaciones
 */
function checkAllContrasts() {
  console.log('🎯 VALIDACIÓN DE CONTRASTE WCAG 2.1 AAA\n');
  console.log('═'.repeat(60));
  
  let allPassed = true;
  
  colorCombinations.forEach(({ name, bg, text, expected }) => {
    const ratio = getContrastRatio(bg, text);
    const passed = ratio >= expected;
    const status = passed ? '✅' : '❌';
    
    console.log(`${status} ${name}`);
    console.log(`   Fondo: ${bg} | Texto: ${text}`);
    console.log(`   Ratio: ${ratio.toFixed(2)}:1 (Requerido: ${expected}:1)`);
    console.log('');
    
    if (!passed) allPassed = false;
  });
  
  console.log('═'.repeat(60));
  
  if (allPassed) {
    console.log('🎉 ¡TODOS LOS CONTRASTES CUMPLEN AAA!');
    console.log('   Tu aplicación es accesible para usuarios con discapacidades visuales.');
  } else {
    console.log('⚠️  ALGUNOS CONTRASTES NO CUMPLEN AAA');
    console.log('   Revisa los colores marcados con ❌');
    process.exit(1);
  }
}

// Ejecutar verificación
if (require.main === module) {
  checkAllContrasts();
}

module.exports = { getContrastRatio, checkAllContrasts };