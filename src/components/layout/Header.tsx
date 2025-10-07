"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { useNotifications } from "@/hooks/useNotifications";

const navLinks = [
  { name: "Inicio", href: "/" },
  { name: "¿Qué es Luzzia?", href: "/aboutme" },
  // { name: "Precios", href: "/precios" },
  { name: "Blog", href: "/blog" },
  { name: "Suscríbete", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { isOpen: isNotificationOpen, setIsOpen: setIsNotificationOpen } = useNotifications();

  return (
    <>
      <header className="bg-slate-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-brand">
            <Image
              src="/logo.webp"
              alt="Luzzia Logo"
              width={180}
              height={180}
              className="inline-block ml-2"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop notifications */}
          <div className="hidden md:flex space-x-6 relative">
            <NotificationBell 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            />
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile notification bell */}
            <NotificationBell 
              size="sm"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((p) => !p)}
              aria-label="Toggle Menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={clsx(
            "md:hidden transition-all duration-300 overflow-hidden bg-slate-700",
            open ? "max-h-60" : "max-h-0"
          )}
        >
          <nav className="flex flex-col space-y-3 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand transition-colors"
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
