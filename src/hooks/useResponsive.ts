'use client'

import { useState, useEffect } from 'react'

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setScreenWidth(width)
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    // Verificar en el montaje
    checkDevice()

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenWidth
  }
}