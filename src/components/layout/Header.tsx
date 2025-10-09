"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
// import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useNotifications } from "@/hooks/useNotifications";

const navLinks = [
  { name: "Inicio", href: "/" },
  { name: "¿Qué es Luzzia?", href: "/aboutme" },
  { name: "Blog", href: "/blog" },
  { name: "Suscríbete", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { isOpen: isNotificationOpen, setIsOpen: setIsNotificationOpen } = useNotifications();

  return (
    <>
      <header className="bg-background/95 backdrop-blur-lg border-b shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold">
            <Image
              src="/logo.webp"
              alt="Luzzia Logo"
              width={180}
              height={180}
              className="inline-block ml-2 dark:brightness-110"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* <ThemeToggle /> */}
            <NotificationBell 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            />
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center space-x-3">
            {/* <ThemeToggle /> */}
            <NotificationBell 
              size="sm"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((p) => !p)}
              aria-label="Toggle Menu"
              className="w-9 h-9"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={clsx(
            "md:hidden transition-all duration-300 overflow-hidden bg-background/95 backdrop-blur-lg border-t",
            open ? "max-h-60" : "max-h-0"
          )}
        >
          <nav className="flex flex-col space-y-3 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}
