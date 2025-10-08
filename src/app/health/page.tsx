'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { electricityService } from '@/services/electricityService'

export default function DiagnosticPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testDirectAPI = async () => {
    setLoading(true)
    addResult('🔍 Testing direct apiClient...')
    
    try {
      const todayPrices = await apiClient.get('/prices/today')
      addResult(`✅ Today prices: ${Array.isArray(todayPrices) ? todayPrices.length : 'Not an array'} elements`)
      
      const dashboardStats = await apiClient.get('/prices/dashboard-stats')
      addResult(`✅ Dashboard stats: ${JSON.stringify(dashboardStats)}`)
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addResult(`❌ Error en apiClient: ${errorMessage}`)
    }
    setLoading(false)
  }

  const testElectricityService = async () => {
    setLoading(true)
    addResult('🔍 Testing electricityService...')
    
    try {
      const todayPrices = await electricityService.getTodayPrices()
      addResult(`✅ getTodayPrices: ${todayPrices.length} elements`)
      
      const dashboardStats = await electricityService.getDashboardStats()
      addResult(`✅ getDashboardStats: ${JSON.stringify(dashboardStats)}`)
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addResult(`❌ Error en electricityService: ${errorMessage}`)
    }
    setLoading(false)
  }

  const testFetch = async () => {
    setLoading(true)
    addResult('🔍 Testing direct fetch...')
    
    try {
      const response = await fetch('http://localhost:4000/api/v1/prices/today')
      const data = await response.json()
      addResult(`✅ Direct fetch: ${data.length} elements`)
      
      const statsResponse = await fetch('http://localhost:4000/api/v1/prices/dashboard-stats')
      const statsData = await statsResponse.json()
      addResult(`✅ Dashboard stats fetch: ${JSON.stringify(statsData)}`)
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addResult(`❌ Error en fetch: ${errorMessage}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔍 Diagnóstico de Conectividad</h1>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={testFetch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Test Direct Fetch
        </button>
        
        <button 
          onClick={testDirectAPI}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50 ml-4"
        >
          Test ApiClient
        </button>
        
        <button 
          onClick={testElectricityService}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded disabled:opacity-50 ml-4"
        >
          Test ElectricityService
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">📊 Resultados:</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <div key={index} className="text-sm font-mono">
              {result}
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p>Ejecutando pruebas...</p>
        </div>
      )}
    </div>
  )
}