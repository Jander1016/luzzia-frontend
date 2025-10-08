'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Euro,
  Clock,
  Shield,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface StartupBannerProps {
  onClose?: () => void
  className?: string
}

export function StartupBanner({ onClose, className = '' }: StartupBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStat, setCurrentStat] = useState(0)

  const stats = [
    { number: '1,000+', label: 'Usuarios activos', icon: <Users className="w-4 h-4" /> },
    { number: '30%', label: 'Ahorro promedio', icon: <Euro className="w-4 h-4" /> },
    { number: '24/7', label: 'Datos en tiempo real', icon: <Clock className="w-4 h-4" /> },
    { number: '100%', label: 'Datos oficiales REE', icon: <Shield className="w-4 h-4" /> }
  ]

  useEffect(() => {
    // Mostrar banner después de 3 segundos
    const showTimer = setTimeout(() => setIsVisible(true), 3000)
    
    // Rotar estadísticas cada 3 segundos
    const statTimer = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length)
    }, 3000)

    return () => {
      clearTimeout(showTimer)
      clearInterval(statTimer)
    }
  }, [stats.length])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('luzzia-startup-banner-dismissed', 'true')
    onClose?.()
  }

  // No mostrar si ya fue cerrado
  const wasDismissed = typeof window !== 'undefined' && 
    localStorage.getItem('luzzia-startup-banner-dismissed')

  if (wasDismissed || !isVisible) return null

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-600 dark:via-teal-600 dark:to-cyan-600 ${className}`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left content */}
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="hidden sm:flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            
            <div className="text-center lg:text-left">
              <motion.h2 
                className="text-xl lg:text-2xl font-bold text-white mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                🚀 ¡Reduce tu factura eléctrica hasta un 30%!
              </motion.h2>
              <motion.p 
                className="text-white/90 text-sm lg:text-base"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Descubre cuándo usar tus electrodomésticos con datos oficiales en tiempo real
              </motion.p>
            </div>
          </div>

          {/* Center stats */}
          <div className="hidden md:flex items-center justify-center">
            <motion.div
              key={currentStat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[160px]"
            >
              <div className="flex items-center justify-center gap-2 text-white">
                {stats[currentStat].icon}
                <div className="text-center">
                  <div className="font-bold text-lg">{stats[currentStat].number}</div>
                  <div className="text-xs opacity-90">{stats[currentStat].label}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link href="/contact">
              <Button 
                size="sm"
                className="bg-white text-emerald-600 hover:bg-white/90 hover:text-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ x: 2 }}
                >
                  <Zap className="w-4 h-4" />
                  Empezar Gratis
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20 w-8 h-8"
              aria-label="Cerrar banner"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile stats */}
        <div className="md:hidden mt-4">
          <div className="flex justify-center">
            <motion.div
              key={currentStat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2"
            >
              <div className="flex items-center justify-center gap-2 text-white">
                {stats[currentStat].icon}
                <div className="text-center">
                  <span className="font-bold text-lg">{stats[currentStat].number}</span>
                  <span className="text-sm opacity-90 ml-2">{stats[currentStat].label}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}