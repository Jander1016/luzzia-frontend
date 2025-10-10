"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, TrendingUp, Clock, BarChart3, Info } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const navLinks = [
  { 
    name: "Precio Luz Hoy", 
    href: "/", 
    icon: Zap,
    description: "Consulta precios en tiempo real"
  },
  { 
    name: "Estadísticas", 
    href: "/prices", 
    icon: BarChart3,
    description: "Análisis histórico de precios"
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
    icon: TrendingUp,
    description: "Consejos para ahorrar"
  },
  { 
    name: "Suscríbete", 
    href: "/contact", 
    icon: Clock,
    description: "Recibe alertas de precios"
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-background/95 backdrop-blur-lg border-b shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          {/* Logo y título */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo.webp"
                alt="Luzzia - Precio Luz Tiempo Real"
                width={200}
                height={50}
                className="inline-block dark:brightness-110"
                priority
                sizes="200px"
                quality={85}
              />
            </Link>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen((p) => !p)}
                aria-label="Toggle Menu"
                className="w-10 h-10"
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Desktop nav - Menú más grande */}
          <nav className="hidden md:grid md:grid-cols-5 gap-4">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex flex-col items-center p-4 rounded-lg border bg-card hover:bg-accent transition-all duration-200 hover:shadow-md"
                >
                  <IconComponent className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-sm text-center group-hover:text-primary">
                    {link.name}
                  </span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    {link.description}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile menu */}
        <div
          className={clsx(
            "md:hidden transition-all duration-300 overflow-hidden bg-background/95 backdrop-blur-lg border-t",
            open ? "max-h-96" : "max-h-0"
          )}
        >
          <nav className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  <IconComponent className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{link.name}</div>
                    <div className="text-xs text-muted-foreground">{link.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
