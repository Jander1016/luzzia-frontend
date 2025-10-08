'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <div className="w-4 h-4 animate-pulse bg-current rounded" />
      </Button>
    )
  }

  const themes = [
    {
      value: 'light',
      label: 'Claro',
      icon: <Sun className="w-4 h-4" />,
      description: 'Tema claro'
    },
    {
      value: 'dark',
      label: 'Oscuro',
      icon: <Moon className="w-4 h-4" />,
      description: 'Tema oscuro'
    },
    {
      value: 'system',
      label: 'Sistema',
      icon: <Monitor className="w-4 h-4" />,
      description: 'Según tu sistema'
    }
  ]

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 transition-all duration-200 hover:bg-accent"
        aria-label="Cambiar tema"
      >
        <motion.div
          key={resolvedTheme}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Theme selector */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 z-50"
            >
              <Card className="w-48 shadow-xl border">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Tema</span>
                  </div>
                  
                  <div className="space-y-1">
                    {themes.map((themeOption) => (
                      <Button
                        key={themeOption.value}
                        variant={theme === themeOption.value ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start gap-3 h-9"
                        onClick={() => {
                          setTheme(themeOption.value)
                          setIsOpen(false)
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {themeOption.icon}
                        </motion.div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm">{themeOption.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {themeOption.description}
                          </span>
                        </div>
                        {theme === themeOption.value && (
                          <motion.div
                            layoutId="activeTheme"
                            className="ml-auto w-2 h-2 bg-primary rounded-full"
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}