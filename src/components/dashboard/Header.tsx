'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'precios', label: 'Precios' },
  { id: 'ahorro', label: 'Ahorro' },
  { id: 'dispositivos', label: 'Dispositivos' },
] as const

export function DashboardHeader() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <header className="flex ">
       <Link href="/" className="text-xl font-bold text-brand">
          <Image
            src="/logo2.png"
            alt="Luzzia Logo"
            width={180}
            height={180}
            className="inline-block ml-2"
          />
        </Link>
      <Card>
        <CardContent className="p-4">
          <nav className="flex space-x-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </header>
  )
}