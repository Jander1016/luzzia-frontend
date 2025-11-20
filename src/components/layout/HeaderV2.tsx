"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Info, MailCheck, NotebookPen } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

// Navigation items optimized for SEO and UX
const navLinks = [
  {
    name: "Precio Luz Hoy",
    href: "/",
    icon: Zap,
    description: "Consulta precios en tiempo real"
  },
  {
    name: "¿Qué es Luzzia?",
    href: "/aboutme",
    icon: Info,
    description: "Conoce más sobre nosotros"
  },
  {
    name: "Blog",
    href: "/blog",
    icon: NotebookPen,
    description: "Consejos para ahorrar"
  },
  {
    name: "Suscríbete",
    href: "/contact",
    icon: MailCheck,
    description: "Recibe alertas de precios"
  },
];

export default function HeaderV2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl lg:max-w-6xl xl:max-w-7xl">
          <div className="flex h-20 items-center justify-center lg:justify-between">
            {/* Mobile: Logo y botón centrados */}
            <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
              <Link href="/" className="text-xl font-bold">
                <Image
                  src="/logo.webp"
                  alt="Luzzia Logo"
                  width={160}
                  height={160}
                  className="inline-block dark:brightness-110"
                  priority
                  quality={75}
                />
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="lg:hidden relative z-50 h-12 w-12 flex items-center justify-center"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Menu className={clsx(
                    "absolute inset-0 transition-all duration-300 size-8 mx-auto",
                    isMenuOpen ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                  )} />
                  <X className={clsx(
                    "absolute inset-0 transition-all duration-300 size-8 mx-auto",
                    isMenuOpen ? "opacity-100 rotate-0 scale-120" : "opacity-0 -rotate-180 scale-105"
                  )} />
                </div>
              </Button>
            </div>
            {/* Desktop Navigation - Moved to right */}
            <nav
              className="hidden lg:flex items-center space-x-2"
              aria-label="Navegación principal"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative flex items-center space-x-2 px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                >
                  <span className="relative z-10 text-lg">{link.name}</span>
                  <div className="absolute inset-0 bg-accent/60 rounded-xl scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200" />
                  <div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/95 backdrop-blur-xl"
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Menu Content */}
        <div
          id="mobile-menu"
          className={clsx(
            "relative flex flex-col h-full pt-24 px-6",
            "transition-transform duration-500 ease-out",
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
          role="navigation"
          aria-label="Navegación móvil"
        >
          <nav className="flex-1">
            <ul className="space-y-4" role="list">
              {navLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center space-x-4 p-4 text-foreground hover:bg-accent/60 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      onClick={closeMenu}
                      style={{
                        animationDelay: isMenuOpen ? `${index * 100}ms` : '0ms',
                        animation: isMenuOpen ? 'slideInFromRight 0.6s ease-out forwards' : 'none'
                      }}
                    >
                      <div className="flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-lg font-semibold group-hover:text-primary transition-colors">
                          {link.name}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {link.description}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer info in mobile menu */}
          <div className="py-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground text-center">
              © 2025 Luzzia - Energía Inteligente
            </p>
          </div>
        </div>
      </div>
    </>
  );
}